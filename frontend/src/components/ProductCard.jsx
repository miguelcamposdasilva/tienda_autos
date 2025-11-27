// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { FaCartPlus } from 'react-icons/fa'; // Agregamos ícono al botón

export default function ProductCard({ id, name, price, image }) {
    const { add } = useCart();

    return (
        <article className="product-card">
            {/* Imagen del producto */}
            <div className="img-container">
                {image ? (
                    <img src={image} alt={name} />
                ) : (
                    <div className="no-image">Sin Imagen</div>
                )}
            </div>

            {/* Información */}
            <div className="card-info">
                <h3>{name}</h3>
                <p className="price">${parseInt(price).toLocaleString('es-CL')}</p>
            </div>

            {/* Botón de acción */}
            <button className="btn-add-cart" onClick={() => add(id, name, price)}>
                <FaCartPlus /> Agregar
            </button>
        </article>
    );
}