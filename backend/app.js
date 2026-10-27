// backend/app.js
// Define la aplicación Express. Recibe la conexión a BD como parámetro
// para poder reemplazarla por un mock en las pruebas unitarias.
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const BCRYPT_ROUNDS = 10;
const TOKEN_EXPIRA = '2h';

export function createApp(db, { jwtSecret }) {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    // --- MIDDLEWARE DE SEGURIDAD ---

    // Valida el token JWT enviado en "Authorization: Bearer <token>"
    const requireAuth = (req, res, next) => {
        const [tipo, token] = (req.headers.authorization || '').split(' ');
        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json({ message: "Autenticación requerida" });
        }
        try {
            req.user = jwt.verify(token, jwtSecret);
            next();
        } catch {
            res.status(401).json({ message: "Token inválido o expirado" });
        }
    };

    // El rol se toma del token firmado por el servidor, no de lo que envíe el cliente
    const requireAdmin = (req, res, next) => {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Acceso denegado: se requiere rol ADMIN" });
        }
        next();
    };

    // --- RUTAS DE AUTENTICACIÓN ---

    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {
            if (err) return res.status(500).json(err);

            const user = result[0];
            // Se compara contra el hash almacenado (bcrypt)
            const valido = user && typeof password === 'string' && await bcrypt.compare(password, user.password);
            if (!valido) {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: TOKEN_EXPIRA });
            res.json({
                message: "Login OK",
                token,
                user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
            });
        });
    });

    app.post('/api/register', async (req, res) => {
        const { nombre, email, password } = req.body;
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }
        // La contraseña nunca se guarda en texto plano
        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        // Forzamos rol USER
        const sql = "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, 'USER')";

        db.query(sql, [nombre, email, hash], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Registro exitoso" });
        });
    });

    // --- RUTAS CRUD DE AUTOS (ADMIN) ---

    // 1. Obtener todos (GET)
    app.get('/api/autos', (req, res) => {
        db.query("SELECT * FROM autos", (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        });
    });

    // 2. Crear auto (POST)
    app.post('/api/autos', requireAuth, requireAdmin, (req, res) => {
        const { marca, modelo, annio, precio, stock, imagen, descripcion } = req.body;
        const sql = "INSERT INTO autos (marca, modelo, annio, precio, stock, imagen, descripcion) VALUES (?,?,?,?,?,?,?)";

        db.query(sql, [marca, modelo, annio, precio, stock, imagen, descripcion], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Auto creado", id: result.insertId });
        });
    });

    // 3. Actualizar auto (PUT)
    app.put('/api/autos/:id', requireAuth, requireAdmin, (req, res) => {
        const { id } = req.params;
        const { marca, modelo, annio, precio, stock, imagen, descripcion } = req.body;
        const sql = "UPDATE autos SET marca=?, modelo=?, annio=?, precio=?, stock=?, imagen=?, descripcion=? WHERE id=?";

        db.query(sql, [marca, modelo, annio, precio, stock, imagen, descripcion, id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Auto actualizado" });
        });
    });

    // 4. Eliminar auto (DELETE)
    app.delete('/api/autos/:id', requireAuth, requireAdmin, (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM autos WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Auto eliminado" });
        });
    });

    //5. Obtener un auto por ID (GET)
    app.get('/api/autos/:id', (req, res) => {
        const { id } = req.params;
        const sql = "SELECT * FROM autos WHERE id = ?";

        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).json({ message: "Auto no encontrado" });
            }

            // Devolvemos solo el objeto del auto, no un array
            res.json(result[0]);
        });
    });

    return app;
}
