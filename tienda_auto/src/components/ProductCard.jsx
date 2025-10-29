import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ id, name, price, image }) {
	const { add } = useCart();

	return (
		<article className="product-card" style={{ border:'1px solid #ddd', padding:12, margin:8, borderRadius:6 }}>
			{image && <img src={image} alt={name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius:4 }} />}
			<h3 style={{ marginTop:8 }}>{name}</h3>
			<p style={{ fontWeight:700 }}>${price}</p>
			<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
				<button className="btn" onClick={() => add(id, name, price)}>Agregar</button>
			</div>
		</article>
	);
}
