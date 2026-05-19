// ============================================================
// دليل مصر - Admin Dashboard Logic (Refactored)
// ============================================================

const Admin = {
  currentTab: 'shops',

  init() {
    this.enhanceData();
    this.bindTabs();
    this.renderTab('shops');
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeModal();
      });
    }
  },

  enhanceData() {
    const customShops = Store.get('custom_shops', []);
    const deletedIds = Store.get('deleted_ids', []);
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
        });
      });
    });
  },

  // -- Tabs --
  bindTabs() {
    document.querySelectorAll('.admin-nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const tab = el.dataset.tab;
        this.currentTab = tab;
        document.querySelectorAll('.admin-nav-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        this.renderTab(tab);
      });
    });
  },

  renderTab(tab) {
    this.currentTab = tab;
    const container = document.getElementById('admin-content');
    if (!container) return;
    switch (tab) {
      case 'shops': this.renderShops(container); break;
      case 'governorates': this.renderGovernorates(container); break;
      case 'districts': this.renderDistricts(container); break;
      case 'streets': this.renderStreets(container); break;
      case 'pending': this.renderPending(container); break;
    }
  },

  // -- SHOPS TAB --
  renderShops(container) {
    let html = `
      <div class="admin-header">
        <h2 class="admin-title">إدارة المحلات التجارية</h2>
        <div class="admin-header-actions">
          <button class="btn btn-primary" id="add-shop-btn">+ إضافة محل جديد</button>
        </div>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" role="table" aria-label="المحلات التجارية">
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المحل</th>
              <th>النشاط</th>
              <th>الشارع</th>
              <th>الحي</th>
              <th>المحافظة</th>
              <th>التقييم</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody id="admin-shops-tbody"></tbody>
        </table>
      </div>
    `;
    container.innerHTML = html;

    document.getElementById('add-shop-btn').addEventListener('click', () => this.showShopForm());

    const tbody = document.getElementById('admin-shops-tbody');
    let idx = 1;
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          s.shops.forEach(sh => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx++}</td>
              <td><strong>${UI.escapeHtml(sh.name)}</strong></td>
              <td><span class="admin-badge approved">${UI.escapeHtml(sh.activity)}</span></td>
              <td>${UI.escapeHtml(s.name)}</td>
              <td>${UI.escapeHtml(d.name)}</td>
              <td>${UI.escapeHtml(g.name)}</td>
              <td>${sh.rating} ★</td>
              <td class="actions">
                <button class="btn btn-sm btn-outline edit-shop" data-id="${sh.id}" data-street="${s.id}" data-dist="${d.id}" data-gov="${g.id}" aria-label="تعديل ${sh.name}">✏️</button>
                <button class="btn btn-sm btn-danger delete-shop" data-id="${sh.id}" data-name="${UI.escapeHtml(sh.name)}" aria-label="حذف ${sh.name}">🗑️</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        });
      });
    });

    tbody.addEventListener('click', e => {
      const editBtn = e.target.closest('.edit-shop');
      const delBtn = e.target.closest('.delete-shop');
      if (editBtn) {
        this.editShop(
          parseInt(editBtn.dataset.id),
          parseInt(editBtn.dataset.street),
          parseInt(editBtn.dataset.dist),
          parseInt(editBtn.dataset.gov)
        );
      }
      if (delBtn) {
        this.deleteShop(parseInt(delBtn.dataset.id), delBtn.dataset.name);
      }
    });
  },

  deleteShop(id, name) {
    if (!UI.confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    const deleted = Store.get('deleted_ids', []);
    deleted.push(id);
    Store.set('deleted_ids', deleted);
    UI.toast(`تم حذف "${name}" بنجاح`);
    this.renderTab(this.currentTab);
  },

  // -- SHOP FORM --
  showShopForm(data) {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    title.textContent = data ? 'تعديل محل' : 'إضافة محل جديد';

    const govOpts = EGYPT_DATA.governorates.map(g =>
      `<option value="${g.id}" ${data && data.govId === g.id ? 'selected' : ''}>${UI.escapeHtml(g.name)}</option>`).join('');

    let distOpts = '<option value="">اختر الحي أولاً</option>';
    if (data && data.govId) {
      const gov = EGYPT_DATA.governorates.find(g => g.id === data.govId);
      if (gov) {
        distOpts = gov.districts.map(d =>
          `<option value="${d.id}" ${data && data.distId === d.id ? 'selected' : ''}>${UI.escapeHtml(d.name)}</option>`).join('');
      }
    }

    let strOpts = '<option value="">اختر الشارع أولاً</option>';
    if (data && data.govId && data.distId) {
      const gov = EGYPT_DATA.governorates.find(g => g.id === data.govId);
      if (gov) {
        const dist = gov.districts.find(d => d.id === data.distId);
        if (dist) {
          strOpts = dist.streets.map(s =>
            `<option value="${s.id}" ${data && data.streetId === s.id ? 'selected' : ''}>${UI.escapeHtml(s.name)}</option>`).join('');
        }
      }
    }

    const isEdit = !!data;
    body.innerHTML = `
      <form id="shop-form" class="admin-form" style="max-width:100%;box-shadow:none;padding:0" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-gov">المحافظة</label>
            <select class="form-select" id="f-gov" required>
              <option value="">اختر المحافظة</option>
              ${govOpts}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="f-dist">الحي</label>
            <select class="form-select" id="f-dist" required>
              ${distOpts}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-street">الشارع</label>
          <select class="form-select" id="f-street" required>
            ${strOpts}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-name">اسم المحل</label>
            <input class="form-input" id="f-name" value="${data ? UI.escapeHtml(data.name) : ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="f-activity">النشاط</label>
            <input class="form-input" id="f-activity" value="${data ? UI.escapeHtml(data.activity) : ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-address">العنوان</label>
          <input class="form-input" id="f-address" value="${data ? UI.escapeHtml(data.address) : ''}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-phone">رقم الهاتف</label>
            <input class="form-input" id="f-phone" value="${data ? UI.escapeHtml(data.phone) : ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="f-whatsapp">واتساب (بدون +)</label>
            <input class="form-input" id="f-whatsapp" value="${data ? UI.escapeHtml(data.whatsapp) : ''}" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-location">رابط الموقع (Google Maps)</label>
            <input class="form-input" id="f-location" value="${data ? UI.escapeHtml(data.locationLink) : ''}">
          </div>
          <div class="form-group">
            <label class="form-label" for="f-rating">التقييم (0-5)</label>
            <input class="form-input" type="number" min="0" max="5" step="0.1" id="f-rating" value="${data ? data.rating : '4.0'}">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ التعديلات' : 'إضافة المحل'}</button>
          <button type="button" class="btn btn-outline" onclick="Admin.closeModal()">إلغاء</button>
        </div>
      </form>
    `;

    const govSel = document.getElementById('f-gov');
    const distSel = document.getElementById('f-dist');
    const strSel = document.getElementById('f-street');

    govSel.addEventListener('change', () => this.loadDistricts());
    distSel.addEventListener('change', () => this.loadStreets());

    document.getElementById('shop-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (data) this.saveShopEdit(data);
      else this.saveNewShop();
    });

    overlay.classList.add('active');
    document.getElementById('f-name').focus();
  },

  loadDistricts() {
    const govId = parseInt(document.getElementById('f-gov').value);
    const distSel = document.getElementById('f-dist');
    const strSel = document.getElementById('f-street');
    distSel.innerHTML = '<option value="">اختر الحي</option>';
    strSel.innerHTML = '<option value="">اختر الشارع أولاً</option>';
    if (!govId) return;
    const gov = EGYPT_DATA.governorates.find(g => g.id === govId);
    if (gov) {
      gov.districts.forEach(d => {
        distSel.innerHTML += `<option value="${d.id}">${UI.escapeHtml(d.name)}</option>`;
      });
    }
  },

  loadStreets() {
    const govId = parseInt(document.getElementById('f-gov').value);
    const distId = parseInt(document.getElementById('f-dist').value);
    const strSel = document.getElementById('f-street');
    strSel.innerHTML = '<option value="">اختر الشارع</option>';
    if (!govId || !distId) return;
    const gov = EGYPT_DATA.governorates.find(g => g.id === govId);
    if (gov) {
      const dist = gov.districts.find(d => d.id === distId);
      if (dist) {
        dist.streets.forEach(s => {
          strSel.innerHTML += `<option value="${s.id}">${UI.escapeHtml(s.name)}</option>`;
        });
      }
    }
  },

  saveNewShop() {
    const govId = parseInt(document.getElementById('f-gov').value);
    const distId = parseInt(document.getElementById('f-dist').value);
    const streetId = parseInt(document.getElementById('f-street').value);
    const name = document.getElementById('f-name').value.trim();
    const activity = document.getElementById('f-activity').value.trim();
    const address = document.getElementById('f-address').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const whatsapp = document.getElementById('f-whatsapp').value.trim();
    const locationLink = document.getElementById('f-location').value.trim();
    const rating = parseFloat(document.getElementById('f-rating').value) || 4.0;

    if (!name || !activity || !address || !phone || !whatsapp || !streetId) {
      UI.toast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    if (!/^\d+$/.test(phone)) {
      UI.toast('رقم الهاتف يجب أن يكون أرقاماً فقط', 'error');
      return;
    }

    if (!/^\d+$/.test(whatsapp)) {
      UI.toast('رقم واتساب يجب أن يكون أرقاماً فقط', 'error');
      return;
    }

    const customShops = Store.get('custom_shops', []);
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    customShops.push({ id: newId, name, activity, address, phone, whatsapp, locationLink, rating, streetId });
    Store.set('custom_shops', customShops);
    this.closeModal();
    UI.toast(`تم إضافة "${name}" بنجاح`);
    this.renderTab(this.currentTab);
  },

  editShop(id, streetId, distId, govId) {
    let shop = null;
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          const found = s.shops.find(sh => sh.id === id);
          if (found) shop = { ...found, govId: g.id, distId: d.id, streetId: s.id };
        });
      });
    });
    if (shop) this.showShopForm(shop);
  },

  saveShopEdit(data) {
    const name = document.getElementById('f-name').value.trim();
    const activity = document.getElementById('f-activity').value.trim();
    const address = document.getElementById('f-address').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const whatsapp = document.getElementById('f-whatsapp').value.trim();
    const locationLink = document.getElementById('f-location').value.trim();
    const rating = parseFloat(document.getElementById('f-rating').value) || 4.0;

    const customShops = Store.get('custom_shops', []);
    const existing = customShops.find(s => s.id === data.id);
    if (existing) {
      Object.assign(existing, { name, activity, address, phone, whatsapp, locationLink, rating });
      Store.set('custom_shops', customShops);
      this.closeModal();
      UI.toast(`تم تعديل "${name}" بنجاح`);
      this.renderTab(this.currentTab);
    } else {
      UI.toast('لا يمكن تعديل المحلات الأساسية من لوحة التحكم. يمكنك حذفها وإعادة إضافتها.', 'error');
    }
  },

  // -- GOVERNORATES TAB --
  renderGovernorates(container) {
    let html = `
      <div class="admin-header">
        <h2 class="admin-title">إدارة المحافظات</h2>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" role="table" aria-label="المحافظات">
          <thead><tr><th>#</th><th>المحافظة</th><th>عدد الأحياء</th><th>عدد الشوارع</th><th>عدد المحلات</th></tr></thead>
          <tbody>
    `;
    EGYPT_DATA.governorates.forEach((g, i) => {
      const shops = g.districts.reduce((s, d) => s + d.streets.reduce((s2, st) => s2 + st.shops.length, 0), 0);
      const streets = g.districts.reduce((s, d) => s + d.streets.length, 0);
      html += `<tr>
        <td>${i + 1}</td>
        <td><strong>${UI.escapeHtml(g.name)}</strong></td>
        <td>${g.districts.length}</td>
        <td>${streets}</td>
        <td>${shops}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  },

  // -- DISTRICTS TAB --
  renderDistricts(container) {
    let html = `
      <div class="admin-header">
        <h2 class="admin-title">إدارة الأحياء</h2>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" role="table" aria-label="الأحياء">
          <thead><tr><th>#</th><th>الحي</th><th>المحافظة</th><th>عدد الشوارع</th><th>عدد المحلات</th></tr></thead>
          <tbody>
    `;
    let idx = 1;
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        const shops = d.streets.reduce((s, st) => s + st.shops.length, 0);
        html += `<tr>
          <td>${idx++}</td>
          <td><strong>${UI.escapeHtml(d.name)}</strong></td>
          <td>${UI.escapeHtml(g.name)}</td>
          <td>${d.streets.length}</td>
          <td>${shops}</td>
        </tr>`;
      });
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  },

  // -- STREETS TAB --
  renderStreets(container) {
    let html = `
      <div class="admin-header">
        <h2 class="admin-title">إدارة الشوارع</h2>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" role="table" aria-label="الشوارع">
          <thead><tr><th>#</th><th>الشارع</th><th>الحي</th><th>المحافظة</th><th>عدد المحلات</th></tr></thead>
          <tbody>
    `;
    let idx = 1;
    EGYPT_DATA.governorates.forEach(g => {
      g.districts.forEach(d => {
        d.streets.forEach(s => {
          html += `<tr>
            <td>${idx++}</td>
            <td><strong>${UI.escapeHtml(s.name)}</strong></td>
            <td>${UI.escapeHtml(d.name)}</td>
            <td>${UI.escapeHtml(g.name)}</td>
            <td>${s.shops.length}</td>
          </tr>`;
        });
      });
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  },

  // -- PENDING TAB --
  renderPending(container) {
    const pending = Store.get('pending_shops', []);
    if (pending.length === 0) {
      container.innerHTML = `
        <div class="admin-header">
          <h2 class="admin-title">طلبات الانتظار</h2>
        </div>
        <div class="no-results">
          <div class="icon" aria-hidden="true">✅</div>
          <h3>لا توجد طلبات انتظار</h3>
          <p>جميع الطلبات تمت معالجتها</p>
        </div>
      `;
      return;
    }
    let html = `
      <div class="admin-header">
        <h2 class="admin-title">طلبات الانتظار (${pending.length})</h2>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" role="table" aria-label="طلبات الانتظار">
          <thead><tr><th>#</th><th>المتجر</th><th>النشاط</th><th>العنوان</th><th>الهاتف</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
          <tbody id="pending-tbody">
    `;
    pending.forEach((p, i) => {
      html += `<tr>
        <td>${i + 1}</td>
        <td><strong>${UI.escapeHtml(p.name)}</strong></td>
        <td>${UI.escapeHtml(p.activity)}</td>
        <td>${p.address ? UI.escapeHtml(p.address) : '-'}</td>
        <td>${p.phone ? UI.escapeHtml(p.phone) : '-'}</td>
        <td><span class="admin-badge pending">قيد المراجعة</span></td>
        <td class="actions">
          <button class="btn btn-sm btn-success approve-pending" data-idx="${i}">✓ قبول</button>
          <button class="btn btn-sm btn-danger reject-pending" data-idx="${i}">✗ رفض</button>
        </td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
    container.innerHTML = html;

    container.querySelector('#pending-tbody').addEventListener('click', e => {
      const approve = e.target.closest('.approve-pending');
      const reject = e.target.closest('.reject-pending');
      if (approve) this.approvePending(parseInt(approve.dataset.idx));
      if (reject) this.rejectPending(parseInt(reject.dataset.idx));
    });
  },

  approvePending(idx) {
    const pending = Store.get('pending_shops', []);
    const shop = pending[idx];
    if (!shop) return;
    const customShops = Store.get('custom_shops', []);
    shop.id = Date.now() + Math.floor(Math.random() * 1000);
    delete shop.streetName;
    delete shop.submittedAt;
    delete shop.approved;
    customShops.push(shop);
    Store.set('custom_shops', customShops);
    pending.splice(idx, 1);
    Store.set('pending_shops', pending);
    UI.toast(`تم قبول "${shop.name}" بنجاح`);
    this.renderTab('pending');
  },

  rejectPending(idx) {
    if (!UI.confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    const pending = Store.get('pending_shops', []);
    const shop = pending[idx];
    pending.splice(idx, 1);
    Store.set('pending_shops', pending);
    UI.toast(`تم رفض "${shop.name}"`);
    this.renderTab('pending');
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
