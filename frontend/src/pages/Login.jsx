// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Importamos íconos nuevos
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("''/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Bienvenido</h2>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="ejemplo@automarket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={mostrarPass ? "text" : "password"}
                className="form-input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="btn-submit">
            Ingresar
          </button>
        </form>

        <p className="link-text">
          ¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}