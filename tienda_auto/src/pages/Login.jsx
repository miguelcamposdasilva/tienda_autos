import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setMostrarPassword(!mostrarPassword);
  };

  return (
    <div>
      <main className="contenedor">
        <section aria-labelledby="login-titulo">
          <h2 id="login-titulo">Ingresar al sitio</h2>

          <form id="formLogin" noValidate>
            <div className="campo">
              <label htmlFor="loginEmail">Correo electrónico</label>
              <input
                id="loginEmail"
                name="loginEmail"
                type="email"
                placeholder="Ej: ana@mail.com"
                autoComplete="email"
                required
              />
              <small
                className="error"
                id="err-login-email"
                aria-live="polite"
              ></small>
            </div>

            <div className="campo">
              <label htmlFor="loginPassword">Contraseña</label>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="loginPassword"
                  name="loginPassword"
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  minLength="8"
                  style={{ paddingRight: '3rem', width: '100%' }}
                />
 
                <button
                  type="button" 
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#ffffffff' 
                  }}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
              
              <small
                className="error"
                id="err-login-password"
                aria-live="polite"
              ></small>
            </div>

            <button className="btn" type="submit">
              Ingresar
            </button>
          </form>
        </section>
      </main>

      <footer className="contenedor">
        <div className="contenedor">
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
