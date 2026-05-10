// ============================================================
// دليل مصر - Business Submission Form Logic
// ============================================================

const SubmitUI = {
  init() {
    this.populateGovernorates();
    document.getElementById('submit-form').addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupValidation();
  },

  setupValidation() {
    const inputs = document.querySelectorAll('#submit-form [required]');
    inputs.forEach(inp => {
      inp.addEventListener('blur', () => this.validateField(inp));
      inp.addEventListener('input', () => {
        inp.classList.remove('error');
        const err = inp.parentNode.querySelector('.form-error-msg');
        if (err) err.classList.remove('visible');
      });
    });
  },

  validateField(field) {
    if (!field.value.trim()) {
      field.classList.add('error');
      let err = field.parentNode.querySelector('.form-error-msg');
      if (!err) {
        err = document.createElement('div');
        err.className = 'form-error-msg';
        field.parentNode.appendChild(err);
      }
      err.textContent = 'هذا الحقل مطلوب';
      err.classList.add('visible');
      return false;
    }
    field.classList.remove('error');
    const err = field.parentNode.querySelector('.form-error-msg');
    if (err) err.classList.remove('visible');
    return true;
  },

  populateGovernorates() {
    const sel = document.getElementById('s-gov');
    EGYPT_DATA.governorates.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      sel.appendChild(opt);
    });
  },

  loadDistricts() {
    const govId = parseInt(document.getElementById('s-gov').value);
    const distSel = document.getElementById('s-dist');
    const strSel = document.getElementById('s-street');
    distSel.innerHTML = '<option value="">اختر الحي</option>';
    strSel.innerHTML = '<option value="">اختر الشارع أولاً</option>';
    distSel.disabled = !govId;
    if (!govId) return;
    const gov = EGYPT_DATA.governorates.find(g => g.id === govId);
    if (gov) {
      gov.districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        distSel.appendChild(opt);
      });
    }
  },

  loadStreets() {
    const govId = parseInt(document.getElementById('s-gov').value);
    const distId = parseInt(document.getElementById('s-dist').value);
    const strSel = document.getElementById('s-street');
    strSel.innerHTML = '<option value="">اختر الشارع</option>';
    strSel.disabled = !distId;
    if (!govId || !distId) return;
    const gov = EGYPT_DATA.governorates.find(g => g.id === govId);
    if (gov) {
      const dist = gov.districts.find(d => d.id === distId);
      if (dist) {
        dist.streets.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = s.name;
          strSel.appendChild(opt);
        });
      }
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    const fields = [
      document.getElementById('s-name'),
      document.getElementById('s-activity'),
      document.getElementById('s-gov'),
      document.getElementById('s-dist'),
      document.getElementById('s-street'),
      document.getElementById('s-address'),
      document.getElementById('s-phone'),
      document.getElementById('s-whatsapp')
    ];

    let valid = true;
    fields.forEach(f => {
      if (!this.validateField(f)) valid = false;
    });

    if (!valid) {
      UI.toast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const name = document.getElementById('s-name').value.trim();
    const activity = document.getElementById('s-activity').value;
    const govId = parseInt(document.getElementById('s-gov').value);
    const distId = parseInt(document.getElementById('s-dist').value);
    const streetId = parseInt(document.getElementById('s-street').value);
    const address = document.getElementById('s-address').value.trim();
    const phone = document.getElementById('s-phone').value.trim();
    const whatsapp = document.getElementById('s-whatsapp').value.trim();
    const location = document.getElementById('s-location').value.trim();

    if (!/^\d+$/.test(phone)) {
      UI.toast('رقم الهاتف يجب أن يكون أرقاماً فقط', 'error');
      return;
    }

    const gov = EGYPT_DATA.governorates.find(g => g.id === govId);
    const dist = gov.districts.find(d => d.id === distId);
    const street = dist.streets.find(s => s.id === streetId);

    const shopData = {
      id: Date.now(),
      name,
      activity,
      address,
      phone,
      whatsapp,
      locationLink: location || 'https://maps.google.com/',
      rating: 0,
      approved: false,
      govId,
      distId,
      streetId,
      governorate: gov.name,
      district: dist.name,
      streetName: street.name,
      submittedAt: new Date().toISOString()
    };

    const pending = Store.get('pending_shops', []);
    pending.push(shopData);
    Store.set('pending_shops', pending);

    const form = document.getElementById('submit-form');
    form.innerHTML = `
      <div class="success-msg">
        <div class="icon" aria-hidden="true">✅</div>
        <h3>تم إرسال الطلب بنجاح!</h3>
        <p>شكراً لك! سيتم مراجعة طلب إضافة "${UI.escapeHtml(name)}" من قبل الإدارة خلال 24 ساعة.</p>
        <div class="flex gap-8" style="justify-content:center;flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary">العودة للدليل</a>
          <a href="submit.html" class="btn btn-outline">إضافة متجر آخر</a>
        </div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => SubmitUI.init());
