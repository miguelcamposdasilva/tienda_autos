# 🚗 Automarket - Plataforma de Venta de Vehículos

![Status](https://img.shields.io/badge/Status-Completado-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Automarket** es una aplicación web Full Stack diseñada para la gestión y comercialización de vehículos. El sistema permite a los usuarios navegar por un catálogo, filtrar vehículos y gestionar un carrito de compras, mientras que los administradores cuentan con un panel privado para realizar operaciones CRUD completas sobre el inventario.

El proyecto fue desplegado en una instancia **AWS EC2** utilizando **Nginx** como servidor web y proxy inverso.

---

## 🛠️ Tecnologías Implementadas

El proyecto utiliza una arquitectura desacoplada (Frontend separado del Backend).

### Frontend (Cliente)
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React + Vite:** Para una interfaz rápida y reactiva.
* **React Router DOM:** Gestión de rutas y navegación (Públicas y Privadas).
* **Context API:** Manejo de estado global para Autenticación (AuthContext) y Carrito de Compras (CartContext).
* **CSS3 (Glassmorphism):** Diseño moderno, oscuro y responsivo.

### Backend (API)
* ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js:** Entorno de ejecución.
* ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Express.js:** Framework para crear la API RESTful.
* **MySQL2:** Conector optimizado para la base de datos.
* **CORS:** Gestión de seguridad de origen cruzado.

### Base de Datos
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) **MySQL:** Base de datos relacional para usuarios y vehículos.

### Infraestructura & Despliegue (DevOps)
* ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) **AWS EC2 (Ubuntu):** Servidor en la nube.
* ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) **Nginx:** Servidor web y Reverse Proxy.
* **PM2:** Gestor de procesos para mantener el backend activo en producción.
* **Git & GitHub:** Control de versiones.

---

## ✨ Funcionalidades Principales

### 👤 Usuarios (Público)
* **Inicio:** Visualización de autos destacados y novedades.
* **Catálogo:** Listado completo con filtros dinámicos por **Nombre** y **Rango de Precios**.
* **Carrito de Compras:** Agregar, eliminar y modificar cantidad de productos (Persistencia local).
* **Registro e Inicio de Sesión:** Creación de cuentas de usuario.

### 🛡️ Administrador (Privado)
* **Login Seguro:** Acceso restringido solo para usuarios con rol `ADMIN`.
* **Panel de Control (Dashboard):** Interfaz gráfica para gestión de inventario.
* **CRUD de Autos:**
    * Crear nuevos vehículos (Imagen, Stock, Precio, Descripción).
    * Editar información existente.
    * Eliminar vehículos de la base de datos.

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu computadora.

### Prerrequisitos
* Node.js (v18 o superior)
* MySQL Server (o Laragon/XAMPP)
* Git

### 1. Clonar el repositorio
```bash
git clone [https://github.com/miguelcamposdasilva/tienda_autos.git](https://github.com/miguelcamposdasilva/tienda_autos.git)
cd tienda_autos
```

---

### 2. Configurar base de datos 

CREATE DATABASE IF NOT EXISTS automarket_db;
USE automarket_db;

-- Tabla de Usuarios

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Usuario Admin por defecto
INSERT INTO users (nombre, email, password, role) 
VALUES ('Super Admin', 'admin@automarket.com', 'admin123', 'ADMIN');

-- Tabla de Autos
CREATE TABLE autos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    annio INT NOT NULL,
    precio INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(500),
    descripcion TEXT
);

---

### Configurar y ejecutar backend 

```bash 
cd backend
npm install
# Asegúrate de configurar las credenciales de BD en server.js
node server.js
```
**El servidor correrá en http://localhost:3000**

---

### 4. Configurar y ejecutar Frontend 

```bash
cd frontend
npm install
npm run dev
```
**La web correrá en http://localhost:5173**

---

## 5. ARQUITECTURA DE DESPLIEGUE EN AWS

**El proyecto fue desplegado en una instancia EC2 t2.micro con Ubuntu.**

*Configuración del Servidor (Nginx)*
*Se utilizó Nginx como Proxy Inverso para servir los archivos estáticos de React y redirigir las peticiones /api al backend de Node.js.*

server {
    listen 80;
    server_name _;

    #Frontend (React Build)
    location / {
        root /home/ubuntu/tienda_autos/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend (API Proxy)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

## 6. Documentación de la API 

Método	Endpoint	Descripción
GET	    /api/autos	Obtiene todos los autos.
GET	    /api/autos/:id	Obtiene un auto específico.
POST	/api/autos	Crea un nuevo auto (Requiere JSON).
PUT	/api/autos/:id	Actualiza un auto existente.
DELETE	/api/autos/:id	Elimina un auto.

## Autenticación 

Método Endpoint  Descripción
POST /api/login   Valida credenciales y devuelve rol.
POST /api/register  Crea un usuario nuevo (Rol USER).

* **[Miguel Campos]** - *Full Stack Developer* - [GitHub](https://github.com/miguelcamposdasilva)
* **[Francisco Godoy]** - *Full Stack Developer* - [GitHub](https://github.com/Francisco2105)
* * **[Franco Garay]** - *Full Stack Developer* - [GitHub](https://github.com/francog14)
 
  * [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/miguelcamposdasilva/tienda_autos)
---
*Proyecto realizado para **Duoc UC**, 2025.*
*Todos los Derechos Reservados ©*
