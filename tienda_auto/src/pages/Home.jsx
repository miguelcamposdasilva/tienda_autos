
import React from 'react'


const Home = () => {
  return (
    <div>


  <main class="contenedor">
    <h2 id="productos-titulo">Productos destacados</h2>
    <section aria-labelledby="productos-titulo">
      <article class="producto">
        <img src='./sedan_ejecutivo.webp'alt="Sedán ejecutivo" />
        <h3>Sedán Ejecutivo</h3>
        <p>Comodidad y estilo en cada viaje.</p>
        <p><strong>Precio:</strong> $19990</p>
        <button class="btn btn-add"
                data-name="Sedán Ejecutivo"
                data-price="19990">Agregar al carrito</button>
      </article>

      <article class="producto">
        <img src="./suv_familiar.jpg" alt="SUV familiar" />
        <h3>SUV Familiar</h3>
        <p>Espacio, seguridad y potencia.</p>
        <p><strong>Precio:</strong> $25990</p>
        <button class="btn btn-add"
                data-name="SUV Familiar"
                data-price="25990">Agregar al carrito</button>
      </article>

      <article class="producto">
        <img src="./deportivo_ferrari.webp" alt="Deportivo" />
        <h3>Deportivo</h3>
        <p>Velocidad y diseño que impresionan.</p>
        <p><strong>Precio:</strong> $39990</p>
        <button class="btn btn-add"
                data-name="Deportivo"
                data-price="39990">Agregar al carrito</button>
      </article>
    </section>

    <section aria-labelledby="video-titulo">
      <h2 id="video-titulo">Vehiculo proximamente disponible</h2>
      <div class="video-responsivo">
        <iframe
          src="https://www.youtube.com/embed/U7UzhPuAgWY"
          ></iframe>
      </div>
    </section>
  </main>

  <footer>
    <div class="contenedor">
      <p>&copy; 2025 Automarket Spa - Todos los Derechos Reservados </p>
    </div>
  </footer>


</div>
  )
}

export default Home
// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Automarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">

// </head>
