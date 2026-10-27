# 🚗 Automarket - Plataforma de Venta de Vehículos

![Status](https://img.shields.io/badge/Status-Completado-success)
![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![Tests](https://img.shields.io/badge/Tests-56%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/miguelcamposdasilva/tienda_autos)

**Automarket** es una aplicación web Full Stack para la gestión y comercialización de vehículos. Los usuarios pueden navegar el catálogo, filtrar vehículos, gestionar un carrito y solicitar cotizaciones, mientras que los administradores cuentan con un panel privado para el CRUD del inventario.

El proyecto se desplegó en **AWS EC2** con **Nginx** como servidor web y proxy inverso, y cuenta con un entorno **Docker Compose** para ejecutarlo y probarlo de forma reproducible.

Como parte del ramo **ISY1102 Seguridad y Calidad en el Desarrollo de Software (Duoc UC)**, el sistema fue sometido a un plan de pruebas completo: pruebas unitarias, análisis estático con SonarQube, pruebas de carga con JMeter, auditorías con Google Lighthouse y pruebas manuales de seguridad.

---

## 🛠️ Tecnologías

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 19 + Vite**
* **React Router DOM:** rutas públicas y privadas.
* **Context API:** estado global de autenticación (`AuthContext`) y carrito (`CartContext`).
* **CSS3 (Glassmorphism):** diseño oscuro y responsivo.

### Backend
* ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js 22** + ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Express 5** (ES Modules)
* **MySQL2:** pool de conexiones con consultas parametrizadas.
* **bcrypt:** hash de contraseñas.
* **jsonwebtoken (JWT):** sesiones firmadas y control de acceso por rol.

### Base de datos
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) **MySQL 8**

### Infraestructura
* ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) **Docker Compose:** base de datos, API, frontend y SonarQube.
* ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) **Nginx:** sirve el frontend y redirige `/api` al backend.
* ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) **AWS EC2 (Ubuntu) + PM2:** despliegue en la nube.

### Calidad y pruebas
* **Node test runner + Supertest:** pruebas unitarias de la API.
* **Karma + Jasmine + Istanbul:** pruebas unitarias del frontend con cobertura.
* **SonarQube:** análisis estático.
* **Apache JMeter:** pruebas de carga.
* **Google Lighthouse:** rendimiento, accesibilidad y buenas prácticas.

---

## ✨ Funcionalidades

### 👤 Usuarios (público)
* **Inicio:** autos destacados y novedades.
* **Catálogo:** listado con filtros por **nombre** y **rango de precios**.
* **Carrito:** agregar, quitar y modificar cantidades, con persistencia local.
* **Cotizar:** formulario de solicitud de cotización.
* **Registro e inicio de sesión:** las cuentas nuevas se crean siempre con rol `USER`.

### 🛡️ Administrador (privado)
* **Login seguro:** el servidor emite un token JWT con el rol del usuario.
* **Panel de control:** CRUD de vehículos (imagen, stock, precio, descripción). Cada operación envía el token y el servidor valida el rol `ADMIN`.

---

## 🔐 Seguridad

| Control | Implementación |
|---|---|
| Contraseñas | Se almacenan con **bcrypt** (10 rondas), nunca en texto plano |
| Autenticación | **JWT** firmado con `JWT_SECRET`, con expiración de 2 horas |
| Autorización | Los middlewares `requireAuth` y `requireAdmin` protegen POST, PUT y DELETE de `/api/autos` |
| Inyección SQL | Todas las consultas son parametrizadas |
| Registro | Contraseña de al menos 6 caracteres, validada en el servidor; el rol `USER` es forzado |

Las mejoras pendientes, como rate limiting, cabeceras de seguridad y CORS restringido, están documentadas como incidentes en el informe de pruebas del proyecto.

---

## 🚀 Ejecución con Docker (recomendado)

Requisito: **Docker Desktop**.

```bash
git clone https://github.com/miguelcamposdasilva/tienda_autos.git
cd tienda_autos
docker compose up -d --build
```

| Servicio | URL |
|---|---|
| Web | http://localhost:8080 |
| API | http://localhost:3000/api/autos |
| MySQL | localhost:3307 (usuario `root`, contraseña `automarket_root`) |

La base de datos se crea automáticamente con `backend/database.sql` (esquema y usuario administrador) y `backend/seed.sql` (5 vehículos de ejemplo).

**Credencial de laboratorio:** `admin@automarket.com` / `admin123`. Úsala solo en el entorno local y cámbiala en cualquier despliegue real.

Para reiniciar la base de datos desde cero:

```bash
docker compose down -v
docker compose up -d --build
```

---

## 💻 Ejecución local (sin Docker)

Requisitos: Node.js 22, MySQL 8 (o Laragon/XAMPP) y Git.

1. **Base de datos:** importa `backend/database.sql` y luego `backend/seed.sql`. Si tenías una base anterior, vuelve a importarla: la contraseña del administrador ahora se guarda con hash.
2. **Backend:**
   ```bash
   cd backend
   npm install
   npm start          # http://localhost:3000
   ```
   La configuración se toma de variables de entorno:

   | Variable | Valor por defecto |
   |---|---|
   | `DB_HOST` | `localhost` |
   | `DB_PORT` | `3307` |
   | `DB_USER` | `root` |
   | `DB_PASSWORD` | *(vacía)* |
   | `DB_NAME` | `db_tienda_autos` |
   | `JWT_SECRET` | aleatorio en cada arranque (las sesiones se invalidan al reiniciar) |

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev        # http://localhost:5173 (redirige /api a localhost:3000)
   ```

---

## 🧪 Pruebas

| Tipo | Comando | Resultado |
|---|---|---|
| Unitarias backend | `cd backend && npm test` (cobertura: `npm run test:coverage`) | 28/28, 100% de líneas |
| Unitarias frontend | `cd frontend && npm test` | 28/28, 100% de líneas en módulos de lógica |
| Análisis estático | `docker compose --profile sonar up -d sonarqube` y luego `sonar-scanner` | Quality Gate aprobado |
| Carga | `pruebas/jmeter/automarket-carga.jmx` | 1.100 peticiones, 0% de error, p95 de 94 ms |
| Lighthouse | Chrome DevTools sobre http://localhost:8080 | Reportes en `pruebas/evidencias/` |
| Seguridad de la API | `bash pruebas/scripts/pruebas-api.sh` | Registro en `pruebas/evidencias/pruebas-api.txt` |

La guía paso a paso de cada prueba está en **[pruebas/README.md](pruebas/README.md)**.

> ⚠️ Las pruebas de carga y de seguridad deben ejecutarse **solo contra el entorno propio de laboratorio** (Docker local), nunca contra sistemas de terceros.

```
pruebas/
├── README.md              Guía de ejecución de todas las pruebas
├── jmeter/                Plan de carga (.jmx)
├── scripts/               Script de pruebas de seguridad sobre la API
└── evidencias/            Resultados: unitarias, JMeter, Lighthouse, SonarQube y capturas
```

---

## 📡 Documentación de la API

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/login` | Valida las credenciales con bcrypt y devuelve `{ token, user }`. El token expira en 2 h |
| POST | `/api/register` | Crea un usuario con rol `USER`. La contraseña debe tener al menos 6 caracteres |

### Vehículos

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/autos` | Público | Lista todos los autos |
| GET | `/api/autos/:id` | Público | Obtiene un auto (404 si no existe) |
| POST | `/api/autos` | ADMIN | Crea un auto |
| PUT | `/api/autos/:id` | ADMIN | Actualiza un auto |
| DELETE | `/api/autos/:id` | ADMIN | Elimina un auto |

Las rutas protegidas exigen el encabezado `Authorization: Bearer <token>`. Responden **401** si falta el token o es inválido o está expirado, y **403** si el rol no es `ADMIN`.

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@automarket.com","password":"admin123"}' | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

curl -X DELETE http://localhost:3000/api/autos/5 -H "Authorization: Bearer $TOKEN"
```

---

## ☁️ Despliegue en AWS

El proyecto se desplegó en una instancia **EC2 t2.micro con Ubuntu**. Nginx sirve el build de React y redirige `/api` al backend, que se mantiene activo con PM2:

```nginx
server {
    listen 80;
    server_name _;

    # Frontend (React build)
    location / {
        root /home/ubuntu/tienda_autos/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend (API proxy)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

En producción hay que definir `JWT_SECRET` y las credenciales de la base de datos como variables de entorno, y habilitar HTTPS (por ejemplo, con Let's Encrypt).

---

## 👥 Equipo

* **Miguel Campos** - *Full Stack Developer* - [GitHub](https://github.com/miguelcamposdasilva)
* **Francisco Godoy** - *Full Stack Developer* - [GitHub](https://github.com/Francisco2105)
* **Franco Garay** - *Full Stack Developer* - [GitHub](https://github.com/francog14)

---
*Proyecto realizado para **Duoc UC**, 2025-2026.*
*Todos los Derechos Reservados ©*
