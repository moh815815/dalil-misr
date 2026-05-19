// ============================================================
// دليل مصر - Main Application Logic (Refactored)
// ============================================================

const App = {
  state: {
    view: KEYS.VIEWS.GOVERNORATES,
    currentGov: null,
    currentDistrict: null,
    currentStreet: null,
    searchQuery: '',
    categoryFilter: '',
    sortBy: 'default'
  },

  init() {
    this.enhanceData();
    this.render();
    this.bindEvents();
    this.updateStats();
  },

  enhanceData() {
    const customShops = Store.get('custom_shops', []);
    const deletedIds = Store.get('deleted_ids', []);
    const categories = new Set();

    const deletedSet = new Set(deletedIds);

    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          s.shops = s.shops.filter(sh => !deletedSet.has(sh.id));
          const customForStreet = customShops.filter(sh => sh.streetId === s.id);
          customForStreet.forEach(sh => {
            if (!s.shops.find(ex => ex.id === sh.id)) {
              s.shops.push(sh);
            }
          });
          s.shops.forEach(sh => categories.add(sh.activity));
        });
      });
    });

    this._categories = [...categories].sort();
  },

  getCategories() {
    if (!this._categories) {
      const cats = new Set();
      EGYPT_DATA.governorates.forEach(g =>
        g.districts.forEach(d =>
          d.streets.forEach(s =>
            s.shops.forEach(sh => cats.add(sh.activity)))));
      this._categories = [...cats].sort();
    }
    return this._categories;
  },

  updateStats() {
    let totalShops = 0, totalStreets = 0;
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          totalStreets++;
          totalShops += s.shops.length;
        });
      });
    });
    const setNum = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setNum('stat-govs', EGYPT_DATA.governorates.length);
    setNum('stat-shops', totalShops);
    setNum('stat-streets', totalStreets);
  },

  // -- Render --
  render() {
    const area = document.getElementById('content-area');
    if (!area) return;
    area.innerHTML = '';
    this.renderBreadcrumb();

    if (this.state.searchQuery) {
      this.renderSearchResults(area);
      return;
    }

    switch (this.state.view) {
      case KEYS.VIEWS.GOVERNORATES:
        this.renderGovernorates(area);
        break;
      case KEYS.VIEWS.DISTRICTS:
        this.renderDistricts(area);
        break;
      case KEYS.VIEWS.STREETS:
        this.renderStreets(area);
        break;
      case KEYS.VIEWS.SHOPS:
        this.renderShops(area);
        break;
      default:
        this.renderGovernorates(area);
    }
  },

  renderGovernorates(container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'قائمة المحافظات');
    container.innerHTML = `
      <h2 class="section-title">تصفح المحافظات</h2>
      <p class="section-desc">اختر محافظة لتصفح الأنشطة التجارية والمحلات فيها</p>
      <div class="grid grid-4 stagger" id="gov-grid" role="list"></div>
    `;
    const grid = document.getElementById('gov-grid');
    EGYPT_DATA.governorates.forEach(g => {
      const totalShops = g.districts.reduce((sum, d) =>
        sum + d.streets.reduce((s2, st) => s2 + st.shops.length, 0), 0);
      const totalStreets = g.districts.reduce((sum, d) => sum + d.streets.length, 0);
      const card = document.createElement('div');
      card.className = 'card gov-card fade-in';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${g.name}: ${g.districts.length} أحياء، ${totalStreets} شارع، ${totalShops} محل`);
      card.innerHTML = `
        <div class="gov-icon" aria-hidden="true">🏛️</div>
        <div class="gov-name">${UI.escapeHtml(g.name)}</div>
        <div class="gov-count">${g.districts.length} أحياء · ${totalStreets} شارع · ${totalShops} محل</div>
      `;
      card.addEventListener('click', () => this.navigateTo(KEYS.VIEWS.DISTRICTS, g.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateTo(KEYS.VIEWS.DISTRICTS, g.id);
        }
      });
      grid.appendChild(card);
    });
  },

  renderDistricts(container) {
    const gov = this.findGov(this.state.currentGov);
    if (!gov) { this.state.view = KEYS.VIEWS.GOVERNORATES; this.render(); return; }
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', `أحياء ${gov.name}`);
    container.innerHTML = `
      <button class="back-btn" id="back-btn" aria-label="العودة إلى المحافظات">← العودة إلى المحافظات</button>
      <h2 class="section-title">أحياء ${UI.escapeHtml(gov.name)}</h2>
      <p class="section-desc">اختر الحي لعرض الشوارع الرئيسية</p>
      <div class="grid grid-3 stagger" id="district-grid" role="list"></div>
    `;
    document.getElementById('back-btn').addEventListener('click', () => {
      this.state.view = KEYS.VIEWS.GOVERNORATES;
      this.state.currentGov = null;
      this.render();
    });
    const grid = document.getElementById('district-grid');
    gov.districts.forEach(d => {
      const totalShops = d.streets.reduce((s, st) => s + st.shops.length, 0);
      const card = document.createElement('div');
      card.className = 'card loc-card fade-in';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${d.name}: ${d.streets.length} شوارع، ${totalShops} محل`);
      card.innerHTML = `
        <div class="loc-icon" aria-hidden="true">📍</div>
        <div class="loc-info">
          <div class="loc-name">${UI.escapeHtml(d.name)}</div>
          <div class="loc-count">${d.streets.length} شوارع · ${totalShops} محل</div>
        </div>
        <div class="loc-arrow" aria-hidden="true">←</div>
      `;
      card.addEventListener('click', () => this.navigateTo(KEYS.VIEWS.STREETS, gov.id, d.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateTo(KEYS.VIEWS.STREETS, gov.id, d.id);
        }
      });
      grid.appendChild(card);
    });
  },

  renderStreets(container) {
    const gov = this.findGov(this.state.currentGov);
    const district = gov && this.findDistrict(gov, this.state.currentDistrict);
    if (!district) { this.state.view = KEYS.VIEWS.GOVERNORATES; this.render(); return; }
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', `شوارع ${district.name}`);
    container.innerHTML = `
      <button class="back-btn" id="back-btn" aria-label="العودة إلى أحياء ${gov.name}">← العودة إلى أحياء ${UI.escapeHtml(gov.name)}</button>
      <h2 class="section-title">شوارع ${UI.escapeHtml(district.name)}</h2>
      <p class="section-desc">اختر الشارع لعرض المحلات التجارية</p>
      <div class="grid grid-3 stagger" id="street-grid" role="list"></div>
    `;
    document.getElementById('back-btn').addEventListener('click', () => {
      this.state.view = KEYS.VIEWS.DISTRICTS;
      this.render();
    });
    const grid = document.getElementById('street-grid');
    district.streets.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card loc-card fade-in';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${s.name}: ${s.shops.length} محلات`);
      card.innerHTML = `
        <div class="loc-icon" aria-hidden="true">🛣️</div>
        <div class="loc-info">
          <div class="loc-name">${UI.escapeHtml(s.name)}</div>
          <div class="loc-count">${s.shops.length} محلات</div>
        </div>
        <div class="loc-arrow" aria-hidden="true">←</div>
      `;
      card.addEventListener('click', () => this.navigateTo(KEYS.VIEWS.SHOPS, gov.id, district.id, s.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateTo(KEYS.VIEWS.SHOPS, gov.id, district.id, s.id);
        }
      });
      grid.appendChild(card);
    });
  },

  renderShops(container) {
    const gov = this.findGov(this.state.currentGov);
    const district = gov && this.findDistrict(gov, this.state.currentDistrict);
    const street = district && this.findStreet(district, this.state.currentStreet);
    if (!street) { this.state.view = KEYS.VIEWS.GOVERNORATES; this.render(); return; }

    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', `محلات ${street.name}`);
    container.innerHTML = `
      <button class="back-btn" id="back-btn" aria-label="العودة إلى شوارع ${district.name}">← العودة إلى شوارع ${UI.escapeHtml(district.name)}</button>
      <h2 class="section-title">محلات ${UI.escapeHtml(street.name)}</h2>
      <p class="section-desc">${street.shops.length} محل تجاري في ${UI.escapeHtml(district.name)}، ${UI.escapeHtml(gov.name)}</p>
      <div class="sort-bar">
        <label for="shop-sort">ترتيب:</label>
        <select class="sort-select" id="shop-sort">
          <option value="default">الافتراضي</option>
          <option value="rating">التقييم</option>
          <option value="name">الاسم</option>
        </select>
      </div>
      <div class="grid grid-2 stagger" id="shop-grid" role="list"></div>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
      this.state.view = KEYS.VIEWS.STREETS;
      this.render();
    });

    const sortSelect = document.getElementById('shop-sort');
    if (sortSelect) {
      sortSelect.value = this.state.sortBy;
      sortSelect.addEventListener('change', () => {
        this.state.sortBy = sortSelect.value;
        this.renderShopsInto(container, street);
      });
    }

    this.renderShopsInto(container, street);
  },

  renderShopsInto(container, street) {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = '';
    let shops = [...street.shops];

    switch (this.state.sortBy) {
      case 'rating':
        shops.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        shops.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
    }

    shops.forEach(shop => {
      grid.appendChild(this.createShopCard(shop));
    });
  },

  createShopCard(shop) {
    const card = document.createElement('div');
    card.className = 'card shop-card fade-in';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${shop.name}، ${shop.activity}، تقييم ${shop.rating}`);

    const stars = this.renderStars(shop.rating);
    const safeAddress = UI.escapeHtml(shop.address);
    const safeName = UI.escapeHtml(shop.name);
    const safeActivity = UI.escapeHtml(shop.activity);

    card.innerHTML = `
      <div class="shop-header">
        <div>
          <span class="shop-activity">${safeActivity}</span>
          <div class="shop-name">${safeName}</div>
        </div>
        <div class="shop-rating" aria-label="التقييم: ${shop.rating} من 5">
          ${stars}
          <span class="num">(${shop.rating})</span>
        </div>
      </div>
      <div class="shop-details">
        <div class="shop-detail" aria-label="العنوان"><span class="icon" aria-hidden="true">📍</span> ${safeAddress}</div>
        <div class="shop-detail" aria-label="رقم الهاتف"><span class="icon" aria-hidden="true">📞</span> ${UI.escapeHtml(shop.phone)}</div>
      </div>
      <div class="shop-actions">
        <a class="btn btn-call" href="tel:${shop.phone}" aria-label="اتصال بـ ${safeName}">
          📞 اتصال
        </a>
        <a class="btn btn-whatsapp" href="https://wa.me/${shop.whatsapp}" target="_blank" rel="noopener" aria-label="واتساب ${safeName}">
          💬 واتساب
        </a>
        <a class="btn btn-location" href="${shop.locationLink}" target="_blank" rel="noopener" aria-label="موقع ${safeName} على الخريطة">
          🗺️ الموقع
        </a>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      this.showShopDetail(shop);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.showShopDetail(shop);
      }
    });

    return card;
  },

  showShopDetail(shop) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    document.getElementById('modal-title').textContent = shop.name;
    const body = document.getElementById('modal-body');
    const stars = this.renderStars(shop.rating);
    body.innerHTML = `
      <div class="shop-detail-card">
        <div class="detail-row"><span class="detail-icon">🏪</span> <strong>${UI.escapeHtml(shop.name)}</strong></div>
        <div class="detail-row"><span class="detail-icon">📋</span> ${UI.escapeHtml(shop.activity)}</div>
        <div class="detail-row"><span class="detail-icon">📍</span> ${UI.escapeHtml(shop.address)}</div>
        <div class="detail-row"><span class="detail-icon">📞</span> ${UI.escapeHtml(shop.phone)}</div>
        <div class="detail-row"><span class="detail-icon">⭐</span> ${stars} <span style="margin-right:4px">(${shop.rating})</span></div>
        <div class="detail-row" style="gap:8px;flex-wrap:wrap;border-bottom:none;padding-top:12px;">
          <a class="btn btn-call" href="tel:${shop.phone}" style="flex:1">📞 اتصال</a>
          <a class="btn btn-whatsapp" href="https://wa.me/${shop.whatsapp}" target="_blank" rel="noopener" style="flex:1">💬 واتساب</a>
          <a class="btn btn-location" href="${shop.locationLink}" target="_blank" rel="noopener" style="flex:1">🗺️ الموقع</a>
        </div>
      </div>
    `;
    overlay.classList.add('active');
    document.getElementById('modal-close').focus();
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) stars += '<span class="star" aria-hidden="true">★</span>';
      else if (i === full && hasHalf) stars += '<span class="star" aria-hidden="true">★</span>';
      else stars += '<span class="star empty" aria-hidden="true">★</span>';
    }
    return `<span class="stars" role="img" aria-label="${rating} من 5">${stars}</span>`;
  },

  // -- Search --
  renderSearchResults(container) {
    const q = this.state.searchQuery.trim().toLowerCase();
    const results = this.searchAll(q);
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'نتائج البحث');
    container.innerHTML = `
      <div class="search-page">
        <button class="back-btn" id="search-back" aria-label="العودة للرئيسية">← العودة للرئيسية</button>
        <div class="search-title">
          نتائج البحث عن: <span>"${UI.escapeHtml(this.state.searchQuery)}"</span>
          <span class="text-muted" style="font-weight:400;font-size:16px"> (${results.length} نتيجة)</span>
        </div>
        ${results.length === 0 ? `
          <div class="no-results" role="status">
            <div class="icon" aria-hidden="true">🔍</div>
            <h3>لا توجد نتائج</h3>
            <p>لم نجد أي محلات تطابق بحثك. حاول بكلمات أخرى.</p>
          </div>
        ` : `
          <div class="grid grid-2 stagger" id="search-grid" role="list"></div>
        `}
      </div>
    `;

    document.getElementById('search-back').addEventListener('click', () => {
      this.state.searchQuery = '';
      const inp = document.getElementById('search-input');
      if (inp) inp.value = '';
      this.state.view = KEYS.VIEWS.GOVERNORATES;
      this.render();
    });

    if (results.length) {
      const grid = document.getElementById('search-grid');
      results.forEach(r => grid.appendChild(this.createShopCard(r.shop)));
    }
  },

  searchAll(q) {
    if (!q) return [];
    const results = [];
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          s.shops.forEach(shop => {
            const match =
              shop.name.toLowerCase().includes(q) ||
              shop.activity.toLowerCase().includes(q) ||
              shop.address.toLowerCase().includes(q) ||
              g.name.toLowerCase().includes(q) ||
              d.name.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q);
            if (match) {
              results.push({ shop, governorate: g.name, district: d.name, street: s.name });
            }
          });
        });
      });
    });
    return results;
  },

  // -- Navigation --
  navigateTo(view, govId, districtId, streetId) {
    this.state.view = view;
    if (govId) this.state.currentGov = govId;
    if (districtId) this.state.currentDistrict = districtId;
    if (streetId) this.state.currentStreet = streetId;
    if (view === KEYS.VIEWS.GOVERNORATES) {
      this.state.searchQuery = '';
      const inp = document.getElementById('search-input');
      if (inp) inp.value = '';
    }
    this.state.sortBy = 'default';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // -- Breadcrumb --
  renderBreadcrumb() {
    const bc = document.getElementById('breadcrumb');
    if (!bc) return;
    let html = '<a onclick="App.navigateTo(\'governorates\')" aria-label="الرئيسية">🏠 الرئيسية</a>';
    const gov = this.state.currentGov ? this.findGov(this.state.currentGov) : null;
    const district = gov && this.state.currentDistrict ? this.findDistrict(gov, this.state.currentDistrict) : null;
    const street = district && this.state.currentStreet ? this.findStreet(district, this.state.currentStreet) : null;

    if (this.state.searchQuery && !gov) {
      html += ` <span class="sep" aria-hidden="true">›</span> <span>بحث: ${UI.escapeHtml(this.state.searchQuery)}</span>`;
    } else {
      if (gov) {
        html += ` <span class="sep" aria-hidden="true">›</span> <a onclick="App.navigateTo('districts', ${gov.id})">${UI.escapeHtml(gov.name)}</a>`;
        if (district) {
          html += ` <span class="sep" aria-hidden="true">›</span> <a onclick="App.navigateTo('streets', ${gov.id}, ${district.id})">${UI.escapeHtml(district.name)}</a>`;
          if (street) {
            html += ` <span class="sep" aria-hidden="true">›</span> <span>${UI.escapeHtml(street.name)}</span>`;
          }
        }
      }
    }
    bc.innerHTML = html;
  },

  // -- Events --
  bindEvents() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const doSearch = () => {
      const val = searchInput.value.trim();
      if (!val) return;
      this.state.searchQuery = val;
      this.state.view = KEYS.VIEWS.GOVERNORATES;
      this.state.currentGov = null;
      this.state.currentDistrict = null;
      this.state.currentStreet = null;
      this.render();
      searchInput.blur();
    };

    searchBtn.addEventListener('click', doSearch);

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('modal-overlay');
        if (overlay && overlay.classList.contains('active')) {
          overlay.classList.remove('active');
        }
      }
    });

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    }

    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const o = document.getElementById('modal-overlay');
        if (o) o.classList.remove('active');
      });
    }
  },

  // -- Helpers --
  findGov(id) {
    return EGYPT_DATA.governorates.find(g => g.id === id) || null;
  },

  findDistrict(gov, id) {
    return gov.districts.find(d => d.id === id) || null;
  },

  findStreet(district, id) {
    return district.streets.find(s => s.id === id) || null;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
