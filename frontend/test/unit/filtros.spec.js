import { filtrarProductos } from '../../src/utils/filtros.js';

describe('Filtros del catálogo (filtrarProductos)', () => {
  const productos = [
    { id: 1, name: 'Toyota Corolla', price: 15000000 },
    { id: 2, name: 'Toyota Hilux', price: 28000000 },
    { id: 3, name: 'Ferrari Roma', price: 250000000 },
    { id: 4, name: 'Kia Morning', price: 9000000 }
  ];
  const sinFiltros = { busqueda: '', minPrice: '', maxPrice: '' };

  it('sin filtros devuelve todos los productos', () => {
    expect(filtrarProductos(productos, sinFiltros).length).toBe(4);
  });

  it('filtra por nombre sin distinguir mayúsculas', () => {
    const r = filtrarProductos(productos, { ...sinFiltros, busqueda: 'toyota' });
    expect(r.map(p => p.id)).toEqual([1, 2]);
  });

  it('filtra por precio mínimo', () => {
    const r = filtrarProductos(productos, { ...sinFiltros, minPrice: '20000000' });
    expect(r.map(p => p.id)).toEqual([2, 3]);
  });

  it('filtra por precio máximo', () => {
    const r = filtrarProductos(productos, { ...sinFiltros, maxPrice: '15000000' });
    expect(r.map(p => p.id)).toEqual([1, 4]);
  });

  it('combina nombre y rango de precios', () => {
    const r = filtrarProductos(productos, { busqueda: 'toyota', minPrice: '10000000', maxPrice: '20000000' });
    expect(r.map(p => p.id)).toEqual([1]);
  });

  it('incluye los valores límite del rango (>= y <=)', () => {
    const r = filtrarProductos(productos, { ...sinFiltros, minPrice: '9000000', maxPrice: '9000000' });
    expect(r.map(p => p.id)).toEqual([4]);
  });

  it('ignora precios negativos, cero o no numéricos', () => {
    expect(filtrarProductos(productos, { ...sinFiltros, minPrice: '-5' }).length).toBe(4);
    expect(filtrarProductos(productos, { ...sinFiltros, maxPrice: '0' }).length).toBe(4);
    expect(filtrarProductos(productos, { ...sinFiltros, minPrice: 'abc' }).length).toBe(4);
  });

  it('devuelve lista vacía si no hay coincidencias', () => {
    expect(filtrarProductos(productos, { ...sinFiltros, busqueda: 'Tesla' })).toEqual([]);
  });

  it('no modifica la lista original', () => {
    const copia = [...productos];
    filtrarProductos(productos, { ...sinFiltros, busqueda: 'kia' });
    expect(productos).toEqual(copia);
  });
});
