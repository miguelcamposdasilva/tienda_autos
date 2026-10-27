# Guía de ejecución de pruebas — Automarket

Comandos en **PowerShell** desde la raíz del repositorio (`tienda_autos`).
Requisitos: Node 18+, Docker Desktop abierto y Google Chrome.

## 0. Levantar el sistema (Docker)

```powershell
docker compose up -d --build
```

| Servicio | URL |
|---|---|
| Frontend (Nginx + React build) | http://localhost:8080 |
| API (Express) | http://localhost:3000/api/autos |
| MySQL | localhost:3307 (root / automarket_root) |

La BD se crea con `backend/database.sql` y se carga con 5 autos de `backend/seed.sql`.
Para reiniciar la BD desde cero: `docker compose down -v` y luego `docker compose up -d`.

---

## 1. Pruebas unitarias (dentro del código)

### Backend — Node test runner + Supertest (BD simulada, no requiere MySQL)
```powershell
cd backend
npm install
npm run test:coverage
```
📸 **Captura:** la lista de 16 pruebas en verde y la tabla de cobertura del final.

### Frontend — Karma + Jasmine (Chrome Headless)
```powershell
cd frontend
npm install --legacy-peer-deps
npm test
Start-Process .\coverage\html\index.html
```
📸 **Captura:** las 27 pruebas `SUCCESS` con el resumen de cobertura, y el reporte HTML de cobertura.

> La prueba `[HALLAZGO] un rol ADMIN falsificado en localStorage concede acceso al panel` **pasa a propósito**: demuestra la vulnerabilidad de control de acceso (OWASP A01).

---

## 2. Análisis estático — SonarQube

```powershell
docker compose --profile sonar up -d sonarqube
```
1. Abrir http://localhost:9000 (usuario `admin` / clave `admin`; pedirá cambiarla).
2. *My Account → Security → Generate Token* (tipo **Global Analysis Token**) y copiar el token.
3. Generar la cobertura (paso 1, backend y frontend) y luego ejecutar el scanner:

```powershell
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 -e SONAR_TOKEN=PEGAR_TOKEN_AQUI -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli
```
4. Abrir http://localhost:9000/dashboard?id=automarket

📸 **Capturas:** el Overview (Quality Gate, Bugs, Vulnerabilities, Hotspots, Code Smells, Coverage), la pestaña *Issues* filtrada por *Vulnerability* y por *Bug*, y la pestaña *Measures → Coverage*.

La configuración está en `sonar-project.properties`. Los resultados del primer análisis están en `pruebas/evidencias/sonarqube-resultados.txt`.

---

## 3. Rendimiento — JMeter

Plan: `pruebas/jmeter/automarket-carga.jmx`

| Escenario | Usuarios | Iteraciones | Peticiones | Criterio de aceptación |
|---|---|---|---|---|
| ESC-01 Navegación del catálogo | 50 (rampa 10 s) | 10 | `GET /api/autos`, `GET /api/autos/{id}` | Código 200 y tiempo < 2000 ms |
| ESC-02 Inicio de sesión | 20 (rampa 10 s) | 5 | `POST /api/login` | Respuesta "Login OK" y tiempo < 1500 ms |

### Opción A: con interfaz gráfica (para las capturas)
1. Descargar JMeter (https://jmeter.apache.org/download_jmeter.cgi). Requiere Java 8+.
2. Ejecutar `bin\jmeter.bat` → *File → Open* → `automarket-carga.jmx`.
3. Presionar ▶ (Start).
📸 **Capturas:** *Summary Report*, *Aggregate Report* y el plan (árbol de la izquierda).

### Opción B: sin instalar nada (Docker), con dashboard HTML
```powershell
cd pruebas\jmeter
docker run --rm -v "${PWD}:/plan" justb4/jmeter:5.5 -n -t /plan/automarket-carga.jmx -Jhost=host.docker.internal -l /plan/resultados/resultados.jtl -e -o /plan/resultados/dashboard
Start-Process .\resultados\dashboard\index.html
```
Para cambiar la carga: `-Jusuarios=100 -Jiteraciones=20 -Jusuarios_login=50`.
(La carpeta `resultados` debe estar vacía o no existir antes de cada ejecución.)

---

## 4. Revisión de vulnerabilidades y calidad web — Google Lighthouse

Usar el sitio en Docker (http://localhost:8080), que es igual al de producción.

1. Abrir Chrome en **modo incógnito** (para que las extensiones no alteren el resultado).
2. Ir a la página → `F12` → pestaña **Lighthouse**.
3. Modo *Navigation*, dispositivo *Desktop* y *Mobile*, todas las categorías → **Analyze page load**.
4. Repetir en `/`, `/catalogo`, `/login` y `/cotizar`.

📸 **Capturas:** los 4 puntajes de cada página y el detalle de las auditorías que fallan (especialmente *Best Practices → Security*: HTTPS, CSP y HSTS).

Los reportes de la primera ejecución están en `pruebas/evidencias/lighthouse-*.report.html`.

---

## 5. Pruebas manuales de seguridad, reglas de negocio y legales

Con el sistema levantado (`docker compose up -d`), ejecutar en **Git Bash** desde la raíz del repo:

```bash
bash pruebas/scripts/pruebas-api.sh | tee pruebas/evidencias/pruebas-api.txt
```

El script ejecuta los casos SEG-01 a SEG-08, CP-11, CP-12, CP-13 y LEG-03, imprime cada petición con su respuesta y código HTTP, y al final elimina los datos de prueba.

| Caso | Resultado esperado tras las correcciones |
|---|---|
| SEG-01 | Contraseñas como hash `$2b$10$...` |
| SEG-02a / SEG-02b | HTTP 401 sin token / HTTP 403 con token USER |
| SEG-03 | HTTP 401 con token falsificado |
| SEG-04 | HTTP 401 con inyección SQL |
| SEG-05 | ❌ 30 respuestas 401, ningún 429 (hallazgo abierto INC-07) |
| SEG-06 | ❌ HTTP 500 que expone SQL y hash (INC-08) |
| SEG-07 | ❌ sin HSTS/CSP y `Access-Control-Allow-Origin: *` (INC-09) |
| CP-12 | ❌ HTTP 200 con precio negativo (INC-05) |
| CP-13 | ❌ HTTP 404, no existe el endpoint de cotizaciones (INC-06) |

Escalamiento de privilegios desde el navegador (SEG-03): iniciar sesión como usuario normal → `F12` → *Application → Local Storage* → editar `automarket_user` y cambiar `"role":"USER"` por `"role":"ADMIN"` → navegar a `/admin`. La vista se muestra, pero al intentar guardar o eliminar, la API responde 401/403 y se cierra la sesión.

📸 **Capturas** de la terminal con la salida del script, y del navegador en la prueba de `localStorage`.

> Credencial de laboratorio: `admin@automarket.com` / `admin123` (se almacena con hash bcrypt). Si se usa la BD antigua de Laragon, volver a importar `backend/database.sql`, porque el admin con contraseña en texto plano ya no puede iniciar sesión.
