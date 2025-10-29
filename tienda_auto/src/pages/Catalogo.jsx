// src/pages/Catalogo.jsx
import ProductCard from '../components/ProductCard';

// Use public assets (placeholders) so the dev server doesn't fail when images are missing.
const productos = [
  { id: 'sedan',     name: 'Sedán Ejecutivo',  price: 19990, image: '/sedan_ejecutivo.webp' },
  { id: 'suv',       name: 'SUV Familiar',     price: 25990, image: '/suv_familiar.jpg' },
  { id: 'deportivo', name: 'Deportivo',        price: 39990, image: '/deportivo_ferrari.webp' },
  { id: 'camioneta', name: 'Camioneta 4x4',    price: 28990, image: '/camioneta_4_4.jpg' },
  { id: 'hibrido',   name: 'Híbrido Ecológico',price: 21990, image: '/hibrido_ecologico.webp' },
];

export default function Catalogo() {
  return (
    <div>
      <main className="contenedor">
        <h2 id="catalogo-titulo">Todos los autos disponibles</h2>
        <section aria-labelledby="catalogo-titulo">
          {productos.map(p => <ProductCard key={p.id} {...p} />)}
        </section>
      </main>
      <footer>
        <div className="contenedor">
          <p>&copy; 2025 Automarket Spa - Todos los Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
}

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
