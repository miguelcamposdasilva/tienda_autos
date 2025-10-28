import React from 'react'

const Catalogo = () => {
  return (
    <div>

  <main class="contenedor">
     <h2 id="catalogo-titulo">Todos los autos disponibles</h2>
    <section aria-labelledby="catalogo-titulo">
      <article class="producto">
        <img src="./sedan_ejecutivo.webp" alt="Sedán ejecutivo" height="240" width = "240" />
        <h3>Sedán Ejecutivo</h3>
        <p>Comodidad y estilo en cada viaje.</p>
        <p><strong>Precio:</strong> $19990</p>
        <button class="btn btn-add" data-name="Sedán Ejecutivo" data-price="19990">Agregar al carrito</button>
      </article>

      <article class="producto">
       <img src="./suv_familiar.jpg" alt="SUV" height="240" width = "240"/>
        <h3>SUV Familiar</h3>
        <p>Espacio, seguridad y potencia.</p>
        <p><strong>Precio:</strong> $25990</p>
        <button class="btn btn-add" data-name="SUV Familiar" data-price="25990">Agregar al carrito</button>
      </article>

      <article class="producto">
        <img src="./deportivo_ferrari.webp" alt="Deportivo" height="240" width = "240" />
        <h3>Deportivo</h3>
        <p>Velocidad y diseño que impresionan.</p>
        <p><strong>Precio:</strong> $39990</p>
        <button class="btn btn-add" data-name="Deportivo" data-price="39990">Agregar al carrito</button>
      </article>

      <article class="producto">
        <img src="./camioneta_4_4.jpg" alt="Camioneta 4x4" height="240" width = "240"/>
        <h3>Camioneta 4x4</h3>
        <p>Potencia y rendimiento para todo terreno.</p>
        <p><strong>Precio:</strong> $28990</p>
        <button class="btn btn-add" data-name="Camioneta 4x4" data-price="28990">Agregar al carrito</button>
      </article>

      <article class="producto">
        <img src="./hibrido_ecologico.webp" alt="Híbrido ecológico" height="240" width = "240" />
        <h3>Híbrido Ecológico</h3>
        <p>Combina eficiencia y cuidado del medio ambiente.</p>
        <p><strong>Precio:</strong> $21990</p>
        <button class="btn btn-add" data-name="Híbrido Ecológico" data-price="21990">Agregar al carrito</button>
      </article>
    </section>
  </main>

  <footer>
    <div class="contenedor">
      <p>&copy; 2025 Automarket Spa - Todos los Derechos Reservados</p>
    </div>
  </footer>

</div>
  )
}

export default Catalogo
// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Catálogo - AutoMarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">

// </head>
