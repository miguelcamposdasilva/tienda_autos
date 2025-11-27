// src/pages/Catalogo.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaMoneyBillWave, FaFilter } from 'react-icons/fa';

export default function Catalogo() {
  const [productos, setProductos] = useState([]); 
  const [productosFiltrados, setProductosFiltrados] = useState([]); 
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/autos');
      const data = await res.json();
      
      const dataFormateada = data.map(auto => ({
        id: auto.id,
        name: `${auto.marca} ${auto.modelo}`,
        // CORRECCIÓN CLAVE: Forzamos que sea número con parseInt
        // Si viene como string "30000", ahora será el número 30000
        price: parseInt(auto.precio) || 0, 
        image: auto.imagen,
        originalData: auto 
      }));

      setProductos(dataFormateada);
      setProductosFiltrados(dataFormateada);
    } catch (error) {
      console.error("Error conectando al catálogo:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => {
      const nuevosFiltros = { ...prev, [name]: value };
      aplicarFiltros(nuevosFiltros); 
      return nuevosFiltros;
    });
  };

  const aplicarFiltros = ({ busqueda, minPrice, maxPrice }) => {
    // Empezamos filtrando sobre la lista COMPLETA original
    let resultado = [...productos];

    // 1. Filtro por Nombre
    if (busqueda) {
      resultado = resultado.filter(p =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // 2. Filtro por Precio Mínimo
    const min = parseFloat(minPrice);
    if (!isNaN(min) && min > 0) {
      // Aseguramos que p.price sea número
      resultado = resultado.filter(p => Number(p.price) >= min);
    }

    // 3. Filtro por Precio Máximo
    const max = parseFloat(maxPrice);
    if (!isNaN(max) && max > 0) {
      // Aseguramos que p.price sea número
      resultado = resultado.filter(p => Number(p.price) <= max);
    }

    setProductosFiltrados(resultado);
  };

  return (
    <div>
      <main className="contenedor">
        {/* TITULO CORREGIDO A COLOR BLANCO */}
        <h2 id="catalogo-titulo" style={{ 
          borderBottom: '2px solid #e63946', 
          display: 'inline-block', 
          paddingBottom: 5,
          color: '#ffffff' 
        }}>
          Catálogo de Vehículos
        </h2>

        {/* --- SECCIÓN DE FILTROS --- */}
        <div className="auth-card" style={{ maxWidth: '100%', margin: '30px 0', padding: '25px', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10, color: '#ddd' }}>
            <FaFilter style={{ color: '#e63946' }} /> Filtros de Búsqueda
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: 15 }}>
          
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label htmlFor="busqueda" style={{ fontSize: '0.85rem' }}>Buscar por modelo</label>
              <div className="input-wrapper">
                <FaSearch className="input-icon" />
                <input
                  id="busqueda"
                  name="busqueda"
                  type="text"
                  className="form-input"
                  placeholder="Ej: Sedan, Toyota..."
                  value={filtros.busqueda}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label htmlFor="minPrice" style={{ fontSize: '0.85rem' }}>Precio Mínimo ($)</label>
              <div className="input-wrapper">
                <FaMoneyBillWave className="input-icon" />
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={filtros.minPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label htmlFor="maxPrice" style={{ fontSize: '0.85rem' }}>Precio Máximo ($)</label>
              <div className="input-wrapper">
                <FaMoneyBillWave className="input-icon" />
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  className="form-input"
                  placeholder="Sin límite"
                  value={filtros.maxPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>
        </div>

        {/* --- GRILLA DE PRODUCTOS --- */}
        <section aria-labelledby="catalogo-titulo">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(p => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px', color: '#888' }}>
              <h3>No se encontraron vehículos.</h3>
              <p>Intenta ajustar tus filtros de búsqueda.</p>
            </div>
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