
import React from 'react'
import ProductCard from '../components/ProductCard'

const featured = [
  { id: 'sedan', name: 'Sedán Ejecutivo', price: 19990, image: '/sedan_ejecutivo.webp' },
  { id: 'suv', name: 'SUV Familiar', price: 25990, image: '/suv_familiar.jpg' },
  { id: 'deportivo', name: 'Deportivo', price: 39990, image: '/deportivo_ferrari.webp' },
]

const Home = () => {
  return (
    <div>

      <main className="contenedor">
        <h2 id="productos-titulo">Productos destacados</h2>
        <section aria-labelledby="productos-titulo" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {featured.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
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
