// app.js - manejo simple de carrito y envío por WhatsApp
const WA_NUMBER = '573505182091'; // +57 350 518 2091
let products = [];
let cart = {};

function formatMoney(n){return '$' + n.toLocaleString('es-CO')}

async function loadProducts(){
  try{
    const res = await fetch('products.json');
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
  products.forEach(p=>{
    const d = document.createElement('div'); d.className='product';
    d.innerHTML = `
      <img src="${p.image||'https://via.placeholder.com/300x200?text=Producto'}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.description||''}</p>
      <div class="price">${formatMoney(p.price)}</div>
      <div style="margin-top:8px"><button data-id="${p.id}">Agregar</button></div>
    `;
    el.appendChild(d);
  });
  el.addEventListener('click', e=>{
    if(e.target.tagName === 'BUTTON'){
      const id = e.target.dataset.id; addToCart(id);
    }
  });
}

function addToCart(id){
  if(!cart[id]) cart[id]=0; cart[id]++;
  saveCart(); renderCart();
}

function removeFromCart(id){
  if(!cart[id]) return; cart[id]--; if(cart[id]<=0) delete cart[id];
  saveCart(); renderCart();
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML='';
  let total = 0;
  Object.keys(cart).forEach(id=>{
    const qty = cart[id];
    const p = products.find(x=>x.id==id) || {name:'Producto',price:0};
    const line = document.createElement('div'); line.className='item';
    line.innerHTML = `<div>${p.name} x${qty}</div><div>${formatMoney(p.price*qty)} <button data-rid="${id}">-</button></div>`;
    container.appendChild(line);
  });
  container.addEventListener('click', e=>{
    if(e.target.tagName==='BUTTON' && e.target.dataset.rid){ removeFromCart(e.target.dataset.rid); }
  });
  Object.keys(cart).forEach(id=>{ const p = products.find(x=>x.id==id); total += (p? p.price:0) * cart[id]; });
  document.getElementById('cart-total').textContent = 'Total: ' + formatMoney(total);
}

function saveCart(){ localStorage.setItem('granja_cart', JSON.stringify(cart)); }
function loadCart(){ const s = localStorage.getItem('granja_cart'); if(s) cart = JSON.parse(s); }

function buildOrderMessage(){
  const name = document.getElementById('customer-name').value || 'Cliente (no especificado)';
  const phone = document.getElementById('customer-phone').value || '';
  const addr = document.getElementById('customer-address').value || '';
  let msg = `Pedido Granja Emiluc%0A%0A`;
  msg += `Cliente: ${encodeURIComponent(name)}%0A`;
  if(phone) msg += `Tel: ${encodeURIComponent(phone)}%0A`;
  if(addr) msg += `%0AObservaciones: ${encodeURIComponent(addr)}%0A`;
  msg += `%0AProductos:%0A`;
  let total = 0;
  Object.keys(cart).forEach(id=>{
    const qty = cart[id];
    const p = products.find(x=>x.id==id) || {name:'Producto',price:0};
    const line = `- ${p.name} (x${qty}) - ${formatMoney(p.price*qty)}`;
    msg += encodeURIComponent(line) + '%0A';
    total += (p.price||0) * qty;
  });
  msg += `%0ATotal: ${encodeURIComponent(formatMoney(total))}`;
  return msg;
}

function checkout(){
  if(Object.keys(cart).length===0){ alert('El carrito está vacío'); return; }
  const msg = buildOrderMessage();
  const url = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  window.open(url,'_blank');
}

// init
loadCart();
loadProducts();

document.getElementById('checkout').addEventListener('click', checkout);
