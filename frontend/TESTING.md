# Cómo ejecutar los tests (Karma + Jasmine) — Proyecto `tienda_auto`

Guía rápida en español para ejecutar y depurar la suite de pruebas que usa Karma + Jasmine con webpack/babel.

Ubicación del app:
- `c:\Users\franc\tienda_autos\tienda_auto`

Comandos principales (PowerShell)
```powershell
cd c:\Users\franc\tienda_autos\tienda_auto
# instalar dependencias (usa legacy peer deps para evitar conflictos)
npm install --legacy-peer-deps

# ejecutar tests una sola vez
npm test

# ejecutar en modo watch (re-ejecuta al guardar cambios)
npm run test:watch

# ejecutar con salida silenciosa
npm test --silent

# abrir reporte de cobertura (después de ejecutar npm test)
Start-Process .\coverage\index.html
```

Qué encontrarás
- Tests de unidad y de integración en `test/unit/`.
- Configuración de Karma: `karma.conf.cjs` (usa webpack para transpilar JSX).
- Babel configurado con runtime automático para JSX en `.babelrc`.

Consejos útiles
- Si quieres ejecutar sólo un test mientras desarrollas: cambia `it` por `fit` o `describe` por `fdescribe` en el archivo de test; Jasmine ejecutará sólo los marcados.
- Si un test asíncrono tarda más, puedes aumentar el timeout dentro del test con `jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;` o usar `done()` correctamente.
- Error común: si Karma no puede abrir ChromeHeadless, configura la variable `CHROME_BIN` con la ruta a Chrome:
```powershell
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm test
```

Depuración de errores de instalación
- Si `npm install` falla por peer-deps, reintenta con `--legacy-peer-deps`.
- Si aparece un error tipo `Cannot find module 'ajv/dist/compile/codegen'`, instala `ajv@8`:
```powershell
npm install ajv@8 --save-dev --legacy-peer-deps
npm test
```

CI (ejemplo GitHub Actions)
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install
        run: npm ci --legacy-peer-deps
      - name: Run tests
        run: npm test
```

Añadir nuevos tests
- Crea `test/unit/mi-nuevo.spec.js` y usa Jasmine: `describe`/`it`.
- Para pruebas de componentes React más avanzadas, considera integrar `@testing-library/react`.

Si quieres, puedo:
- Añadir pruebas adicionales (persistencia en `localStorage`, casos límite de `dec`/`clear`).
- Añadir ejemplos con `@testing-library/react`.

