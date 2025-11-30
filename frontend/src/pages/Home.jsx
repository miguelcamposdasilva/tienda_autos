// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { FaStar, FaVideo, FaCarSide } from 'react-icons/fa';

const Home = () => {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestacados();
  }, []);

  const fetchDestacados = async () => {
    try {
      const res = await fetch('''/api/autos');
      const data = await res.json();

      const dataFormateada = data.map(auto => ({
        id: auto.id,
        name: `${auto.marca} ${auto.modelo}`,
        price: auto.precio,
        image: auto.imagen,
      }));

      const ultimosTres = dataFormateada.slice(-3).reverse();
      setDestacados(ultimosTres);
    } catch (error) {
      console.error("Error cargando destacados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="contenedor">
        
        {/* --- HERO: TEXTO CORREGIDO --- */}
        <section style={{ textAlign: 'center', margin: '40px 0 60px' }}>
          {/* Título Blanco Sólido con la marca en Rojo */}
          <h1 style={{ 
            fontSize: '2.8rem', 
            marginBottom: '10px', 
            color: '#ffffff', // Blanco puro
            fontWeight: '800',
            letterSpacing: '1px'
          }}>
            Bienvenido a <span style={{ color: '#e63946' }}>Automarket</span>
          </h1>
          <p style={{ color: '#bbb', fontSize: '1.1rem' }}>
            La mejor selección de vehículos seminuevos con garantía y confianza.
          </p>
        </section>

        {/* --- SECCIÓN DESTACADOS --- */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <FaStar style={{ color: '#f39c12', fontSize: '1.5rem' }} />
           <h2 id="productos-titulo" style={{ 
              borderBottom: '2px solid #e63946', 
              display: 'inline-block', 
              paddingBottom: 5,
              margin: 0,
              fontSize: '1.8rem',
              color: '#fff'
            }}>
              Destacados
            </h2>
        </div>

        <section aria-labelledby="productos-titulo">
          {loading ? (
             <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                <p>Cargando lo último en stock...</p>
             </div>
          ) : destacados.length > 0 ? (
            destacados.map(p => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image || 'https://via.placeholder.com/300x200?text=Auto+Nuevo'} 
              />
            ))
          ) : (
            <div className="auth-card" style={{ padding: 30, textAlign: 'center', gridColumn: '1 / -1' }}>
                <FaCarSide style={{ fontSize: '3rem', color: '#444', marginBottom: 10 }}/>
                <p>Aún no hay autos destacados disponibles.</p>
            </div>
          )}
        </section>

        {/* --- SECCIÓN VIDEO --- */}
        <section aria-labelledby="video-titulo" style={{ marginTop: '80px' }}>
          
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <FaVideo style={{ color: '#e63946', fontSize: '1.5rem' }} />
             <h2 id="video-titulo" style={{ 
                borderBottom: '2px solid #e63946', 
                display: 'inline-block', 
                paddingBottom: 5,
                margin: 0,
                fontSize: '1.8rem',
                color: '#fff'
              }}>
                Review Destacado
              </h2>
          </div>
          
          <div className="auth-card" style={{ maxWidth: '100%', padding: '20px' }}>
            <div className="video-responsivo" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
              <iframe
                src="https://www.youtube.com/embed/U7UzhPuAgWY"
                title="Video promocional"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ textAlign: 'left', marginTop: '15px' }}>
              <h3 style={{ color: '#fff' }}>Próximamente: El Futuro Eléctrico</h3>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                Descubre las características del nuevo modelo que revolucionará el mercado automotriz este año.
              </p>
            </div>
          </div>

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

export default Home;