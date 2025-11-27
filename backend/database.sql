CREATE DATABASE IF NOT EXISTS db_tienda_autos CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE db_tienda_autos;

-- Tabla de Usuarios (con Roles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Insertar Admin por defecto
INSERT IGNORE INTO users (nombre, email, password, role) 
VALUES ('Super Admin', 'admin@automarket.com', 'admin123', 'ADMIN');

-- Tabla de Autos (Para el CRUD)
CREATE TABLE IF NOT EXISTS autos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    annio INT NOT NULL,
    precio INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(500), -- URL de la imagen
    descripcion TEXT,
    activo TINYINT(1) NOT NULL DEFAULT 1,
  	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);