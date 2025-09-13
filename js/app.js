(function(){
  function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || '';
  }

  const LS_USERS   = 'users';     
  const LS_SESSION = 'usuario';   
  const LS_CART    = 'carrito';     

  const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || '{}');
  const setUsers = (obj) => localStorage.setItem(LS_USERS, JSON.stringify(obj));

  const getSession = () => localStorage.getItem(LS_SESSION);
  const setSession = (email) => localStorage.setItem(LS_SESSION, email);
  const clearSession = () => localStorage.removeItem(LS_SESSION);

  const getCart = () => JSON.parse(localStorage.getItem(LS_CART) || '[]');
  const setCart = (arr) => localStorage.setItem(LS_CART, JSON.stringify(arr));
  const clearCart = () => localStorage.removeItem(LS_CART);

  const formRegistro = document.getElementById('formRegistro');
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmar = document.getElementById('confirmar').value;
      const pais = document.getElementById('pais').value.trim();
      const terminos = document.getElementById('terminos').checked;

      setError('err-nombre',''); setError('err-email',''); setError('err-password','');
      setError('err-confirmar',''); setError('err-pais',''); setError('err-terminos','');

      let ok = true;
      if (nombre.length < 3) { setError('err-nombre','Ingresa tu nombre (mínimo 3 caracteres).'); ok = false; }
      if (!email.includes('@') || !email.includes('.')) { setError('err-email','Ingresa un correo válido.'); ok = false; }
      if (password.length < 8) { setError('err-password','La contraseña debe tener al menos 8 caracteres.'); ok = false; }
      if (confirmar !== password) { setError('err-confirmar','Las contraseñas no coinciden.'); ok = false; }
      if (!pais) { setError('err-pais','Selecciona o escribe tu país.'); ok = false; }
      if (!terminos) { setError('err-terminos','Debes aceptar los términos y condiciones.'); ok = false; }

      if (!ok) return;

      const users = getUsers();
      if (users[email]) {
        setError('err-email','Este correo ya está registrado.');
        return;
      }

      users[email] = { password, nombre, pais };
      setUsers(users);

      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = 'login.html';
    });
  }

  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value;

      setError('err-login-email',''); setError('err-login-password','');

      let ok = true;
      if (!email.includes('@') || !email.includes('.')) { setError('err-login-email','Correo no válido.'); ok = false; }
      if (pass.length < 8) { setError('err-login-password','La contraseña debe tener al menos 8 caracteres.'); ok = false; }
      if (!ok) return;

      const users = getUsers();
      if (!users[email] || users[email].password !== pass) {
        setError('err-login-password','Credenciales incorrectas.');
        return;
      }

      setSession(email);
      alert('Ingreso exitoso. Descuento del 10% aplicado en tu compra.');
      window.location.href = 'index.html';
    });
  }

  function wireAddButtons() {
    document.querySelectorAll('.btn-add[data-name][data-price]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        addToCart(name, price);
        alert(`"${name}" agregado al carrito.`);
      });
    });
  }

  function addToCart(name, price) {
    const cart = getCart();
    const idx = cart.findIndex(it => it.name === name && it.price === price);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    setCart(cart);
  }

  const listaCarrito = document.getElementById('listaCarrito');
  const resumen = document.getElementById('resumen');
  const estadoSesion = document.getElementById('estadoSesion');

  function renderSessionState() {
    if (!estadoSesion) return;
    const email = getSession();
    estadoSesion.textContent = email
      ? `Sesión activa: ${email} (tienes 10% de descuento)`
      : 'No has iniciado sesión (no se aplicará descuento).';
  }

  function renderCart() {
    if (!listaCarrito || !resumen) return;

    const cart = getCart();
    listaCarrito.innerHTML = '';

    if (cart.length === 0) {
      listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
      resumen.innerHTML = '';
      return;
    }

    cart.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'carrito-item';
      row.innerHTML = `
        <span>${item.name} × ${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
        <button class="btn" data-remove="${i}">❌</button>
      `;
      listaCarrito.appendChild(row);
    });

    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const logged = !!getSession();
    const descuento = logged ? total * 0.10 : 0;
    const totalConDesc = total - descuento;

    resumen.innerHTML = `
      <p><strong>Subtotal:</strong> $${total.toFixed(2)}</p>
      ${logged ? `<p class="descuento"><strong>Descuento 10%:</strong> -$${descuento.toFixed(2)}</p>` : ''}
      <p><strong>Total a pagar:</strong> $${totalConDesc.toFixed(2)}</p>
    `;

    listaCarrito.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-remove'));
        const c = getCart();
        c.splice(idx, 1);
        setCart(c);
        renderCart();
      });
    });
  }

  const btnVaciar = document.getElementById('btnVaciar');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) {
        clearCart();
        renderCart();
      }
    });
  }

  const btnFinalizar = document.getElementById('btnFinalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }
      alert('¡Compra realizada con éxito! Gracias por tu preferencia.');
      clearCart();
      renderCart();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireAddButtons();
    renderSessionState();
    renderCart();
  });

  const formCotizar = document.getElementById('formCotizar');
  formCotizar.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const sucursal = document.getElementById('sucursal').value.trim();

    let errores = false; 

    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    if (nombre.length < 3) {
      document.getElementById('err-nombre').textContent = 'Ingresa tu nombre (mínimo 3 caracteres).';
      errores = true;
    }

    if (!email.includes('@') || !email.includes('.')) {
      document.getElementById('err-email').textContent = 'Ingresa un correo válido.';
      errores = true;
    }

    if(celular.length < 8 || !/^\d+$/.test(celular)) {
      document.getElementById('err-celular').textContent = 'Ingresa un número de celular válido (mínimo 8 dígitos).';
      errores = true;
    }

    if(sucursal == '') {
      document.getElementById('err-sucursal').textContent = 'Selecciona una sucursal.';
      errores = true;
    }

    if (errores) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Debes rellenar correctamente los campos!'
      });
    }else {
      Swal.fire({
        icon: 'success',
        title: 'Cotización enviada!!',
        text: 'Nos pondremos en contacto contigo a la brevedad.',
    });

    form.reset();
    }
  });
})();
