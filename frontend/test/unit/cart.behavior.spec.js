import React from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider, useCart } from '../../src/context/CartContext.jsx';

describe('Cart integration behavior', () => {
  let container, root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.removeItem('carrito');
  });

  afterEach(() => {
    if (root) root.unmount();
    container.remove();
    localStorage.removeItem('carrito');
  });

  it('add / inc / dec / remove update items and subtotal', (done) => {
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

    root = createRoot(container);
    root.render(
      <CartProvider>
        <TestApp />
      </CartProvider>
    );

    // sequence of actions with small timeouts to allow React state updates
    // wait a tick for the initial render to complete
    setTimeout(() => {
      container.querySelector('#add').click();
      setTimeout(() => {
        expect(container.querySelector('#items').textContent).toContain('"id":"id1"');
        expect(container.querySelector('#subtotal').textContent).toBe('10');

        container.querySelector('#inc').click();
        setTimeout(() => {
          expect(container.querySelector('#subtotal').textContent).toBe('20');

          container.querySelector('#dec').click();
          setTimeout(() => {
            expect(container.querySelector('#subtotal').textContent).toBe('10');

            container.querySelector('#remove').click();
            setTimeout(() => {
              expect(container.querySelector('#items').textContent).toBe('[]');
              done();
            }, 30);
          }, 30);
        }, 30);
      }, 30);
    }, 50);
  });
});
