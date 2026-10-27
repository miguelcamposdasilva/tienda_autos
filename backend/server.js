// backend/server.js (Versión ES Modules)
import crypto from 'node:crypto';
import mysql from 'mysql2';
import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

// Configuración de la conexión a Base de Datos
// (las variables de entorno se usan en Docker; los valores por defecto son los de Laragon)
// Se usa un pool para que las conexiones caídas se recuperen automáticamente
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_tienda_autos',
    connectionLimit: 10
});

db.getConnection((err, conn) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
    } else {
        console.log('Conectado a MySQL');
        conn.release();
    }
});

// Secreto para firmar los JWT. Si no se define, se genera uno aleatorio
// (las sesiones se invalidan al reiniciar el servidor).
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    jwtSecret = crypto.randomBytes(32).toString('hex');
    console.warn('JWT_SECRET no definido: se generó un secreto temporal');
}

const app = createApp(db, { jwtSecret });

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
