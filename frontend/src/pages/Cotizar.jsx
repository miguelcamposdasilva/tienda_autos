// src/pages/Cotizar.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCar, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Cotizar = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    autoDeseado: '',
    sucursal: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    console.log('Enviando cotización:', formData);
    alert(`¡Gracias ${formData.nombre}! Un ejecutivo te contactará pronto para cotizar el ${formData.autoDeseado}.`);
    
    // Limpiar formulario
    setFormData({ nombre: '', email: '', celular: '', autoDeseado: '', sucursal: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}> {/* Un poco más ancho para cotizar */}
        
        {/* Banner Promocional */}
        <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden' }}>
          <img 
            src="https://www.nissan-cdn.net/content/dam/Nissan/cl/vehicles/kicks-play/precio/Banner%20op-2.jpg.ximg.l_12_m.smart.jpg" 
            alt="Banner Promocional" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <h2>Solicitar Cotización</h2>
        <p style={{ color: '#bbb', marginBottom: '20px' }}>Completa tus datos y nos pondremos en contacto contigo.</p>

        <form onSubmit={handleSubmit}>
          
          {/* Nombre */}
          <div className="input-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input 
                id="nombre" 
                name="nombre" 
                type="text" 
                className="form-input" 
                placeholder="Ej: Ana Pérez" 
                value={formData.nombre}
                onChange={handleChange}
                required 
                minLength="3" 
              />
            </div>
          </div>

          {/* Email y Celular en una fila (si la pantalla es ancha) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  className="form-input" 
                  placeholder="ana@mail.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="celular">Celular</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input 
                  id="celular" 
                  name="celular" 
                  type="tel" 
                  className="form-input" 
                  placeholder="Ej: 912345678" 
                  value={formData.celular}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

          </div>

          {/* Auto Deseado */}
          <div className="input-group">
            <label htmlFor="autoDeseado">¿Qué auto buscas?</label>
            <div className="input-wrapper">
              <FaCar className="input-icon" />
              <input 
                id="autoDeseado" 
                name="autoDeseado" 
                type="text" 
                className="form-input" 
                placeholder="Ej: SUV Familiar, Sedán..." 
                value={formData.autoDeseado}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Sucursal */}
          <div className="input-group">
            <label htmlFor="sucursal">Sucursal de Preferencia</label>
            <div className="input-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <input 
                id="sucursal" 
                name="sucursal" 
                list="sucursales" 
                className="form-input" 
                placeholder="Selecciona una sucursal..." 
                value={formData.sucursal}
                onChange={handleChange}
                required 
              />
              <datalist id="sucursales">
                <option value="Santiago Centro" />
                <option value="Las Condes" />
                <option value="San Joaquín" />
                <option value="Providencia" />
                <option value="Maipú" />
              </datalist>
            </div>
          </div>

          <button className="btn-submit" type="submit">
            <FaPaperPlane style={{ marginRight: '8px' }} /> Enviar Solicitud
          </button>
        </form>

        <footer style={{ marginTop: '30px', borderTop: '1px solid #444', paddingTop: '15px' }}>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            &copy; 2025 Automarket Spa - Todos los Derechos Reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Cotizar;