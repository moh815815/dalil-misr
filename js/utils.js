// ============================================================
// دليل مصر - Shared Utilities
// ============================================================

const Store = {
  get(key, fallback) {
    try {
      const d = localStorage.getItem('dalil_' + key);
      return d ? JSON.parse(d) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem('dalil_' + key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem('dalil_' + key);
  }
};

const UI = {
  toast(msg, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' ' + type : '');
    t.textContent = msg;
    t.setAttribute('role', 'alert');
    container.appendChild(t);
    requestAnimationFrame(() => {
      t.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { t.style.opacity = '0'; }, 2200);
      setTimeout(() => t.remove(), 2500);
    });
  },
  confirm(msg) {
    return window.confirm(msg);
  },
  escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
};

const KEYS = {
  VIEWS: {
    GOVERNORATES: 'governorates',
    DISTRICTS: 'districts',
    STREETS: 'streets',
    SHOPS: 'shops'
  }
};

function showLoading(container) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}
