import { CartProvider, useCart } from '../../src/context/CartContext.jsx';
import ProductCard from '../../src/components/ProductCard.jsx';
import { render, click } from './helpers.js';

const KEY = 'carrito';

describe('Carrito: reglas de negocio y persistencia', () => {
  let view;

  function Resumen() {
    const { items, subtotal, dec, clear } = useCart();
    return (
      <div>
        <span id="count">{items.length}</span>
        <span id="qty">{items[0] ? items[0].qty : 0}</span>
        <span id="subtotal">{subtotal}</span>
        <button id="dec" onClick={() => dec(1)} />
        <button id="clear" onClick={clear} />
      </div>
    );
  }

  function montar() {
    view = render(
      <CartProvider>
        <ProductCard id={1} name="Toyota Corolla" price={15000000} image="" />
        <ProductCard id={2} name="Kia Morning" price={9000000} image="" />
        <Resumen />
      </CartProvider>
    );
    return view.container;
  }

  const q = (sel) => view.container.querySelector(sel).textContent;
  const botonesAgregar = () => view.container.querySelectorAll('.btn-add-cart');

  beforeEach(() => localStorage.removeItem(KEY));
  afterEach(() => {
    view.unmount();
    localStorage.removeItem(KEY);
  });

  it('ProductCard muestra el nombre y el precio formateado en CLP', () => {
    const c = montar();
    const card = c.querySelector('.product-card');
    expect(card.querySelector('h3').textContent).toBe('Toyota Corolla');
    expect(card.querySelector('.price').textContent).toBe('$15.000.000');
  });

  it('agregar el mismo auto dos veces incrementa la cantidad en lugar de duplicarlo', () => {
    montar();
    click(botonesAgregar()[0]);
    click(botonesAgregar()[0]);
    expect(q('#count')).toBe('1');
    expect(q('#qty')).toBe('2');
    expect(q('#subtotal')).toBe('30000000');
  });

  it('calcula el subtotal con productos distintos', () => {
    montar();
    click(botonesAgregar()[0]);
    click(botonesAgregar()[1]);
    expect(q('#count')).toBe('2');
    expect(q('#subtotal')).toBe('24000000');
  });

  it('decrementar con cantidad 1 elimina el producto del carrito', () => {
    montar();
    click(botonesAgregar()[0]);
    click(view.container.querySelector('#dec'));
    expect(q('#count')).toBe('0');
  });

  it('vaciar el carrito deja el subtotal en 0', () => {
    montar();
    click(botonesAgregar()[0]);
    click(botonesAgregar()[1]);
    click(view.container.querySelector('#clear'));
    expect(q('#count')).toBe('0');
    expect(q('#subtotal')).toBe('0');
  });

  it('persiste el carrito en localStorage', () => {
    montar();
    click(botonesAgregar()[1]);
    const guardado = JSON.parse(localStorage.getItem(KEY));
    expect(guardado).toEqual([{ id: 2, name: 'Kia Morning', price: 9000000, qty: 1 }]);
  });

  // HALLAZGO: el carrito no conoce el stock del vehículo, por lo que no limita la cantidad.
  it('[HALLAZGO] permite agregar más unidades que el stock disponible (Ferrari Roma, stock 1)', () => {
    view = render(
      <CartProvider>
        <ProductCard id={4} name="Ferrari Roma" price={250000000} image="" />
        <Resumen />
      </CartProvider>
    );
    const boton = view.container.querySelector('.btn-add-cart');
    click(boton);
    click(boton);
    click(boton);
    expect(q('#qty')).toBe('3');
  });

  it('restaura el carrito guardado al recargar la página', () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: 1, name: 'Toyota Corolla', price: 15000000, qty: 3 }]));
    montar();
    expect(q('#qty')).toBe('3');
    expect(q('#subtotal')).toBe('45000000');
  });
});
