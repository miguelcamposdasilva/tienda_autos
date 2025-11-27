// backend/server.js (Versión ES Modules)
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a Base de Datos
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'db_tienda_autos'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
    } else {
        console.log('Conectado a MySQL (Laragon)');
    }
});

// --- RUTAS DE AUTENTICACIÓN ---

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.length > 0) {
            const user = result[0];
            res.json({ 
                message: "Login OK", 
                user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role } 
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    });
});

app.post('/api/register', (req, res) => {
    const { nombre, email, password } = req.body;
    // Forzamos rol USER
    const sql = "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, 'USER')";
    
    db.query(sql, [nombre, email, password], (err, result) => {
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
app.post('/api/autos', (req, res) => {
    const { marca, modelo, annio, precio, stock, imagen, descripcion } = req.body;
    const sql = "INSERT INTO autos (marca, modelo, annio, precio, stock, imagen, descripcion) VALUES (?,?,?,?,?,?,?)";
    
    db.query(sql, [marca, modelo, annio, precio, stock, imagen, descripcion], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Auto creado", id: result.insertId });
    });
});

// 3. Actualizar auto (PUT)
app.put('/api/autos/:id', (req, res) => {
    const { id } = req.params;
    const { marca, modelo, annio, precio, stock, imagen, descripcion } = req.body;
    const sql = "UPDATE autos SET marca=?, modelo=?, annio=?, precio=?, stock=?, imagen=?, descripcion=? WHERE id=?";
    
    db.query(sql, [marca, modelo, annio, precio, stock, imagen, descripcion, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Auto actualizado" });
    });
});

// 4. Eliminar auto (DELETE)
app.delete('/api/autos/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM autos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Auto eliminado" });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});