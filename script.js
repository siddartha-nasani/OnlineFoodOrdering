const starterFoods = [
  {id:1,name:'Classic Burger',price:149,emoji:'🍔'},
  {id:2,name:'Margherita Pizza',price:249,emoji:'🍕'},
  {id:3,name:'Masala Dosa',price:99,emoji:'🥞'},
  {id:4,name:'Veg Noodles',price:139,emoji:'🍜'},
  {id:5,name:'French Fries',price:89,emoji:'🍟'},
  {id:6,name:'Chocolate Shake',price:119,emoji:'🥤'}
];
let foods = JSON.parse(localStorage.getItem('fo-foods') || 'null') || starterFoods;
let cart = [];
let orders = JSON.parse(localStorage.getItem('fo-orders') || '[]');
let customer = JSON.parse(localStorage.getItem('fo-customer') || 'null');

const money = n => '₹' + n;
function saveFoods(){localStorage.setItem('fo-foods',JSON.stringify(foods));}
function renderMenu(){
  document.getElementById('menuGrid').innerHTML=foods.map(f=>`
    <article class="food-card"><div class="food-emoji">${f.emoji || '🍽️'}</div>
    <div class="food-info"><div><h3>${escapeHtml(f.name)}</h3><p>${money(f.price)}</p></div></div>
    <button class="primary" onclick="addToCart(${f.id})">Add to cart +</button></article>`).join('') || '<p>No food items available.</p>';
  renderAdmin();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function addToCart(id){const f=foods.find(x=>x.id===id);if(!f)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...f,qty:1});renderCart();}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById('cartCount').textContent=`🛒 ${count} item${count===1?'':'s'}`;
  document.getElementById('cartTotal').textContent=money(total);
  document.getElementById('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><span>${x.emoji} ${escapeHtml(x.name)} × ${x.qty}</span><strong>${money(x.price*x.qty)}</strong></div>`).join(''):'Your cart is empty.';
}
function renderOrders(){
  document.getElementById('orderList').innerHTML=orders.length?orders.slice().reverse().map(o=>`<div class="order-card"><strong>Order #${o.id}</strong> · ${money(o.total)}<br><small>${escapeHtml(o.customer)} · ${o.date} · ${o.status}</small><p>${o.items.map(i=>`${escapeHtml(i.name)} × ${i.qty}`).join(', ')}</p></div>`).join(''):'No orders yet.';
}
function renderAdmin(){document.getElementById('adminList').innerHTML=foods.map(f=>`<div class="admin-row"><span>${f.emoji} ${escapeHtml(f.name)} · ${money(f.price)}</span><button class="remove" onclick="removeFood(${f.id})">Delete</button></div>`).join('')||'No items.';}
function removeFood(id){foods=foods.filter(f=>f.id!==id);saveFoods();renderMenu();}
document.getElementById('addFoodForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('foodName').value.trim(),price=Number(document.getElementById('foodPrice').value),emoji=document.getElementById('foodEmoji').value.trim()||'🍽️';if(!name||price<1)return;foods.push({id:Date.now(),name,price,emoji});saveFoods();renderMenu();e.target.reset();});
document.getElementById('placeOrder').addEventListener('click',()=>{
  if(!cart.length){alert('Please add food items to your cart first.');return;}
  if(!customer){document.getElementById('loginDialog').showModal();alert('Please enter your name and email before placing an order.');return;}
  const order={id:Date.now().toString().slice(-6),customer:customer.name,total:cart.reduce((s,x)=>s+x.price*x.qty,0),items:cart.map(x=>({...x})),date:new Date().toLocaleString(),status:'Order placed'};
  orders.push(order);localStorage.setItem('fo-orders',JSON.stringify(orders));cart=[];renderCart();renderOrders();alert('Order placed successfully!');document.getElementById('orders').scrollIntoView();
});
document.getElementById('loginBtn').addEventListener('click',()=>document.getElementById('loginDialog').showModal());
document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();customer={name:document.getElementById('customerName').value.trim(),email:document.getElementById('customerEmail').value.trim()};localStorage.setItem('fo-customer',JSON.stringify(customer));document.getElementById('loginDialog').close();document.getElementById('loginBtn').textContent='Hi, '+customer.name;});
if(customer)document.getElementById('loginBtn').textContent='Hi, '+customer.name;
renderMenu();renderCart();renderOrders();
