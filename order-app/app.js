// app.js - mejoras: validación de teléfono, control de cantidades, confirmación antes de abrir WhatsApp
const WA_NUMBER = '573505182091'; // +57 350 518 2091
let products = [];
let cart = {};

function formatMoney(n){return '$' + n.toLocaleString('es-CO')}

async function loadProducts(){
  try{
    const res = await fetch('./products.json');
    products = await res.json();
  }catch(e){
    console.error('No se pudo cargar products.json, usando lista por defecto', e);
    products = [];
  }
  renderProducts();
  renderCart();
}

function renderProducts(){
  const el = document.getElementById('products');
  el.innerHTML = '';
  if(!products.length){ el.innerHTML = '<p class="empty">No hay productos en el catálogo.</p>'; return; }
  products.forEach(p=>{
    const d = document.createElement('div'); d.className='product';
    d.innerHTML = `
      <img src="${p.image||'https://via.placeholder.com/400x300?text=Producto'}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.description||''}</p>
      <div class="price">${formatMoney(p.price)}</div>
      <div class="controls">
        <button class="small-btn" data-dec="${p.id}">-</button>
        <div class="qty" data-qty-id="${p.id}">${cart[p.id]||0}</div>
        <button class="small-btn" data-inc="${p.id}">+</button>
        <div style="flex:1"></div>
        <button data-id="${p.id}">Agregar</button>
      </div>
    `;
    el.appendChild(d);
  });
  el.addEventListener('click', e=>{
    if(e.target.tagName === 'BUTTON'){
      const id = e.target.dataset.id;
      const inc = e.target.dataset.inc;
      const dec = e.target.dataset.dec;
      if(id) { addToCart(id); }
      else if(inc) { addToCart(inc); }
      else if(dec) { decrementInCart(dec); }
    }
  });
}

function addToCart(id){
  if(!cart[id]) cart[id]=0; cart[id]++;
  saveCart(); renderCart(); updateProductQtyDisplay(id);
}

function decrementInCart(id){
  if(!cart[id]) return; cart[id]--; if(cart[id]<=0) delete cart[id];
  saveCart(); renderCart(); updateProductQtyDisplay(id);
}

function setQty(id, value){
  if(value<=0) { delete cart[id]; } else { cart[id]=value; }
  saveCart(); renderCart(); updateProductQtyDisplay(id);
}

function updateProductQtyDisplay(id){
  const el = document.querySelector(`[data-qty-id="${id}"]`);
  if(el) el.textContent = cart[id]||0;
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML='';
  let total = 0;
  const ids = Object.keys(cart);
  if(ids.length===0){ container.innerHTML='(Carrito vacío)'; document.getElementById('cart-total').textContent='Total: $0'; return; }
  ids.forEach(id=>{
    const qty = cart[id];
    const p = products.find(x=>x.id==id) || {name:'Producto',price:0};
    const line = document.createElement('div'); line.className='item';
    line.innerHTML = `
      <div>
        <strong>${p.name}</strong><br><small class="unit">${formatMoney(p.price)} c/u</small>
      </div>
      <div>
        <div class="qty-controls">
          <button class="small-btn" data-dec-cart="${id}">-</button>
          <span>${qty}</span>
          <button class="small-btn" data-inc-cart="${id}">+</button>
        </div>
        <div style="text-align:right">${formatMoney((p.price||0)*qty)}</div>
      </div>
    `;
    container.appendChild(line);
  });
  container.addEventListener('click', e=>{
    if(e.target.dataset.incCart){ addToCart(e.target.dataset.incCart); }
    if(e.target.dataset.decCart){ decrementInCart(e.target.dataset.decCart); }
  });
  ids.forEach(id=>{ const p = products.find(x=>x.id==id); total += (p? p.price:0) * cart[id]; });
  document.getElementById('cart-total').textContent = 'Total: ' + formatMoney(total);
}

function saveCart(){ localStorage.setItem('granja_cart', JSON.stringify(cart)); }
function loadCart(){ const s = localStorage.getItem('granja_cart'); if(s) cart = JSON.parse(s); }

function isValidPhone(phone){
  const digits = phone.replace(/\D/g,'');
  // aceptamos entre 7 y 13 dígitos (incluye código país si se ingresa)
  return digits.length >= 7 && digits.length <= 13;
}

function buildOrderMessage(){
  const name = document.getElementById('customer-name').value.trim() || 'Cliente (no especificado)';
  const phone = document.getElementById('customer-phone').value.trim() || '';
  const addr = document.getElementById('customer-address').value.trim() || '';
  let msg = `Pedido Granja Emiluc\n\n`;
  msg += `Cliente: ${name}\n`;
  if(phone) msg += `Tel: ${phone}\n`;
  if(addr) msg += `Observaciones: ${addr}\n\n`;
  msg += `Productos:\n`;
  let total = 0;
  Object.keys(cart).forEach(id=>{
    const qty = cart[id];
    const p = products.find(x=>x.id==id) || {name:'Producto',price:0};
    msg += `- ${p.name} (x${qty}) - ${formatMoney((p.price||0)*qty)}\n`;
    total += (p.price||0) * qty;
  });
  msg += `\nTotal: ${formatMoney(total)}`;
  return encodeURIComponent(msg);
}

function checkout(){
  if(Object.keys(cart).length===0){ alert('El carrito está vacío'); return; }
  const phoneInput = document.getElementById('customer-phone').value.trim();
  if(phoneInput && !isValidPhone(phoneInput)){
    alert('Teléfono inválido. Por favor ingresa un número válido (solo dígitos, con o sin código de país).');
    return;
  }
  // confirmation
  const confirmText = `Vas a enviar el pedido por WhatsApp. ¿Deseas continuar?`;
  if(!confirm(confirmText)) return;
  const msg = buildOrderMessage();
  const url = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  window.open(url,'_blank');
}

// init
loadCart();
loadProducts();

document.getElementById('checkout').addEventListener('click', checkout);
