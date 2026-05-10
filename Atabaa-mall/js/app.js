// ===== UTILITY =====
function $(id) { return document.getElementById(id); }
function $$(sel, ctx) { return (ctx||document).querySelectorAll(sel); }
function qs(sel, ctx) { return (ctx||document).querySelector(sel); }
function toast(msg, type='info') { const c=$('toast-container'), t=document.createElement('div'); t.className='toast '+type; t.innerHTML=msg; c.appendChild(t); setTimeout(()=>t.remove(), 3000); }

// ===== DATA LOADER =====
let _apiAvailable = false;
async function loadApiData() {
  try {
    const [categories, products, merchants] = await Promise.all([
      API.getCategories(),
      API.getProducts(),
      API.getMerchants()
    ]);
    Store.categories = categories;
    Store.products = products;
    Store.merchants = merchants;
    _apiAvailable = true;
    console.log('✅ متصل بقاعدة البيانات');
  } catch (e) {
    console.warn('⚠️ الخادم غير متصل، استخدام البيانات المحلية');
    _apiAvailable = false;
  }
  renderPage(Store.currentPage || 'home');
}

// ===== ROUTER =====
let currentParams = {};
function navigate(page, params) {
  currentParams = params || {};
  Store.currentPage = page;
  if (page === 'category' && params) {
    Store.currentCategory = params.id;
    Store.currentSubCategory = params.sub || null;
  }
  const target = $('page-content');
  target.classList.remove('fade-in');
  void target.offsetWidth;
  renderPage(page);
  target.classList.add('fade-in');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateActiveNav();
  closeMobileMenu();
}

function updateActiveNav() {
  $$('#main-nav .nav-list > li > a').forEach(a => a.classList.remove('active'));
  const page = Store.currentPage;
  if (page === 'home') qs('.nav-list > li > a[onclick*="home"]')?.classList.add('active');
}

async function renderPage(page) {
  const target = $('page-content');
  try {
    switch(page) {
      case 'home':
        if (_apiAvailable) {
          Store.products = await API.getProducts();
          Store.categories = await API.getCategories();
        }
        renderHome(target); break;
      case 'category':
        if (_apiAvailable) {
          const params = new URLSearchParams();
          if (Store.currentCategory) params.set('category', Store.currentCategory);
          if (Store.currentSubCategory) params.set('sub_category', Store.currentSubCategory);
          Store._currentFiltered = await API.getProducts(params.toString());
        }
        renderCategory(target); break;
      case 'product':
        if (_apiAvailable && currentParams.id) {
          const p = await API.getProduct(currentParams.id);
          const idx = Store.products.findIndex(x => x.id === +currentParams.id);
          if (idx >= 0) Store.products[idx] = p;
          else Store.products.push(p);
        }
        renderProduct(target); break;
      case 'cart': renderCart(target); break;
      case 'dashboard':
        if (_apiAvailable && API.token) {
          try {
            const stats = await API.getMerchantStats();
            Store._dashboardStats = stats;
          } catch(e) {}
        }
        renderDashboard(target); break;
      case 'admin':
        if (_apiAvailable) {
          try {
            Store.adminStats = await API.getAdminStats();
            Store.adminMerchants = await API.getMerchants();
          } catch(e) {}
        }
        renderAdmin(target); break;
      default: renderHome(target);
    }
  } catch(e) {
    console.warn(e);
    switch(page) {
      case 'category': renderCategory(target); break;
      case 'product': renderProduct(target); break;
      case 'dashboard': renderDashboard(target); break;
      case 'admin': renderAdmin(target); break;
      default: renderHome(target);
    }
  }
}

// ===== HOME =====
function renderHome(target) {
  const featured = Store.products.filter(p => p.featured).slice(0, 8);
  target.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge"><i class="fas fa-store"></i> أكثر من ٤٨ تاجر موثوق</span>
        <h2>تسوق من قلب <br>منطقة العتبة</h2>
        <p>أكبر سوق إلكتروني متعدد المتاجر في مصر. مئات البائعين، آلاف المنتجات، كل ما تحتاجه في مكان واحد.</p>
        <div class="hero-buttons">
          <a class="btn btn-primary" onclick="navigate('category',{id:'clothes'})"><i class="fas fa-shopping-bag"></i> تسوق الآن</a>
          <a class="btn btn-outline" onclick="navigate('dashboard')"><i class="fas fa-store"></i> افتح متجرك</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://placehold.co/250x250/C0392B/FFFFFF?text=مول+العتبة" alt="مول العتبة">
      </div>
    </section>
    <div class="trust-badges">
      <div class="trust-badge"><i class="fas fa-truck"></i><h5>شحن سريع</h5><p>توصيل لجميع المحافظات</p></div>
      <div class="trust-badge"><i class="fas fa-shield-alt"></i><h5>تاجر موثوق</h5><p>جميع البائعين موثقين</p></div>
      <div class="trust-badge"><i class="fas fa-undo-alt"></i><h5>إرجاع مجاني</h5><p>خلال ١٤ يوم</p></div>
      <div class="trust-badge"><i class="fas fa-headset"></i><h5>دعم فني</h5><p>خدمة عملاء ٢٤/٧</p></div>
    </div>
    <div class="section-title"><h3>الأقسام الرئيسية</h3><a onclick="navigate('category',{id:'clothes'})">عرض الكل <i class="fas fa-arrow-left"></i></a></div>
    <div class="categories-grid">
      ${Store.categories.map(c => `
        <div class="category-card" onclick="navigate('category',{id:'${c.id}'})">
          <img src="${c.image}" alt="${c.name}">
          <div class="category-card-body">
            <i class="fas ${c.icon}" style="color:${c.color}"></i>
            <h4>${c.name}</h4>
            <p>${c.count} تاجر</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="section-title" style="margin-top:10px"><h3>أفضل المنتجات</h3></div>
    <div class="products-grid">
      ${renderProductCards(featured)}
    </div>
    <div class="section-title" style="margin-top:30px"><h3>أحدث المنتجات</h3></div>
    <div class="products-grid">
      ${renderProductCards(Store.products.slice(0, 4))}
    </div>
  `;
}

// ===== PRODUCT CARDS =====
function renderProductCards(products) {
  if (!products || !products.length) return '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i><h3>لا توجد منتجات</h3></div>';
  return products.map(p => {
    const d = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : p.discount || 0;
    return `
      <div class="product-card">
        ${d > 0 ? `<span class="product-badge">-${d}%</span>` : ''}
        <div class="product-img" onclick="navigate('product',{id:${p.id}})">
          <img src="${(p.images && p.images[0]) || 'https://placehold.co/300x300/eee/999?text=منتج'}" alt="${p.name}" loading="lazy">
          <div class="product-actions">
            <button onclick="event.stopPropagation();addToCart(${p.id})" title="أضف للسلة"><i class="fas fa-shopping-cart"></i></button>
            <button onclick="event.stopPropagation();openWhatsApp('${p.whatsapp || p.phone}','${p.name}')" title="اطلب عبر واتساب"><i class="fab fa-whatsapp"></i></button>
          </div>
        </div>
        <div class="product-body" onclick="navigate('product',{id:${p.id}})">
          <div class="shop-name"><i class="fas fa-store"></i> ${p.shop_name}</div>
          <h4>${p.name}</h4>
          <div class="price">
            ${(+p.price).toLocaleString('ar-EG')} ج.م
            ${p.original_price ? `<span class="original">${(+p.original_price).toLocaleString('ar-EG')} ج.م</span>` : ''}
          </div>
          <div class="product-meta">
            <div class="rating"><i class="fas fa-star"></i> ${p.rating} <span>(${p.sales})</span></div>
            <div class="sales"><i class="fas fa-shopping-bag"></i> ${p.sales}+</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== CATEGORY =====
function renderCategory(target) {
  const catId = Store.currentCategory || 'clothes';
  const cat = Store.categories.find(c => c.id === catId);
  const subId = Store.currentSubCategory;
  if (!cat) { renderHome(target); return; }
  let items = Store._currentFiltered || Store.products.filter(p => p.category === catId);
  if (subId) items = items.filter(p => p.sub_category === subId);
  const catName = subId ? (cat.subcategories || []).find(s => s.id === subId)?.name || cat.name : cat.name;
  target.innerHTML = `
    <div class="breadcrumb">
      <a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a>
      <span class="separator"><i class="fas fa-chevron-left"></i></span>
      <a onclick="navigate('category',{id:'${catId}'})"><i class="fas ${cat.icon}"></i> ${cat.name}</a>
      ${subId ? `<span class="separator"><i class="fas fa-chevron-left"></i></span><span>${catName}</span>` : ''}
    </div>
    <div class="page-title"><div><h2>${catName} <span style="font-weight:400;font-size:14px;color:var(--gray-600)">(${items.length} منتج)</span></h2></div></div>
    <div class="sub-categories">
      ${(cat.subcategories || []).map(s => `
        <button class="sub-cat-btn ${subId === s.id ? 'active' : ''}" onclick="navigate('category',{id:'${catId}',sub:'${s.id}'})"><i class="fas fa-map-marker-alt"></i> ${s.name}</button>
      `).join('')}
      <button class="sub-cat-btn ${!subId ? 'active' : ''}" onclick="navigate('category',{id:'${catId}'})"><i class="fas fa-th-large"></i> الكل</button>
    </div>
    <div class="filters-bar">
      <select id="sort-select" onchange="applyFilters()">
        <option value="">ترتيب حسب: الافتراضي</option>
        <option value="price-asc">السعر: الأقل أولاً</option>
        <option value="price-desc">السعر: الأعلى أولاً</option>
        <option value="rating">التقييم: الأعلى أولاً</option>
        <option value="sales">الأكثر مبيعاً</option>
      </select>
      <select id="price-filter" onchange="applyFilters()">
        <option value="">جميع الأسعار</option>
        <option value="0-200">أقل من ٢٠٠ ج.م</option>
        <option value="200-500">من ٢٠٠ - ٥٠٠ ج.م</option>
        <option value="500-1000">من ٥٠٠ - ١٠٠٠ ج.م</option>
        <option value="1000+">أكثر من ١٠٠٠ ج.م</option>
      </select>
    </div>
    <div class="products-grid" id="category-products">
      ${items.length ? renderProductCards(items) : '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i><h3>لا توجد منتجات</h3></div>'}
    </div>
  `;
  Store._currentFiltered = items;
}

function applyFilters() {
  const sort = $('sort-select')?.value;
  const price = $('price-filter')?.value;
  let items = [...(Store._currentFiltered || [])];
  if (price) {
    const [min, max] = price.split('-');
    if (max) items = items.filter(p => +p.price >= +min && +p.price <= +max);
    else items = items.filter(p => +p.price >= +min);
  }
  if (sort === 'price-asc') items.sort((a,b) => +a.price - +b.price);
  else if (sort === 'price-desc') items.sort((a,b) => +b.price - +a.price);
  else if (sort === 'rating') items.sort((a,b) => b.rating - a.rating);
  else if (sort === 'sales') items.sort((a,b) => b.sales - a.sales);
  $('category-products').innerHTML = items.length ? renderProductCards(items) : '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-box-open"></i><h3>لا توجد نتائج</h3><p>حاول تغيير معايير البحث</p></div>';
}

// ===== PRODUCT DETAIL =====
function renderProduct(target) {
  const id = currentParams.id;
  const p = Store.products.find(x => x.id == id);
  if (!p) { renderHome(target); return; }
  const discount = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : p.discount || 0;
  Store.lightboxImages = p.images || [];
  Store.lightboxIndex = 0;
  const images = (p.images && p.images.length) ? p.images : ['https://placehold.co/600x700/eee/999?text=منتج'];
  target.innerHTML = `
    <div class="breadcrumb">
      <a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a>
      <span class="separator"><i class="fas fa-chevron-left"></i></span>
      <a onclick="navigate('category',{id:'${p.category}'})">${(Store.categories.find(c=>c.id===p.category)||{}).name||''}</a>
      <span class="separator"><i class="fas fa-chevron-left"></i></span>
      <span>${p.name}</span>
    </div>
    <div class="product-detail">
      <div class="product-gallery">
        <div class="main-image" onclick="openLightbox(0)">
          <img id="main-product-img" src="${images[0]}" alt="${p.name}">
        </div>
        <div class="gallery-thumbs">
          ${images.map((img, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImage(${i})"><img src="${img}" alt=""></div>
          `).join('')}
        </div>
      </div>
      <div class="product-info">
        <span class="product-category"><i class="fas ${(Store.categories.find(c=>c.id===p.category)||{}).icon}"></i> ${(Store.categories.find(c=>c.id===p.category)||{}).name}</span>
        <h2>${p.name}</h2>
        <div class="rating-row">
          <span class="stars">${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}${p.rating%1>=0.5?'<i class="fas fa-star-half-alt"></i>':''}</span>
          <span>${p.rating} (${p.sales} تقييم)</span>
          <span><i class="fas fa-shopping-bag"></i> ${p.sales}+ عملية بيع</span>
        </div>
        <div class="price-row">
          <span class="current">${(+p.price).toLocaleString('ar-EG')} ج.م</span>
          ${p.original_price ? `<span class="old">${(+p.original_price).toLocaleString('ar-EG')} ج.م</span><span class="discount">وفر ${discount}%</span>` : ''}
        </div>
        <p class="description">${p.description}</p>
        <div class="shop-info">
          <div class="shop-avatar"><img src="${(Store.merchants.find(m=>m.name===p.shop_name)||{}).image||'https://placehold.co/50x50/C0392B/FFFFFF?text=م'}" alt=""></div>
          <div class="shop-details">
            <h5><i class="fas fa-store"></i> ${p.shop_name}</h5>
            <p><i class="fas fa-map-marker-alt"></i> كشك ${p.stall}</p>
          </div>
        </div>
        <div class="options-row">
          <div class="option-group">
            <label>اللون:</label>
            <div class="color-options">
              ${(p.colors||[]).map((c, i) => `
                <div class="color-option ${i===0?'active':''}" style="background:${getColorHex(c)}" onclick="selectColor(this,'${c}')" title="${c}"></div>
              `).join('')}
            </div>
          </div>
          ${(p.sizes||[]).length ? `
          <div class="option-group">
            <label>المقاس:</label>
            <select id="size-select">${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
          </div>` : ''}
        </div>
        <div class="action-buttons">
          <button class="btn btn-whatsapp" onclick="openWhatsApp('${p.whatsapp||p.phone}','${p.name}')"><i class="fab fa-whatsapp"></i> طلب عبر واتساب</button>
          <button class="btn btn-add-cart" onclick="addToCart(${p.id})"><i class="fas fa-shopping-cart"></i> أضف إلى السلة</button>
        </div>
      </div>
    </div>
    <div class="section-title" style="margin-top:40px"><h3>منتجات مشابهة</h3></div>
    <div class="products-grid">
      ${renderProductCards(Store.products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4))}
    </div>
  `;
}

function changeMainImage(index) {
  Store.lightboxIndex = index;
  if ($('main-product-img') && Store.lightboxImages[index]) $('main-product-img').src = Store.lightboxImages[index];
  $$('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
}
function openLightbox(index) { Store.lightboxIndex = index; $('lightbox').classList.add('open'); updateLightbox(); }
function closeLightbox() { $('lightbox').classList.remove('open'); }
function lightboxNav(dir) { Store.lightboxIndex = (Store.lightboxIndex + dir + Store.lightboxImages.length) % Store.lightboxImages.length; updateLightbox(); if ($('main-product-img') && Store.lightboxImages[Store.lightboxIndex]) $('main-product-img').src = Store.lightboxImages[Store.lightboxIndex]; }
function updateLightbox() { $('lightbox-img').src = Store.lightboxImages[Store.lightboxIndex]; $('lightbox-counter').textContent = `${Store.lightboxIndex+1} / ${Store.lightboxImages.length}`; }
function selectColor(el, c) { $$('.color-option').forEach(x => x.classList.remove('active')); el.classList.add('active'); Store._selectedColor = c; }

function getColorHex(color) {
  const map = { 'أسود':'#000','أبيض':'#fff','أحمر':'#E74C3C','أزرق':'#3498DB','أزرق ملكي':'#4169E1','أخضر':'#27AE60','أصفر':'#F1C40F','بيج':'#F5F5DC','بني':'#8B4513','رمادي':'#808080','رمادي فاتح':'#D3D3D3','كحلي':'#1A3A5C','بنفسجي':'#9B59B6','ذهبي':'#D4AC0D','فضي':'#C0C0C0','وردي':'#E91E63','وردي فاتح':'#FFB6C1','عاجي':'#FFFFF0','شفاف':'#E0E0E0','نيلي':'#2C3E50','متعدد الألوان':'linear-gradient(45deg,red,blue,green)'};
  return map[color] || '#ccc';
}

// ===== CART =====
function addToCart(productId) {
  const p = Store.products.find(x => x.id == productId);
  if (!p) return;
  const existing = Store.cart.find(x => x.id == productId);
  if (existing) existing.qty++;
  else Store.cart.push({ ...p, qty: 1 });
  updateCartBadge();
  toast(`تم إضافة "${p.name}" إلى السلة`, 'success');
  if (Store.currentPage === 'cart') renderCart($('page-content'));
}
function removeFromCart(productId) { Store.cart = Store.cart.filter(x => x.id != productId); updateCartBadge(); renderCart($('page-content')); toast('تم حذف المنتج من السلة', 'info'); }
function updateQty(productId, delta) { const item = Store.cart.find(x => x.id == productId); if (!item) return; item.qty = Math.max(1, item.qty + delta); renderCart($('page-content')); updateCartBadge(); }
function updateCartBadge() { const badge = $('cart-badge'); const total = Store.cart.reduce((s, x) => s + x.qty, 0); badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }

function renderCart(target) {
  if (!Store.cart.length) {
    target.innerHTML = `
      <div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>سلة التسوق</span></div>
      <div class="cart-empty" style="background:var(--white);border-radius:var(--radius-lg);padding:60px 20px;text-align:center">
        <i class="fas fa-shopping-cart" style="font-size:60px;color:var(--gray-400);display:block;margin-bottom:15px"></i>
        <h3 style="font-size:20px;color:var(--gray-700);margin-bottom:8px">سلتك فارغة</h3>
        <p style="color:var(--gray-500);margin-bottom:20px">أضف بعض المنتجات الرائعة من مول العتبة!</p>
        <button class="btn btn-primary" onclick="navigate('home')" style="padding:12px 30px;border-radius:50px;background:var(--primary);color:var(--white);font-weight:700"><i class="fas fa-arrow-right"></i> تسوق الآن</button>
      </div>`;
    return;
  }
  const subtotal = Store.cart.reduce((s, x) => s + +x.price * x.qty, 0);
  const shipping = subtotal >= 1000 ? 0 : 35;
  const total = subtotal + shipping;
  target.innerHTML = `
    <div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>سلة التسوق</span></div>
    <div class="page-title"><h2>سلة التسوق <span style="font-weight:400;font-size:14px;color:var(--gray-600)">(${Store.cart.length} منتج)</span></h2></div>
    <div class="cart-page">
      <div class="cart-items">
        ${Store.cart.map(item => `
          <div class="cart-item">
            <img src="${((item.images||[])[0])||'https://placehold.co/80x80/eee/999?text=منتج'}" alt="${item.name}" onclick="navigate('product',{id:${item.id}})" style="cursor:pointer">
            <div class="cart-item-info">
              <h5 onclick="navigate('product',{id:${item.id}})" style="cursor:pointer">${item.name}</h5>
              <div class="cart-item-meta"><i class="fas fa-store"></i> ${item.shop_name}</div>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button onclick="updateQty(${item.id},-1)">-</button>
                  <span>${item.qty}</span>
                  <button onclick="updateQty(${item.id},1)">+</button>
                </div>
                <span class="cart-item-price">${(+item.price * item.qty).toLocaleString('ar-EG')} ج.م</span>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i> حذف</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <h4>ملخص الطلب</h4>
        <div class="summary-row"><span>المجموع الفرعي</span><span>${subtotal.toLocaleString('ar-EG')} ج.م</span></div>
        <div class="summary-row"><span>الشحن</span><span>${shipping === 0 ? 'مجاني' : shipping.toLocaleString('ar-EG')+' ج.م'}</span></div>
        ${shipping > 0 ? '<div class="summary-row" style="font-size:12px;color:var(--gray-500)">أضف '+(1000-subtotal).toLocaleString('ar-EG')+' ج.م للشحن المجاني</div>' : ''}
        <div class="summary-row total"><span>الإجمالي</span><span>${total.toLocaleString('ar-EG')} ج.م</span></div>
        <p style="font-size:12px;color:var(--gray-500);margin:10px 0">سيتم تحويلك إلى واتساب لإتمام الطلب</p>
        <button class="btn-checkout" onclick="checkoutWhatsApp()"><i class="fab fa-whatsapp"></i> إتمام الطلب عبر واتساب</button>
      </div>
    </div>`;
}

function checkoutWhatsApp() {
  if (!Store.cart.length) { toast('سلتك فارغة!', 'error'); return; }
  let msg = '🛒 *طلب جديد من مول العتبة*\n\n';
  Store.cart.forEach((item, i) => {
    msg += `*${i+1}- ${item.name}*\n`;
    msg += `   الكمية: ${item.qty} | السعر: ${(+item.price * item.qty).toLocaleString('ar-EG')} ج.م\n`;
    msg += `   المتجر: ${item.shop_name}\n\n`;
  });
  const total = Store.cart.reduce((s, x) => s + +x.price * x.qty, 0);
  msg += `━━━━━━━━━━━━━━\n*الإجمالي: ${total.toLocaleString('ar-EG')} ج.م*\n`;
  msg += '══════════════\n*شكراً لتسوقك من مول العتبة!*';
  openWhatsApp('201001234567', msg);
}

function openWhatsApp(phone, text) {
  const num = (phone || '').replace(/[^0-9]/g, '');
  const fullNum = num.startsWith('2') ? num : '2' + num;
  const isOrder = typeof text === 'string' && text.includes('🛒');
  const msg = isOrder ? text : 'أهلاً، أريد الاستفسار عن: ' + text;
  window.open(`https://wa.me/${fullNum}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== DASHBOARD =====
function renderDashboard(target) {
  const m = API.merchant || Store.merchants[0];
  if (!m) {
    target.innerHTML = `<div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>لوحة التحكم</span></div>
    <div class="empty-state" style="margin-top:20px"><i class="fas fa-store"></i><h3>تسجيل الدخول</h3><p>يرجى تسجيل الدخول كتاجر للوصول إلى لوحة التحكم</p>
    <div style="margin-top:15px"><input id="login-phone" placeholder="رقم الهاتف" style="padding:10px 15px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);margin-left:10px"><input id="login-pass" type="password" placeholder="كلمة المرور" style="padding:10px 15px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);margin-left:10px">
    <button onclick="merchantLogin()" style="padding:10px 25px;border-radius:50px;background:var(--primary);color:var(--white);font-weight:700">دخول</button></div></div>`;
    return;
  }
  const myProducts = Store.products.filter(p => p.shop_name === m.name);
  target.innerHTML = `
    <div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>لوحة التحكم</span></div>
    <div class="dashboard">
      <div class="dashboard-sidebar">
        <div class="dashboard-user">
          <img src="${m.image||'https://placehold.co/80x80/C0392B/FFFFFF?text=م'}" alt="${m.name}">
          <h5>${m.name}</h5>
          <p>كشك ${m.stall} | ${m.section}</p>
          ${m.verified ? '<span class="status-badge active"><i class="fas fa-check-circle"></i> موثق</span>' : '<span class="status-badge pending">غير موثق</span>'}
        </div>
        <div class="dashboard-nav">
          <a class="active" onclick="switchDashboardTab(this,'overview')"><i class="fas fa-chart-pie"></i> نظرة عامة</a>
          <a onclick="switchDashboardTab(this,'products')"><i class="fas fa-box"></i> منتجاتي</a>
          <a onclick="switchDashboardTab(this,'orders')"><i class="fas fa-clipboard-list"></i> الطلبات</a>
          <a onclick="switchDashboardTab(this,'add')"><i class="fas fa-plus-circle"></i> إضافة منتج</a>
          <a onclick="switchDashboardTab(this,'gallery')"><i class="fas fa-images"></i> إدارة الصور</a>
          <a onclick="switchDashboardTab(this,'settings')"><i class="fas fa-cog"></i> الإعدادات</a>
          <a onclick="merchantLogout()" style="color:var(--danger)"><i class="fas fa-sign-out-alt"></i> تسجيل خروج</a>
        </div>
      </div>
      <div class="dashboard-content" id="dashboard-content">${renderDashboardOverview(m, myProducts)}</div>
    </div>`;
}

async function merchantLogin() {
  const phone = $('login-phone')?.value || '0100111222';
  const pass = $('login-pass')?.value || '123456';
  try {
    const data = await API.login(phone, pass);
    toast('مرحباً ' + data.merchant.name, 'success');
    Store.merchants = await API.getMerchants();
    Store.products = await API.getProducts();
    navigate('dashboard');
  } catch(e) { toast(e.message, 'error'); }
}

function merchantLogout() { API.logout(); toast('تم تسجيل الخروج', 'info'); navigate('home'); }

async function switchDashboardTab(el, tab) {
  $$('.dashboard-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  const m = API.merchant || Store.merchants[0];
  const dc = $('dashboard-content');
  if (tab === 'products' || tab === 'gallery') {
    try { Store.products = await API.getProducts(); } catch(e) {}
  }
  const myProducts = Store.products.filter(p => p.shop_name === m.name);
  switch(tab) {
    case 'overview': dc.innerHTML = renderDashboardOverview(m, myProducts); break;
    case 'products': dc.innerHTML = renderDashboardProducts(myProducts); break;
    case 'orders': dc.innerHTML = renderDashboardOrders(); break;
    case 'add': dc.innerHTML = renderDashboardAddProduct(); break;
    case 'gallery': dc.innerHTML = renderDashboardGallery(myProducts); break;
    case 'settings': dc.innerHTML = renderDashboardSettings(m); break;
  }
}

function renderDashboardOverview(m, products) {
  const totalSales = products.reduce((s, p) => s + (p.sales || 0), 0);
  const stats = Store._dashboardStats || {};
  return `
    <div class="dashboard-stats">
      <div class="stat-card"><div class="stat-card-icon red"><i class="fas fa-box"></i></div><div class="stat-card-info"><h4>${products.length}</h4><p>إجمالي المنتجات</p></div></div>
      <div class="stat-card"><div class="stat-card-icon green"><i class="fas fa-chart-line"></i></div><div class="stat-card-info"><h4>${totalSales.toLocaleString('ar-EG')}</h4><p>إجمالي المبيعات</p></div></div>
      <div class="stat-card"><div class="stat-card-icon blue"><i class="fas fa-star"></i></div><div class="stat-card-info"><h4>${m.rating}</h4><p>التقييم</p></div></div>
      <div class="stat-card"><div class="stat-card-icon orange"><i class="fas fa-money-bill-wave"></i></div><div class="stat-card-info"><h4>${(stats.productsCount*1000||products.length*800).toLocaleString('ar-EG')} ج.م</h4><p>الإيرادات</p></div></div>
    </div>
    <div style="background:var(--white);border-radius:var(--radius-md);padding:20px;border:1px solid var(--gray-200)">
      <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-store"></i> معلومات المتجر</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div><strong>اسم المتجر:</strong> ${m.name}</div>
        <div><strong>رقم الكشك:</strong> ${m.stall}</div>
        <div><strong>القسم:</strong> ${m.section}</div>
        <div><strong>رقم الهاتف:</strong> ${m.phone}</div>
        <div><strong>تاريخ الانضمام:</strong> ${m.joined || 'غير محدد'}</div>
        <div><strong>حالة التوثيق:</strong> ${m.verified ? '<span style="color:var(--success)">موثق <i class="fas fa-check-circle"></i></span>' : '<span style="color:var(--accent)">قيد المراجعة</span>'}</div>
      </div>
    </div>`;
}

function renderDashboardProducts(products) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
      <h4 style="font-weight:700"><i class="fas fa-box"></i> منتجاتي (${products.length})</h4>
      <button class="admin-btn-primary" onclick="switchDashboardTab(document.querySelector('.dashboard-nav a:nth-child(4)'),'add')" style="padding:8px 20px;border-radius:50px;background:var(--primary);color:var(--white);font-weight:600;font-size:13px"><i class="fas fa-plus"></i> إضافة منتج</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${products.map(p => `
        <div class="merchant-product-card">
          <img src="${((p.images||[])[0])||'https://placehold.co/70x70/eee/999?text=منتج'}" alt="${p.name}">
          <div class="product-info">
            <h5>${p.name}</h5>
            <p><i class="fas fa-tag"></i> ${(+p.price).toLocaleString('ar-EG')} ج.م | <i class="fas fa-shopping-bag"></i> ${p.sales} مبيعات</p>
          </div>
          <div class="product-actions">
            <button class="btn-sm-edit" onclick="toast('تعديل المنتج - قيد التطوير','info')"><i class="fas fa-edit"></i> تعديل</button>
            <button class="btn-sm-delete" onclick="deleteMerchantProduct(${p.id})"><i class="fas fa-trash"></i> حذف</button>
          </div>
        </div>
      `).join('')}
    </div>`;
}

async function deleteMerchantProduct(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
  try {
    if (_apiAvailable) await API.deleteProduct(id);
    Store.products = Store.products.filter(p => p.id != id);
    toast('تم حذف المنتج', 'success');
    switchDashboardTab(document.querySelector('.dashboard-nav a:nth-child(2)'), 'products');
  } catch(e) { toast(e.message, 'error'); }
}

async function renderDashboardOrders() {
  let orders = [];
  if (_apiAvailable) { try { orders = await API.getOrders(); } catch(e) {} }
  if (!orders.length) orders = Store.dashboardOrders || [];
  return `
    <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-clipboard-list"></i> الطلبات الواردة</h4>
    <div class="table-container">
      <table>
        <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th></tr></thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><strong>${o.order_no || o.id}</strong></td>
              <td>${o.customer_name}</td>
              <td>${(o.items||[]).length || o.items}</td>
              <td>${(+o.total).toLocaleString('ar-EG')} ج.م</td>
              <td><span class="status-badge ${(o.status||'').replace(/ /g,'-')}">${o.status}</span></td>
              <td>${o.created_at || o.date || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderDashboardAddProduct() {
  return `
    <h4 style="font-weight:700;margin-bottom:20px"><i class="fas fa-plus-circle"></i> إضافة منتج جديد</h4>
    <div style="background:var(--white);border-radius:var(--radius-md);padding:25px;border:1px solid var(--gray-200)">
      <form id="new-product-form" onsubmit="event.preventDefault();submitNewProduct()">
        <div class="form-row">
          <div class="form-group"><label>اسم المنتج *</label><input id="new-name" required placeholder="مثال: فستان سهرة تركي"></div>
          <div class="form-group"><label>السعر (ج.م) *</label><input id="new-price" type="number" required placeholder="مثال: 450"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>السعر القديم (اختياري)</label><input id="new-old-price" type="number" placeholder="مثال: 650"></div>
          <div class="form-group"><label>القسم</label>
            <select id="new-category"><option value="clothes">الملابس</option><option value="electronics">الإلكترونيات</option><option value="footwear">الأحذية</option><option value="household">أدوات المنزل</option></select>
          </div>
        </div>
        <div class="form-group"><label>المنطقة</label>
          <select id="new-subcategory"><option value="attaba">مول العتبة الرئيسي</option><option value="mosky">منطقة الموسكي</option><option value="gumruk">شارع الجمرك</option><option value="abdulaziz">شارع عبد العزيز</option></select>
        </div>
        <div class="form-group"><label>وصف المنتج *</label><textarea id="new-desc" required placeholder="اكتب وصفاً تفصيلياً للمنتج..."></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>الألوان المتاحة</label><input id="new-colors" placeholder="أحمر، أسود، أزرق"></div>
          <div class="form-group"><label>المقاسات المتاحة</label><input id="new-sizes" placeholder="M, L, XL"></div>
        </div>
        <div class="form-group"><label>صور المنتج</label>
          <div class="upload-area" onclick="document.getElementById('file-input').click()">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>اضغط لرفع الصور</p>
            <span class="upload-hint">يمكنك رفع حتى ١٠ صور عالية الدقة</span>
          </div>
          <input id="file-input" type="file" accept="image/*" multiple style="display:none" onchange="previewUploadedImages(event)">
          <div class="upload-preview" id="upload-preview"></div>
        </div>
        <button type="submit" class="btn btn-add-cart" style="width:100%;justify-content:center;margin-top:10px"><i class="fas fa-save"></i> حفظ المنتج</button>
      </form>
    </div>`;
}

function renderDashboardGallery(products) {
  const allImages = products.flatMap(p => (p.images || []).map(img => ({ img, name: p.name })));
  if (!allImages.length) return '<div class="empty-state"><i class="fas fa-images"></i><h3>لا توجد صور</h3><p>أضف منتجات لعرض الصور</p></div>';
  return `
    <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-images"></i> إدارة الصور (${allImages.length})</h4>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px">
      ${allImages.map(x => `
        <div style="position:relative;border-radius:var(--radius-sm);overflow:hidden;aspect-ratio:1">
          <img src="${x.img}" style="width:100%;height:100%;object-fit:cover" alt="">
          <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);padding:8px;display:flex;justify-content:space-between;align-items:center">
            <span style="color:var(--white);font-size:11px">${x.name}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderDashboardSettings(m) {
  return `
    <h4 style="font-weight:700;margin-bottom:20px"><i class="fas fa-cog"></i> إعدادات المتجر</h4>
    <div style="background:var(--white);border-radius:var(--radius-md);padding:25px;border:1px solid var(--gray-200)">
      <form onsubmit="event.preventDefault();toast('تم حفظ الإعدادات','success')">
        <div class="form-row">
          <div class="form-group"><label>اسم المتجر</label><input value="${m.name}"></div>
          <div class="form-group"><label>رقم الكشك</label><input value="${m.stall}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>رقم الهاتف</label><input value="${m.phone}"></div>
          <div class="form-group"><label>البريد الإلكتروني</label><input value="${m.email||'info@attaba.com'}"></div>
        </div>
        <div class="form-group"><label>وصف المتجر</label><textarea>متجر ${m.name} متخصص في بيع ${m.section} في منطقة العتبة. نقدم أفضل المنتجات بأسعار تنافسية.</textarea></div>
        <button type="submit" class="btn btn-add-cart" style="justify-content:center"><i class="fas fa-save"></i> حفظ الإعدادات</button>
      </form>
    </div>`;
}

let _uploadedFiles = [];
function previewUploadedImages(e) {
  const files = Array.from(e.target.files);
  _uploadedFiles = files;
  const container = $('upload-preview');
  container.innerHTML = files.map((f, i) =>
    `<div class="upload-preview-item"><img src="${URL.createObjectURL(f)}" alt=""><button class="remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button></div>`
  ).join('');
}

async function submitNewProduct() {
  const name = $('new-name')?.value;
  const price = $('new-price')?.value;
  if (!name || !price) { toast('يرجى ملء الحقول المطلوبة', 'error'); return; }
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('original_price', $('new-old-price')?.value || '');
  formData.append('description', $('new-desc')?.value || '');
  formData.append('category', $('new-category')?.value || 'clothes');
  formData.append('sub_category', $('new-subcategory')?.value || 'attaba');
  formData.append('colors', $('new-colors')?.value || '');
  formData.append('sizes', $('new-sizes')?.value || '');
  for (const f of _uploadedFiles) formData.append('images', f);
  try {
    if (_apiAvailable && API.token) {
      await API.createProduct(formData);
      Store.products = await API.getProducts();
    } else {
      toast('الخادم غير متصل. تمت الإضافة محلياً', 'info');
      Store.products.push({
        id: Date.now(), name, price: +price, description: $('new-desc')?.value || '',
        category: $('new-category')?.value, sub_category: $('new-subcategory')?.value,
        shop_name: API.merchant?.name || 'متجري', colors: ($('new-colors')?.value||'').split(',').map(c=>c.trim()),
        sizes: ($('new-sizes')?.value||'').split(',').map(s=>s.trim()), images: [],
        rating: 0, sales: 0, featured: 0, stall: API.merchant?.stall || ''
      });
    }
    toast('تم إضافة المنتج بنجاح!', 'success');
    $('new-product-form')?.reset();
    $('upload-preview').innerHTML = '';
    _uploadedFiles = [];
  } catch(e) { toast(e.message, 'error'); }
}

// ===== ADMIN =====
async function renderAdmin(target) {
  if (!API.token || API.token === 'null') {
    target.innerHTML = `
      <div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>لوحة الإدارة</span></div>
      <div class="empty-state" style="margin-top:20px"><i class="fas fa-lock"></i><h3>دخول الإدارة</h3><p>يرجى تسجيل الدخول كمسؤول</p>
      <div style="margin-top:15px"><input id="admin-user" placeholder="اسم المستخدم" value="admin" style="padding:10px 15px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);margin-left:10px"><input id="admin-pass" type="password" placeholder="كلمة المرور" value="admin123" style="padding:10px 15px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);margin-left:10px">
      <button onclick="adminLogin()" style="padding:10px 25px;border-radius:50px;background:var(--primary);color:var(--white);font-weight:700">دخول</button></div></div>`;
    return;
  }
  let stats = Store.adminStats || {};
  let merchants = Store.adminMerchants || [];
  if (_apiAvailable) {
    try { stats = await API.getAdminStats(); merchants = await API.getMerchants(); } catch(e) {}
  }
  target.innerHTML = `
    <div class="breadcrumb"><a onclick="navigate('home')"><i class="fas fa-home"></i> الرئيسية</a><span class="separator"><i class="fas fa-chevron-left"></i></span><span>لوحة الإدارة</span></div>
    <div class="admin-header">
      <h2><i class="fas fa-cogs"></i> لوحة التحكم الإدارية</h2>
      <div class="admin-actions">
        <button class="admin-btn-primary" onclick="switchAdminTab('merchants')"><i class="fas fa-users"></i> إدارة التجار</button>
        <button class="admin-btn-outline" onclick="switchAdminTab('categories')"><i class="fas fa-th-large"></i> الأقسام</button>
        <button class="admin-btn-outline" onclick="switchAdminTab('reports')"><i class="fas fa-flag"></i> التقارير</button>
        <button class="admin-btn-outline" onclick="adminLogout()" style="color:var(--danger)"><i class="fas fa-sign-out-alt"></i> خروج</button>
      </div>
    </div>
    <div class="dashboard-stats">
      <div class="stat-card"><div class="stat-card-icon red"><i class="fas fa-store"></i></div><div class="stat-card-info"><h4>${stats.totalMerchants||0}</h4><p>إجمالي التجار</p></div></div>
      <div class="stat-card"><div class="stat-card-icon blue"><i class="fas fa-box"></i></div><div class="stat-card-info"><h4>${stats.totalProducts||0}</h4><p>منتج نشط</p></div></div>
      <div class="stat-card"><div class="stat-card-icon green"><i class="fas fa-shopping-cart"></i></div><div class="stat-card-info"><h4>${(stats.totalOrders||0).toLocaleString('ar-EG')}</h4><p>إجمالي الطلبات</p></div></div>
      <div class="stat-card"><div class="stat-card-icon orange"><i class="fas fa-exclamation-triangle"></i></div><div class="stat-card-info"><h4>${stats.pendingVerifications||0}</h4><p>توثيق معلق</p></div></div>
    </div>
    <div id="admin-content">${renderAdminMerchants(merchants)}</div>`;
}

async function adminLogin() {
  try {
    await API.adminLogin($('admin-user')?.value || 'admin', $('admin-pass')?.value || 'admin123');
    toast('مرحباً بك في لوحة الإدارة', 'success');
    navigate('admin');
  } catch(e) { toast(e.message, 'error'); }
}

function adminLogout() { API.logout(); toast('تم تسجيل الخروج', 'info'); navigate('home'); }

async function switchAdminTab(tab) {
  const ac = $('admin-content');
  switch(tab) {
    case 'merchants':
      let merchants = [];
      if (_apiAvailable) try { merchants = await API.getMerchants(); } catch(e) {}
      ac.innerHTML = renderAdminMerchants(merchants); break;
    case 'categories': ac.innerHTML = renderAdminCategories(); break;
    case 'reports': ac.innerHTML = renderAdminReports(); break;
  }
}

function renderAdminMerchants(merchants) {
  if (!merchants.length) merchants = Store.adminMerchants || [];
  return `
    <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-users"></i> إدارة التجار (${merchants.length})</h4>
    <div class="table-container">
      <table>
        <thead><tr><th>#</th><th>التاجر</th><th>المالك</th><th>الهاتف</th><th>المنتجات</th><th>الإيرادات</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${merchants.map((m, i) => `
            <tr>
              <td>${m.id}</td>
              <td><strong>${m.name}</strong></td>
              <td>${m.owner||''}</td>
              <td>${m.phone}</td>
              <td>${m.products_count||m.products||0}</td>
              <td>${(+m.revenue||0).toLocaleString('ar-EG')} ج.م</td>
              <td><span class="status-badge ${m.status === 'نشط' ? 'active' : m.status === 'معلق' ? 'pending' : 'rejected'}">${m.status||'غير محدد'}</span></td>
              <td>
                <div style="display:flex;gap:5px">
                  <button class="admin-btn-primary" style="padding:4px 12px;font-size:12px" onclick="adminVerifyMerchant(${m.id})"><i class="fas fa-check"></i></button>
                  <button class="admin-btn-outline" style="padding:4px 12px;font-size:12px" onclick="toast('فتح التفاصيل','info')"><i class="fas fa-eye"></i></button>
                  <button style="padding:4px 12px;border-radius:50px;font-size:12px;background:rgba(231,76,60,0.1);color:var(--danger);font-weight:600" onclick="adminToggleMerchant(${m.id})"><i class="fas fa-ban"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function adminVerifyMerchant(id) {
  try { await API.verifyMerchant(id); toast('تم توثيق التاجر', 'success'); switchAdminTab('merchants'); }
  catch(e) { toast(e.message, 'error'); }
}

async function adminToggleMerchant(id) {
  try { await API.updateMerchantStatus(id, 'محظور'); toast('تم حظر التاجر', 'info'); switchAdminTab('merchants'); }
  catch(e) { toast(e.message, 'error'); }
}

function renderAdminCategories() {
  return `
    <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-th-large"></i> إدارة الأقسام</h4>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px">
      ${Store.categories.map(c => `
        <div style="background:var(--white);border-radius:var(--radius-md);padding:20px;border:1px solid var(--gray-200)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <i class="fas ${c.icon}" style="color:${c.color};font-size:24px"></i>
            <div><h5 style="font-weight:700;font-size:16px">${c.name}</h5><p style="font-size:12px;color:var(--gray-600)">${c.count} تاجر</p></div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
            ${(c.subcategories||[]).map(s => `<span style="background:var(--gray-100);padding:4px 10px;border-radius:50px;font-size:12px">${s.name}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderAdminReports() {
  return `
    <h4 style="font-weight:700;margin-bottom:15px"><i class="fas fa-flag"></i> التقارير والبلاغات</h4>
    <div style="background:var(--white);border-radius:var(--radius-md);padding:25px;border:1px solid var(--gray-200)">
      <p style="color:var(--gray-600);text-align:center;padding:30px"><i class="fas fa-check-circle" style="font-size:40px;color:var(--success);display:block;margin-bottom:10px"></i> جميع البلاغات تمت معالجتها. لا توجد بلاغات جديدة.</p>
    </div>`;
}

// ===== SEARCH =====
function handleSearch(e) {
  if (e && e.key && e.key !== 'Enter') return;
  const q = ($('search-input')?.value || '').trim();
  if (!q) return;
  const results = Store.products.filter(p => (p.name||'').includes(q) || (p.description||'').includes(q) || (p.shop_name||'').includes(q));
  if (results.length) {
    navigate('category', { id: results[0].category });
    toast(`تم العثور على ${results.length} نتيجة`, 'info');
  } else {
    toast('لا توجد نتائج للبحث', 'error');
  }
}

// ===== MOBILE =====
function toggleMobileMenu() { $('mobile-sidebar-overlay').classList.toggle('open'); $('mobile-sidebar').classList.toggle('open'); document.body.style.overflow = $('mobile-sidebar').classList.contains('open') ? 'hidden' : ''; }
function closeMobileMenu() { $('mobile-sidebar-overlay').classList.remove('open'); $('mobile-sidebar').classList.remove('open'); document.body.style.overflow = ''; }
function toggleSidebarDropdown(el) { el.parentElement.classList.toggle('open'); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  setTimeout(() => $('loading-screen').classList.add('hidden'), 600);
  updateCartBadge();
  window.addEventListener('scroll', () => { $('back-to-top').classList.toggle('visible', window.scrollY > 300); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeLightbox(); closeMobileMenu(); } });
  await loadApiData();
});
