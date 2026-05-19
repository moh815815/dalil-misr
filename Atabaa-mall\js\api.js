// ===== API Client - مول العتبة =====
const API = (() => {
  const BASE = window.location.origin + '/api';
  let _token = localStorage.getItem('atabaa_token') || null;
  let _merchant = JSON.parse(localStorage.getItem('atabaa_merchant') || 'null');

  function headers() {
    const h = { 'Content-Type': 'application/json' };
    if (_token) h['Authorization'] = 'Bearer ' + _token;
    return h;
  }

  async function request(method, path, body = null) {
    const opts = { method, headers: headers() };
    if (body && !(body instanceof FormData)) opts.body = JSON.stringify(body);
    if (body instanceof FormData) {
      delete opts.headers['Content-Type'];
      if (_token) opts.headers = { 'Authorization': 'Bearer ' + _token };
      opts.body = body;
    }
    try {
      const res = await fetch(BASE + path, opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في الاتصال');
      return data;
    } catch (e) {
      if (e.message === 'Failed to fetch') throw new Error('الخادم غير متصل. تأكد من تشغيل السيرفر');
      throw e;
    }
  }

  return {
    // Auth
    get token() { return _token; },
    get merchant() { return _merchant; },
    setMerchant(m, t) { _merchant = m; _token = t; localStorage.setItem('atabaa_merchant', JSON.stringify(m)); localStorage.setItem('atabaa_token', t); },
    logout() { _merchant = null; _token = null; localStorage.removeItem('atabaa_merchant'); localStorage.removeItem('atabaa_token'); },
    async login(phone, password) {
      const data = await request('POST', '/merchants/login', { phone, password });
      this.setMerchant(data.merchant, data.token);
      return data;
    },
    async adminLogin(username, password) {
      const data = await request('POST', '/admin/login', { username, password });
      _token = data.token;
      localStorage.setItem('atabaa_token', data.token);
      return data;
    },

    // Categories
    async getCategories() { return request('GET', '/categories'); },

    // Products
    async getProducts(params = '') { return request('GET', '/products' + (params ? '?' + params : '')); },
    async getProduct(id) { return request('GET', '/products/' + id); },
    async createProduct(formData) {
      const opts = { method: 'POST', headers: {} };
      if (_token) opts.headers['Authorization'] = 'Bearer ' + _token;
      opts.body = formData;
      const res = await fetch(BASE + '/products', opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ');
      return data;
    },
    async deleteProduct(id) { return request('DELETE', '/products/' + id); },

    // Merchants
    async getMerchants() { return request('GET', '/merchants'); },
    async getMerchant(id) { return request('GET', '/merchants/' + id); },

    // Orders
    async getOrders() { return request('GET', '/orders'); },
    async createOrder(data) { return request('POST', '/orders', data); },
    async updateOrderStatus(id, status) { return request('PUT', '/orders/' + id + '/status', { status }); },

    // Admin
    async getAdminStats() { return request('GET', '/admin/stats'); },
    async verifyMerchant(id) { return request('PUT', '/merchants/' + id + '/verify', {}); },
    async updateMerchantStatus(id, status) { return request('PUT', '/merchants/' + id + '/status', { status }); },

    // Merchant Dashboard
    async getMerchantStats() { return request('GET', '/merchant/stats'); },

    // Upload
    async uploadImages(formData) {
      const opts = { method: 'POST', headers: {} };
      if (_token) opts.headers['Authorization'] = 'Bearer ' + _token;
      opts.body = formData;
      const res = await fetch(BASE + '/upload', opts);
      return res.json();
    }
  };
})();
