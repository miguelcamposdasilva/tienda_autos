import React, { useState, useEffect } from 'react';
// Importamos íconos para mejorar la interfaz visual
import { FaEdit, FaTrash, FaSave, FaEraser, FaPlus } from 'react-icons/fa';

const AdminPanel = () => {
  const [autos, setAutos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // Estado inicial del formulario
  const initialForm = {
    marca: '', modelo: '', annio: '', precio: '', stock: 0, imagen: '', descripcion: ''
  };
  const [form, setForm] = useState(initialForm);

  
  const API_URL = '''/api/autos';

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAutos(data);
    } catch (error) {
      console.error("Error cargando autos:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = modoEdicion ? `${API_URL}/${idEditar}` : API_URL;
    const method = modoEdicion ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(modoEdicion ? 'Auto actualizado correctamente' : 'Auto creado correctamente');
        fetchAutos();
        handleLimpiar();
      }
    } catch (error) {
      alert("Error al guardar en el servidor");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este auto permanentemente?')) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchAutos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditar = (auto) => {
    setModoEdicion(true);
    setIdEditar(auto.id);
    setForm(auto);
    // Hacemos scroll suave hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimpiar = () => {
    setModoEdicion(false);
    setIdEditar(null);
    setForm(initialForm);
  };

  return (
    <div className="contenedor" style={{ padding: '40px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="admin-header">Gestión de Inventario</h2>
      </div>

      {/* --- FORMULARIO --- */}
      <div className="admin-form-card">
        <h3 style={{ marginBottom: 20, color: '#ddd' }}>
          {modoEdicion ? '✏️ Editando Producto' : '➕ Nuevo Producto'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>Marca</label>
                <input className="admin-input" name="marca" placeholder="Ej: Toyota" value={form.marca} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>Modelo</label>
                <input className="admin-input" name="modelo" placeholder="Ej: Corolla" value={form.modelo} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>Año</label>
                <input className="admin-input" name="annio" type="number" placeholder="2024" value={form.annio} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>Precio ($)</label>
                <input className="admin-input" name="precio" type="number" placeholder="15000000" value={form.precio} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>Stock Disponible</label>
                <input className="admin-input" name="stock" type="number" placeholder="0" value={form.stock} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label style={{color:'#aaa', fontSize:12}}>URL Imagen</label>
                <input className="admin-input" name="imagen" placeholder="http://..." value={form.imagen} onChange={handleChange} />
            </div>
            
            <textarea 
                className="admin-input admin-textarea" 
                name="descripcion" 
                placeholder="Descripción detallada del vehículo..." 
                value={form.descripcion} 
                onChange={handleChange} 
                rows="3" 
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleLimpiar} className="action-btn btn-clear">
              <FaEraser /> Limpiar
            </button>
            <button type="submit" className="action-btn btn-save">
              {modoEdicion ? <><FaSave /> Actualizar</> : <><FaPlus /> Guardar</>}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLA --- */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Vehículo</th>
              <th>Año</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autos.length === 0 ? (
                <tr>
                    <td colSpan="7" style={{textAlign:'center', padding: 30}}>No hay autos registrados aún.</td>
                </tr>
            ) : (
                autos.map(auto => (
                <tr key={auto.id}>
                    <td>#{auto.id}</td>
                    <td>
                    {auto.imagen ? (
                        <img src={auto.imagen} alt="auto" className="product-thumb" />
                    ) : (
                        <span style={{color:'#777', fontSize:12}}>Sin img</span>
                    )}
                    </td>
                    <td>
                        <strong>{auto.marca}</strong> <br/> 
                        <span style={{color:'#aaa'}}>{auto.modelo}</span>
                    </td>
                    <td>{auto.annio}</td>
                    {/* Formateamos el precio para que se vea bonito */}
                    <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                        ${parseInt(auto.precio).toLocaleString('es-CL')}
                    </td>
                    <td>
                        <span style={{ 
                            padding: '4px 8px', 
                            borderRadius:4, 
                            background: auto.stock > 0 ? '#27ae60' : '#c0392b',
                            fontSize: 12
                        }}>
                            {auto.stock} u.
                        </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button onClick={() => handleEditar(auto)} className="action-btn btn-edit" title="Editar">
                            <FaEdit />
                        </button>
                        <button onClick={() => handleEliminar(auto.id)} className="action-btn btn-delete" title="Eliminar">
                            <FaTrash />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;