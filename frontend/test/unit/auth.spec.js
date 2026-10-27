import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../src/context/AuthContext.jsx';
import ProtectedRoute from '../../src/components/ProtectedRoute.jsx';
import { render, click } from './helpers.js';

const KEY = 'automarket_user';

describe('AuthContext', () => {
  let view;

  function Estado() {
    const { user, login, logout, isAdmin } = useAuth();
    return (
      <div>
        <span id="user">{user ? user.email : 'anonimo'}</span>
        <span id="admin">{String(isAdmin)}</span>
        <button id="login-admin" onClick={() => login({ id: 1, email: 'admin@automarket.com', role: 'ADMIN' })} />
        <button id="login-user" onClick={() => login({ id: 2, email: 'ana@mail.com', role: 'USER' })} />
        <button id="logout" onClick={logout} />
      </div>
    );
  }

  beforeEach(() => {
    localStorage.removeItem(KEY);
    view = render(<AuthProvider><Estado /></AuthProvider>);
  });

  afterEach(() => {
    view.unmount();
    localStorage.removeItem(KEY);
  });

  it('inicia sin usuario autenticado', () => {
    expect(view.container.querySelector('#user').textContent).toBe('anonimo');
    expect(view.container.querySelector('#admin').textContent).toBe('false');
  });

  it('login de ADMIN activa isAdmin y persiste la sesión', () => {
    click(view.container.querySelector('#login-admin'));
    expect(view.container.querySelector('#admin').textContent).toBe('true');
    expect(JSON.parse(localStorage.getItem(KEY)).role).toBe('ADMIN');
  });

  it('login de USER no otorga privilegios de administrador', () => {
    click(view.container.querySelector('#login-user'));
    expect(view.container.querySelector('#user').textContent).toBe('ana@mail.com');
    expect(view.container.querySelector('#admin').textContent).toBe('false');
  });

  it('logout elimina la sesión del almacenamiento local', () => {
    click(view.container.querySelector('#login-user'));
    click(view.container.querySelector('#logout'));
    expect(view.container.querySelector('#user').textContent).toBe('anonimo');
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});

describe('ProtectedRoute (control de acceso al panel /admin)', () => {
  let view;

  function montarEn(ruta) {
    view = render(
      <AuthProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path="/" element={<p id="pagina">home</p>} />
            <Route path="/login" element={<p id="pagina">login</p>} />
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<p id="pagina">admin</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    return view.container.querySelector('#pagina').textContent;
  }

  afterEach(() => {
    view.unmount();
    localStorage.removeItem(KEY);
  });

  it('redirige a /login si no hay sesión', () => {
    localStorage.removeItem(KEY);
    expect(montarEn('/admin')).toBe('login');
  });

  it('redirige al inicio si el usuario no es ADMIN', () => {
    localStorage.setItem(KEY, JSON.stringify({ id: 2, email: 'ana@mail.com', role: 'USER' }));
    expect(montarEn('/admin')).toBe('home');
  });

  it('permite el acceso a un usuario ADMIN', () => {
    localStorage.setItem(KEY, JSON.stringify({ id: 1, email: 'admin@automarket.com', role: 'ADMIN' }));
    expect(montarEn('/admin')).toBe('admin');
  });

  // HALLAZGO DE SEGURIDAD: el rol se lee desde localStorage sin validación en el servidor,
  // por lo que un usuario puede editarlo desde DevTools y acceder al panel.
  it('[HALLAZGO] un rol ADMIN falsificado en localStorage concede acceso al panel', () => {
    localStorage.setItem(KEY, JSON.stringify({ id: 999, email: 'atacante@mail.com', role: 'ADMIN' }));
    expect(montarEn('/admin')).toBe('admin');
  });
});
