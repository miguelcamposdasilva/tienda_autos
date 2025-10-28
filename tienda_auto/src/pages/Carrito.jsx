import React from 'react'

const Carrito = () => {
  return (
    <div>
  <header class="contenedor">
    <h1>Carrito de compras</h1>

  </header>

  <main class="contenedor">
    <section aria-labelledby="carrito-titulo">
      <h2 id="carrito-titulo">Tus productos</h2>

      <div id="estadoSesion" style={{margin:".5rem 0;"}}></div>

      <div id="listaCarrito" class="carrito"></div>

      <div id="resumen" style={{marginTop:"1rem"}}></div>

      <div style={{display:"flex", gap:".5rem", marginTop:"1rem;"}}>
        <button class="btn" id="btnFinalizar">Finalizar compra</button>
        <button class="btn" id="btnVaciar">Vaciar carrito</button>
      </div>
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

export default Carrito
// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Carrito - AutoMarket</title>
//   <link rel="stylesheet" href="../css/styles.css" />
//   <script src="../js/app.js" defer></script>

//   <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
//   <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
//   <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
//   <link rel="manifest" href="../images/site.webmanifest">
  
// </head>


