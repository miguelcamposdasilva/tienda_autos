// src/pages/Registro.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importamos íconos
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Registro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "", email: "", password: "", confirmar: "",
  });

  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (formData.password !== formData.confirmar) return setError("Las contraseñas no coinciden.");

    try {
      const response = await fetch('/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cuenta creada exitosamente!");
        navigate("/login");
      } else {
        setError(data.message || "Error al registrarse.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="input-group">
            <label>Nombre Completo</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                name="nombre"
                type="text"
                className="form-input"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                type="email"
                className="form-input"
                placeholder="juan@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                name="password"
                type={mostrarPass ? "text" : "password"}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setMostrarPass(!mostrarPass)}
              >
                {mostrarPass ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>

          {/* Confirmar */}
          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                name="confirmar"
                type="password"
                className="form-input"
                placeholder="Repite tu contraseña"
                value={formData.confirmar}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Registrarme
          </button>
        </form>

        <p className="link-text">
          ¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link>
        </p>
      </div>
    </div>
  );
}