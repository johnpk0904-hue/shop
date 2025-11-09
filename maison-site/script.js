/* ---------- 상품 목록 ---------- */
const products = [
  {id:1,title:'캐시미어 스카프',price:159000,img:'https://assets.burberry.com/is/image/Burberryltd/CC8153DF-5F66-4659-957B-7F488E181857?$BBY_V3_SL_1$&wid=1501&hei=1500', desc:'부드럽고 고급스러운 캐시미어 스카프'},
  {id:2,title:'레더 토트백',price:249000,img:'https://chillaxstore.kr/web/product/big/202502/ce36716ad7b5caa40fb9be2f868dd687.jpg', desc:'세련된 디자인의 레더 토트백'},
  {id:3,title:'헤리티지 시계',price:499000,img:'https://www.midowatches.com/media/catalog/product/cache/4a87fe500b0570e77816f1ebe2532e64/M/0/M027.407.11.010.00_0_front_1_1.png', desc:'클래식한 헤리티지 시계'},
  {id:4,title:'실크 블라우스',price:189000,img:'https://shop4.daumcdn.net/thumb/R500x500/?fname=http%3A%2F%2Fshop4.daumcdn.net%2Fshophow%2Fp%2FA5255193757.jpg%3Fut%3D20251029154052', desc:'부드러운 실크 소재 블라우스'},
  {id:5,title:'울 블레이저',price:299000,img:'https://ecimg.cafe24img.com/pg594b45786751083/dlsjt/web/product/big/20240104/cd09c7168c87d347d2e1011ad5bd7609.jpg', desc:'모던한 디자인의 울 블레이저'},
];

const newProducts = [
  {id:6,title:'플로럴 원피스',price:179000,img:'https://m.chic-line.com/web/product/big/202101/7bd69d400a7e591820bdb257d81f8c5b.jpg', desc:'화사한 플로럴 원피스'},
  {id:7,title:'스웨이드 슈즈',price:129000,img:'https://m.order-m.com/web/product/big/202209/fb994876e72513d188ed34eda3f69914.jpg', desc:'편안한 스웨이드 슈즈'},
  {id:8,title:'캐주얼 재킷',price:219000,img:'https://images.lululemon.com/is/image/lululemon/LM4ATXS_070108_1?size=1200,1200', desc:'데일리 캐주얼 재킷'},
];

const cart = {};
const productGrid = document.getElementById('productGrid');
const newProductGrid = document.getElementById('newProductGrid');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');

function formatKRW(n){return '₩'+n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}

/* ---------- 상품 렌더링 ---------- */
function renderProducts(){
  productGrid.innerHTML='';
  products.forEach(p=>{
    const el=document.createElement('div');
    el.className='product';
    el.innerHTML=`
      <div class="media"><img src="${p.img}" alt="${p.title}"></div>
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="price">${formatKRW(p.price)}</div>
      </div>
    `;
    el.addEventListener('click',()=>showDetail(p));
    productGrid.appendChild(el);
  });

  newProductGrid.innerHTML='';
  newProducts.forEach(p=>{
    const el=document.createElement('div');
    el.className='product';
    el.innerHTML=`
      <div class="media"><img src="${p.img}" alt="${p.title}"></div>
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="price">${formatKRW(p.price)}</div>
      </div>
    `;
    el.addEventListener('click',()=>showDetail(p));
    newProductGrid.appendChild(el);
  });
}

/* ---------- 상세 화면 ---------- */
const productDetail=document.getElementById('productDetail');
const detailContent=document.getElementById('detailContent');

function showDetail(p){
  document.getElementById('recommendedProducts').style.display='none';
  document.getElementById('newProducts').style.display='none';
  productDetail.style.display='block';
  document.getElementById('homeBtn').style.display='inline';
  document.getElementById('newProductsBtn').style.display='none';

  detailContent.innerHTML=`
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      <div style="flex:1; min-width:240px;"><img src="${p.img}" alt="${p.title}" style="width:100%; border-radius:12px;"></div>
      <div style="flex:1; min-width:200px;">
        <h2>${p.title}</h2>
        <div class="price" style="margin:6px 0;">${formatKRW(p.price)}</div>
        <p style="margin:12px 0;">${p.desc}</p>
        <div class="sizes" style="display:flex; gap:10px;">
          <button class="size-btn" style="flex:1;" onclick="addToCart(${p.id},'S')">S</button>
          <button class="size-btn" style="flex:1;" onclick="addToCart(${p.id},'M')">M</button>
          <button class="size-btn" style="flex:1;" onclick="addToCart(${p.id},'L')">L</button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- 장바구니 관련 ---------- */
function updateCartCount(){
  const count=Object.values(cart).reduce((s,it)=>s+it.qty,0);
  cartCount.textContent=count;
}
function openCart(){cartDrawer.classList.add('open')}
function closeCart(){cartDrawer.classList.remove('open')}

function addToCart(id,size){
  const p=[...products,...newProducts].find(x=>x.id===id);
  const key=id+'-'+size;
  if(!cart[key]) cart[key]={...p,qty:0,size:size};
  cart[key].qty+=1;
  renderCart();
  openCart();
}

function removeFromCart(key){
  delete cart[key];
  renderCart();
}

function renderCart(){
  cartItemsEl.innerHTML='';
  const items=Object.values(cart);
  if(items.length===0){
    cartItemsEl.innerHTML='<div style="color:#999;padding:22px;text-align:center">장바구니가 비어 있습니다.</div>';
    cartTotalEl.textContent=formatKRW(0);
    updateCartCount();
    return;
  }
  let total=0;
  items.forEach(it=>{
    total+=it.price*it.qty;
    const itemEl=document.createElement('div');
    itemEl.className='cart-item';
    itemEl.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <div>
          <div style="font-weight:700">${it.title} (${it.size})</div>
          <div style="color:#999;font-size:13px;margin-top:4px;">${formatKRW(it.price)}</div>
        </div>
        <button class="btn btn-ghost" onclick="removeFromCart('${it.id}-${it.size}')">❌</button>
      </div>
    `;
    cartItemsEl.appendChild(itemEl);
  });
  cartTotalEl.textContent=formatKRW(total);
  updateCartCount();
}

/* ---------- 홈/신상품/상세 화면 ---------- */
const homeBtn=document.getElementById('homeBtn');
const newBtn=document.getElementById('newProductsBtn');
const backHome=document.getElementById('backHome');

newBtn.addEventListener('click',()=>{
  document.getElementById('recommendedProducts').style.display='none';
  document.getElementById('newProducts').style.display='block';
  productDetail.style.display='none';
  homeBtn.style.display='inline';
  newBtn.style.display='none';
});
homeBtn.addEventListener('click',()=>{
  document.getElementById('recommendedProducts').style.display='block';
  document.getElementById('newProducts').style.display='none';
  productDetail.style.display='none';
  homeBtn.style.display='none';
  newBtn.style.display='inline';
});
backHome.addEventListener('click',()=>{
  document.getElementById('recommendedProducts').style.display='block';
  document.getElementById('newProducts').style.display='none';
  productDetail.style.display='none';
  homeBtn.style.display='none';
  newBtn.style.display='inline';
});

/* ---------- 결제 폼 & 구글폼 전송 ---------- */
const paymentModal=document.getElementById('paymentModal');
const pmBackdrop=document.getElementById('pmBackdrop');
const pmClose=document.getElementById('pmClose');
const paymentForm=document.getElementById('paymentForm');
const submitMsg=document.getElementById('submitMsg');

function openPaymentModal(){paymentModal.setAttribute('aria-hidden','false')}
function closePaymentModal(){paymentModal.setAttribute('aria-hidden','true')}
pmBackdrop.addEventListener('click',closePaymentModal);
pmClose.addEventListener('click',closePaymentModal);

document.getElementById('openCart').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  const total=Object.values(cart).reduce((s,it)=>s+it.price*it.qty,0);
  if(total<=0){alert('장바구니가 비어 있습니다.');return;}
  closeCart();openPaymentModal();
});

paymentForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData=new FormData(paymentForm);
  const name=formData.get('entry.1370334034');
  const phone=formData.get('entry.367871240');
  const address=formData.get('entry.527239213');
  const orderList=Object.values(cart).map(it=>`${it.title} (${it.size}) x ${it.qty}`).join(', ');
  const data=new URLSearchParams();
  data.append('entry.1370334034',name);
  data.append('entry.367871240',phone);
  data.append('entry.527239213',address);
  data.append('entry.2049491400',orderList);
  fetch('https://docs.google.com/forms/d/e/1FAIpQLSdjdHEMP07T7EAS2zlxjFYziYpzojLBp-UhDvA7M7BfmN5k9A/formResponse',{
    method:'POST',body:data,mode:'no-cors'
  });
  paymentForm.classList.add('hidden');
  submitMsg.classList.remove('hidden');
  cartItemsEl.innerHTML='';
  Object.keys(cart).forEach(k=>delete cart[k]);
  updateCartCount();
});

/* ---------- 초기 렌더 ---------- */
renderProducts();
renderCart();