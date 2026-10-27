#!/usr/bin/env bash
# Pruebas manuales de seguridad y reglas de negocio contra la API real (entorno Docker local).
# Uso (Git Bash, con "docker compose up -d" corriendo):
#   bash pruebas/scripts/pruebas-api.sh | tee pruebas/evidencias/pruebas-api.txt
# IMPORTANTE: ejecutar SOLO contra el entorno propio de laboratorio.

API=${API:-http://localhost:3000}
WEB=${WEB:-http://localhost:8080}
JSON='Content-Type: application/json'

titulo() { echo; echo "=================================================================="; echo "$1"; echo "=================================================================="; }
pedir() { echo "\$ $*"; "$@" -s -w "\n-> HTTP %{http_code}\n"; }

echo "Ejecución: $(date '+%Y-%m-%d %H:%M:%S')  |  API: $API"

titulo "Preparación: obtener tokens ADMIN y USER"
ADMIN_TOKEN=$(curl -s -X POST "$API/api/login" -H "$JSON" -d '{"email":"admin@automarket.com","password":"admin123"}' | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
curl -s -X POST "$API/api/register" -H "$JSON" -d '{"nombre":"Usuario Prueba","email":"usuario.prueba@mail.com","password":"clave123"}' >/dev/null
USER_TOKEN=$(curl -s -X POST "$API/api/login" -H "$JSON" -d '{"email":"usuario.prueba@mail.com","password":"clave123"}' | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
echo "Token ADMIN obtenido: ${ADMIN_TOKEN:0:25}..."
echo "Token USER  obtenido: ${USER_TOKEN:0:25}..."

titulo "SEG-01 Contraseñas almacenadas con hash (REQ-SEG-01)"
docker compose exec -T db mysql -uroot -pautomarket_root -e "SELECT id, email, password, role FROM db_tienda_autos.users" 2>/dev/null

titulo "SEG-02a Eliminar auto SIN token (REQ-SEG-02) - esperado 401"
pedir curl -X DELETE "$API/api/autos/5"
titulo "SEG-02b Crear auto con token de USER (REQ-SEG-02) - esperado 403"
pedir curl -X POST "$API/api/autos" -H "$JSON" -H "Authorization: Bearer $USER_TOKEN" -d '{"marca":"Hack","modelo":"X","annio":2024,"precio":1,"stock":1}'

titulo "SEG-03 Token ADMIN falsificado (firmado con otro secreto) (REQ-SEG-03) - esperado 401"
FALSO=$(node -e 'const c=require("crypto");const b=o=>Buffer.from(JSON.stringify(o)).toString("base64url");const h=b({alg:"HS256",typ:"JWT"}),p=b({id:99,role:"ADMIN"});console.log(h+"."+p+"."+c.createHmac("sha256","secreto-atacante").update(h+"."+p).digest("base64url"))')
pedir curl -X DELETE "$API/api/autos/1" -H "Authorization: Bearer $FALSO"

titulo "SEG-04 Inyección SQL en login (REQ-SEG-04) - esperado 401"
pedir curl -X POST "$API/api/login" -H "$JSON" -d "{\"email\":\"' OR '1'='1' -- \",\"password\":\"x\"}"

titulo "SEG-05 Fuerza bruta: 30 intentos fallidos seguidos (REQ-SEG-05) - esperado bloqueo 429"
for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code} " -X POST "$API/api/login" -H "$JSON" -d '{"email":"admin@automarket.com","password":"intento'$i'"}'; done; echo
echo "-> Códigos 429 recibidos: ninguno si todas las respuestas son 401"

titulo "SEG-06 Manejo de errores: registrar email duplicado (REQ-SEG-06) - esperado mensaje genérico"
pedir curl -X POST "$API/api/register" -H "$JSON" -d '{"nombre":"Dup","email":"admin@automarket.com","password":"123456"}'

titulo "SEG-07 Cabeceras de seguridad y CORS (REQ-SEG-07) - esperado HSTS, CSP, X-Frame-Options y CORS restringido"
echo "\$ curl -I $WEB/"; curl -s -I "$WEB/"
echo "\$ curl -I -H 'Origin: https://sitio-malicioso.com' $API/api/autos"; curl -s -I -H "Origin: https://sitio-malicioso.com" "$API/api/autos" | grep -iE "^HTTP|access-control|x-powered-by"

titulo "SEG-08 Credenciales en código fuente (REQ-SEG-08) - esperado sin valores por defecto"
grep -nE "user:|password:" backend/server.js

titulo "CP-12 Regla de negocio: precio y stock negativos, año 1800 (REQ-FUNC-09) - esperado 400"
pedir curl -X POST "$API/api/autos" -H "$JSON" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"marca":"Test","modelo":"Invalido","annio":1800,"precio":-5000,"stock":-3}'

titulo "CP-11 CRUD con token ADMIN (REQ-FUNC-08) - esperado 200"
pedir curl -X PUT "$API/api/autos/5" -H "$JSON" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"marca":"Toyota","modelo":"Prius Híbrido","annio":2024,"precio":23990000,"stock":6,"imagen":"/hibrido_ecologico.webp","descripcion":"Híbrido de bajo consumo."}'

titulo "CP-13 Cotización: ¿existe endpoint en la API? (REQ-FUNC-10) - esperado 200/201"
pedir curl -X POST "$API/api/cotizaciones" -H "$JSON" -d '{"nombre":"Ana","email":"ana@mail.com","celular":"912345678","autoDeseado":"SUV","sucursal":"Maipú"}'

titulo "LEG-03 Derechos del titular (REQ-LEG-03): rutas disponibles en la API - esperado endpoint para eliminar/consultar la propia cuenta"
grep -nE "app\.(get|post|put|delete)\(" backend/app.js

titulo "Limpieza: eliminar datos de prueba"
docker compose exec -T db mysql -uroot -pautomarket_root -e "DELETE FROM db_tienda_autos.autos WHERE marca='Test'; DELETE FROM db_tienda_autos.users WHERE email='usuario.prueba@mail.com';" 2>/dev/null && echo "OK"
