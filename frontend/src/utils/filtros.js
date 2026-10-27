// src/utils/filtros.js
// Lógica de filtrado del catálogo (separada del componente para poder probarla de forma unitaria)
export function filtrarProductos(productos, { busqueda, minPrice, maxPrice }) {
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

  return resultado;
}
