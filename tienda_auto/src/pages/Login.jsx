import React from "react";

const Login = () => {
  return (
    <div>


      <main class="contenedor">
        <section aria-labelledby="login-titulo">
          <h2 id="login-titulo">Ingresar al sitio</h2>

          <form id="formLogin" novalidate>
            <div class="campo">
              <label for="loginEmail">Correo electrónico</label>
              <input
                id="loginEmail"
                name="loginEmail"
                type="email"
                placeholder="Ej: ana@mail.com"
                autocomplete="email"
                required
              />
              <small
                class="error"
                id="err-login-email"
                aria-live="polite"
              ></small>
            </div>

            <div class="campo">
              <label for="loginPassword">Contraseña</label>
              <input
                id="loginPassword"
                name="loginPassword"
                type="password"
                required
                minlength="8"
              />
              <small
                class="error"
                id="err-login-password"
                aria-live="polite"
              ></small>
            </div>

            <button class="btn" type="submit">
              Ingresar
            </button>
          </form>
        </section>
      </main>

      <footer>
        <div class="contenedor">
          <p>&copy; 2025 AutoMarket Spa - Todos los derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Ingreso - AutoMarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">

// </head>
