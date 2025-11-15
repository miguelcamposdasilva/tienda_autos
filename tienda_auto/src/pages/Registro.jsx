import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const Registro = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errores, setErrores] = useState({}); 

  const [datosRegistro, setDatosRegistro] = useState({
    nombre: '', email: '', password: '', confirmar: '', pais: '', terminos: false,
  });

  const togglePasswordVisibility = () => setMostrarPassword(!mostrarPassword);
  const toggleConfirmarVisibility = () => setMostrarConfirmar(!mostrarConfirmar);

  const validarFormulario = (datos) => {
    let nuevosErrores = {};

    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!datos.email.trim()) nuevosErrores.email = 'El correo electrónico es obligatorio.';
    
    if (!datos.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (datos.password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!datos.confirmar) {
      nuevosErrores.confirmar = 'La confirmación de contraseña es obligatoria.';
    } else if (datos.password !== datos.confirmar) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden.';
    }

    if (!datos.pais.trim()) nuevosErrores.pais = 'El país es obligatorio.';
    if (!datos.terminos) nuevosErrores.terminos = 'Debes aceptar los términos y condiciones.';

    return nuevosErrores;
  };


  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;

    setDatosRegistro({ ...datosRegistro, [name]: value });

    if (errores[name]) {
        setErrores({ ...errores, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresDetectados = validarFormulario(datosRegistro);
    setErrores(erroresDetectados);

    if (Object.keys(erroresDetectados).length === 0) {
      console.log('¡Registro exitoso! Datos:', datosRegistro);
      alert('¡Registro exitoso! Revisa la consola para ver los datos.');
    } else {
      console.log('Formulario inválido.');
    }
  };

  return (
    <div>
      <main className="contenedor">
        <section aria-labelledby="registro-titulo">
          <h2 id="registro-titulo">Crear cuenta</h2>
          <form id="formRegistro" onSubmit={handleSubmit} noValidate> 
            
            <div className="campo">
              <label htmlFor="nombre">Nombre completo</label>
              <input 
                id="nombre" 
                name="nombre" 
                type="text" 
                placeholder="Ej: Ana Pérez" 
                autoComplete="name" 
                required 
                minLength="3"
                value={datosRegistro.nombre} 
                onChange={handleChange}
              />
              <small className="error" id="err-nombre" aria-live="polite">
                {errores.nombre}
              </small>
            </div>

            <div className="campo">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Ej: ana@mail.com" 
                autoComplete="email" 
                required
                value={datosRegistro.email} 
                onChange={handleChange}
              />
              <small className="error" id="err-email" aria-live="polite">
                {errores.email} 
              </small>
            </div>

            <div className="campo">
              <label htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength="8"
                  style={{ paddingRight: '3rem', width: '100%' }}
                  value={datosRegistro.password} 
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#FFFFFF' }}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
              <small className="error" id="err-password" aria-live="polite">
                {errores.password} 
              </small>
            </div>

            <div className="campo">
              <label htmlFor="confirmar">Confirmar contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="confirmar"
                  name="confirmar"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  required
                  minLength="8"
                  style={{ paddingRight: '3rem', width: '100%' }}
                  value={datosRegistro.confirmar} 
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleConfirmarVisibility}
                  style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#FFFFFF' }}
                  aria-label={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarConfirmar ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
              <small className="error" id="err-confirmar" aria-live="polite">
                {errores.confirmar} 
              </small>
            </div>

            <div className="campo">
              <label htmlFor="pais">País</label>
              <input 
                id="pais" 
                name="pais" 
                list="paises" 
                placeholder="Escribe o elige..." 
                autoComplete="country-name" 
                required
                value={datosRegistro.pais} 
                onChange={handleChange}
              />
              <datalist id="paises">
                <option value="Chile"></option>
                <option value="Argentina"></option>
                <option value="Perú"></option>
                <option value="México"></option>
                <option value="España"></option>
              </datalist>
              <small className="error" id="err-pais" aria-live="polite">
                {errores.pais} 
              </small>
            </div>

            <div className="campo check">
              <input 
                id="terminos" 
                name="terminos" 
                type="checkbox" 
                required 
                checked={datosRegistro.terminos} 
                onChange={handleChange}
              />
              <label htmlFor="terminos">Acepto los términos y condiciones</label>
              <small className="error" id="err-terminos" aria-live="polite">
                {errores.terminos} 
              </small>
            </div>

            <button className="btn" type="submit">Registrarme</button>
          </form>
        </section>
      </main>

      <footer>
        <div className="contenedor">
          <p>&copy; 2025 AutoMarket Spa - Todos los Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default Registro;
// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Registro - AutoMarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">

// </head>
