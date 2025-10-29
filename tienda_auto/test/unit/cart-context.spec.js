import * as Cart from '../../src/context/CartContext.jsx';

describe('CartContext module', () => {
  it('exports CartProvider and useCart', () => {
    expect(typeof Cart.CartProvider).toBe('function');
    expect(typeof Cart.useCart).toBe('function');
  });
});
