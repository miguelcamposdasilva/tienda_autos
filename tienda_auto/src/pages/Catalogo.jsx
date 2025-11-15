import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

const PRODUCTOS_INICIALES = [
  { id: 'sedan', name: 'Sedán Ejecutivo', price: 19990, image: '/sedan_ejecutivo.webp' },
  { id: 'suv', name: 'SUV Familiar', price: 25990, image: '/suv_familiar.jpg' },
  { id: 'deportivo', name: 'Deportivo', price: 39990, image: '/deportivo_ferrari.webp' },
  { id: 'camioneta', name: 'Camioneta 4x4', price: 28990, image: '/camioneta_4_4.jpg' },
  { id: 'hibrido', name: 'Híbrido Ecológico', price: 21990, image: '/hibrido_ecologico.webp' },
];

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(PRODUCTOS_INICIALES); 

  const aplicarFiltros = (busquedaActual, minP, maxP) => {
    let resultado = PRODUCTOS_INICIALES;

    if (busquedaActual) {
      resultado = resultado.filter(producto =>
        producto.name.toLowerCase().includes(busquedaActual.toLowerCase())
      );
    }
    
    const precioMinimo = parseFloat(minP);
    const precioMaximo = parseFloat(maxP);

    if (!isNaN(precioMinimo) && precioMinimo > 0) {
        resultado = resultado.filter(producto => 
            producto.price >= precioMinimo
        );
    }

    if (!isNaN(precioMaximo) && precioMaximo > 0) {
        resultado = resultado.filter(producto => 
            producto.price <= precioMaximo
        );
    }

    setProductosFiltrados(resultado);
  };

  const handleBusquedaChange = (e) => {
    const nuevoBusqueda = e.target.value;
    setBusqueda(nuevoBusqueda);
    aplicarFiltros(nuevoBusqueda, minPrice, maxPrice); 
  };
  
  const handleMinPriceChange = (e) => {
    const nuevoMin = e.target.value;
    setMinPrice(nuevoMin);
    aplicarFiltros(busqueda, nuevoMin, maxPrice);
  };
  
  const handleMaxPriceChange = (e) => {
    const nuevoMax = e.target.value;
    setMaxPrice(nuevoMax);
    aplicarFiltros(busqueda, minPrice, nuevoMax);
  };

  return (
    <div>
      <main className="contenedor">
        <h2 id="catalogo-titulo">Todos los autos disponibles</h2>

        <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3 style={{ marginTop: '0' }}>Filtros</h3>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label htmlFor="inputBusqueda">Buscar por nombre:</label>
              <input
                id="inputBusqueda"
                type="text"
                placeholder="Ej: Sedán, Camioneta..."
                value={busqueda}
                onChange={handleBusquedaChange}
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label htmlFor="minPrice">Precio Mínimo ($):</label>
              <input
                id="minPrice"
                type="number"
                placeholder="Ej: 20000"
                value={minPrice}
                onChange={handleMinPriceChange}
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label htmlFor="maxPrice">Precio Máximo ($):</label>
              <input
                id="maxPrice"
                type="number"
                placeholder="Ej: 30000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <section aria-labelledby="catalogo-titulo">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(p => <ProductCard key={p.id} {...p} />)
          ) : (
            <p>No se encontraron autos que coincidan con los criterios de búsqueda.</p>
          )}
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
