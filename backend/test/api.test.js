// backend/test/api.test.js
// Pruebas unitarias de la API usando el runner nativo de Node (node:test) y Supertest.
// La base de datos se reemplaza por un mock, por lo que no se necesita MySQL para ejecutarlas.
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';

const SECRETO = 'secreto-de-prueba';

// Mock de la conexión mysql2: guarda cada consulta y responde con lo que se configure
function crearDbMock() {
    const db = {
        llamadas: [],
        respuesta: { err: null, result: [] },
        query(sql, params, cb) {
            if (typeof params === 'function') {
                cb = params;
                params = [];
            }
            db.llamadas.push({ sql, params });
            cb(db.respuesta.err, db.respuesta.result);
        }
    };
    return db;
}

const AUTO = {
    id: 1, marca: 'Toyota', modelo: 'Corolla', annio: 2024,
    precio: 15000000, stock: 3, imagen: 'http://img', descripcion: 'Sedán'
};

const HASH_ADMIN = bcrypt.hashSync('admin123', 4);
const USUARIO_ADMIN = { id: 1, nombre: 'Super Admin', email: 'admin@automarket.com', password: HASH_ADMIN, role: 'ADMIN' };

const tokenDe = (role, secreto = SECRETO) => jwt.sign({ id: 1, role }, secreto, { expiresIn: '1h' });
const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe('Autenticación - POST /api/login', () => {
    let db, app;
    beforeEach(() => { db = crearDbMock(); app = createApp(db, { jwtSecret: SECRETO }); });

    it('devuelve 200, los datos del usuario y un token JWT con credenciales válidas', async () => {
        db.respuesta.result = [USUARIO_ADMIN];

        const res = await request(app).post('/api/login').send({ email: 'admin@automarket.com', password: 'admin123' });

        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Login OK');
        assert.equal(res.body.user.role, 'ADMIN');
        assert.equal(jwt.verify(res.body.token, SECRETO).role, 'ADMIN');
    });

    it('no expone la contraseña ni el hash en la respuesta del login', async () => {
        db.respuesta.result = [USUARIO_ADMIN];

        const res = await request(app).post('/api/login').send({ email: 'admin@automarket.com', password: 'admin123' });

        assert.equal(res.body.user.password, undefined);
        assert.ok(!JSON.stringify(res.body).includes(HASH_ADMIN));
    });

    it('devuelve 401 si el email no existe', async () => {
        db.respuesta.result = [];

        const res = await request(app).post('/api/login').send({ email: 'x@mail.com', password: 'mala' });

        assert.equal(res.status, 401);
        assert.equal(res.body.message, 'Credenciales incorrectas');
    });

    it('devuelve 401 si la contraseña es incorrecta', async () => {
        db.respuesta.result = [USUARIO_ADMIN];

        const res = await request(app).post('/api/login').send({ email: 'admin@automarket.com', password: 'otra' });

        assert.equal(res.status, 401);
    });

    it('usa consultas parametrizadas (protección contra SQL Injection)', async () => {
        db.respuesta.result = [];
        const payload = "' OR '1'='1";

        const res = await request(app).post('/api/login').send({ email: payload, password: payload });

        assert.equal(res.status, 401);
        assert.ok(!db.llamadas[0].sql.includes(payload), 'el input no debe concatenarse en el SQL');
        assert.deepEqual(db.llamadas[0].params, [payload]);
    });

    it('devuelve 500 si la base de datos falla', async () => {
        db.respuesta.err = { code: 'ER_CON' };

        const res = await request(app).post('/api/login').send({ email: 'a@a.cl', password: '123456' });

        assert.equal(res.status, 500);
    });
});

describe('Autenticación - POST /api/register', () => {
    let db, app;
    beforeEach(() => { db = crearDbMock(); app = createApp(db, { jwtSecret: SECRETO }); });

    it('registra un usuario nuevo', async () => {
        db.respuesta.result = { insertId: 5 };

        const res = await request(app).post('/api/register').send({ nombre: 'Ana', email: 'ana@mail.com', password: '123456' });

        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Registro exitoso');
    });

    it('almacena la contraseña como hash bcrypt y nunca en texto plano', async () => {
        db.respuesta.result = { insertId: 5 };

        await request(app).post('/api/register').send({ nombre: 'Ana', email: 'ana@mail.com', password: 'clave123' });

        const guardada = db.llamadas[0].params[2];
        assert.notEqual(guardada, 'clave123');
        assert.match(guardada, /^\$2[aby]\$10\$/);
        assert.ok(await bcrypt.compare('clave123', guardada));
    });

    it('rechaza contraseñas de menos de 6 caracteres (validación en servidor)', async () => {
        const res = await request(app).post('/api/register').send({ nombre: 'Ana', email: 'ana@mail.com', password: '123' });

        assert.equal(res.status, 400);
        assert.equal(db.llamadas.length, 0);
    });

    it('fuerza el rol USER aunque el cliente envíe role ADMIN (escalamiento de privilegios)', async () => {
        db.respuesta.result = { insertId: 6 };

        await request(app).post('/api/register').send({ nombre: 'Eve', email: 'eve@mail.com', password: '123456', role: 'ADMIN' });

        assert.match(db.llamadas[0].sql, /'USER'/);
        assert.ok(!db.llamadas[0].params.includes('ADMIN'));
    });

    it('devuelve 500 cuando el email ya existe', async () => {
        db.respuesta.err = { code: 'ER_DUP_ENTRY' };

        const res = await request(app).post('/api/register').send({ nombre: 'Ana', email: 'ana@mail.com', password: '123456' });

        assert.equal(res.status, 500);
    });
});

describe('Catálogo - GET /api/autos (público)', () => {
    let db, app;
    beforeEach(() => { db = crearDbMock(); app = createApp(db, { jwtSecret: SECRETO }); });

    it('devuelve la lista de autos sin requerir autenticación', async () => {
        db.respuesta.result = [AUTO, { ...AUTO, id: 2, modelo: 'Yaris' }];

        const res = await request(app).get('/api/autos');

        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);
    });

    it('devuelve un auto por id', async () => {
        db.respuesta.result = [AUTO];

        const res = await request(app).get('/api/autos/1');

        assert.equal(res.status, 200);
        assert.equal(res.body.modelo, 'Corolla');
        assert.deepEqual(db.llamadas[0].params, ['1']);
    });

    it('devuelve 404 si el auto no existe', async () => {
        db.respuesta.result = [];

        const res = await request(app).get('/api/autos/999');

        assert.equal(res.status, 404);
        assert.equal(res.body.message, 'Auto no encontrado');
    });

    it('devuelve 500 si la base de datos falla', async () => {
        db.respuesta.err = { code: 'ER_CON' };

        const res = await request(app).get('/api/autos');

        assert.equal(res.status, 500);
    });
});

describe('Inventario (Admin) - POST/PUT/DELETE /api/autos con token ADMIN', () => {
    let db, app;
    const admin = bearer(tokenDe('ADMIN'));
    beforeEach(() => { db = crearDbMock(); app = createApp(db, { jwtSecret: SECRETO }); });

    it('crea un auto y devuelve su id', async () => {
        db.respuesta.result = { insertId: 10 };

        const res = await request(app).post('/api/autos').set(admin).send(AUTO);

        assert.equal(res.status, 200);
        assert.equal(res.body.id, 10);
        assert.equal(db.llamadas[0].params.length, 7);
    });

    it('actualiza un auto existente', async () => {
        db.respuesta.result = { affectedRows: 1 };

        const res = await request(app).put('/api/autos/1').set(admin).send({ ...AUTO, precio: 14000000 });

        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Auto actualizado');
        assert.equal(db.llamadas[0].params.at(-1), '1');
    });

    it('elimina un auto', async () => {
        db.respuesta.result = { affectedRows: 1 };

        const res = await request(app).delete('/api/autos/1').set(admin);

        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Auto eliminado');
    });

    it('devuelve 500 si falla la creación', async () => {
        db.respuesta.err = { code: 'ER_BAD_NULL_ERROR' };

        const res = await request(app).post('/api/autos').set(admin).send({});

        assert.equal(res.status, 500);
    });
});

describe('Control de acceso (OWASP A01) - rutas de administración', () => {
    let db, app;
    beforeEach(() => { db = crearDbMock(); app = createApp(db, { jwtSecret: SECRETO }); });

    const rutasProtegidas = [
        ['post', '/api/autos'],
        ['put', '/api/autos/1'],
        ['delete', '/api/autos/1']
    ];

    for (const [metodo, ruta] of rutasProtegidas) {
        it(`${metodo.toUpperCase()} ${ruta} sin token devuelve 401 y no toca la BD`, async () => {
            const res = await request(app)[metodo](ruta).send(AUTO);

            assert.equal(res.status, 401);
            assert.equal(db.llamadas.length, 0);
        });

        it(`${metodo.toUpperCase()} ${ruta} con token de USER devuelve 403`, async () => {
            const res = await request(app)[metodo](ruta).set(bearer(tokenDe('USER'))).send(AUTO);

            assert.equal(res.status, 403);
            assert.equal(db.llamadas.length, 0);
        });
    }

    it('rechaza un token ADMIN firmado con otro secreto (token falsificado)', async () => {
        const res = await request(app).delete('/api/autos/1').set(bearer(tokenDe('ADMIN', 'secreto-del-atacante')));

        assert.equal(res.status, 401);
        assert.equal(db.llamadas.length, 0);
    });

    it('rechaza un token expirado', async () => {
        const expirado = jwt.sign({ id: 1, role: 'ADMIN', exp: Math.floor(Date.now() / 1000) - 60 }, SECRETO);

        const res = await request(app).delete('/api/autos/1').set(bearer(expirado));

        assert.equal(res.status, 401);
        assert.equal(res.body.message, 'Token inválido o expirado');
    });

    it('rechaza un header Authorization mal formado', async () => {
        const res = await request(app).delete('/api/autos/1').set({ Authorization: 'Basic abc' });

        assert.equal(res.status, 401);
    });
});
