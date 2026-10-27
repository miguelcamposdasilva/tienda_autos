import { CartProvider, useCart } from '../../src/context/CartContext.jsx';
import { render, click } from './helpers.js';

describe('Cart integration behavior', () => {
  let view;

  beforeEach(() => localStorage.removeItem('carrito'));

  afterEach(() => {
    view.unmount();
    localStorage.removeItem('carrito');
  });

  it('add / inc / dec / remove update items and subtotal', () => {
    function TestApp() {
      const { items, add, inc, dec, remove, clear, subtotal } = useCart();
      return (
        <div>
          <button id="add" onClick={() => add('id1', 'Producto 1', 10)}>add</button>
          <button id="inc" onClick={() => inc('id1')}>inc</button>
          <button id="dec" onClick={() => dec('id1')}>dec</button>
          <button id="remove" onClick={() => remove('id1')}>remove</button>
          <button id="clear" onClick={() => clear()}>clear</button>
          <div id="items">{JSON.stringify(items)}</div>
          <div id="subtotal">{subtotal}</div>
        </div>
      );
    }

    view = render(
      <CartProvider>
        <TestApp />
      </CartProvider>
    );
    const $ = (sel) => view.container.querySelector(sel);

    click($('#add'));
    expect($('#items').textContent).toContain('"id":"id1"');
    expect($('#subtotal').textContent).toBe('10');

    click($('#inc'));
    expect($('#subtotal').textContent).toBe('20');

    click($('#dec'));
    expect($('#subtotal').textContent).toBe('10');

    click($('#remove'));
    expect($('#items').textContent).toBe('[]');
  });
});
