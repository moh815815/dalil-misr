const CACHE = 'atabaa-mall-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css', '/js/data.js', '/js/api.js', '/js/app.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.url.includes('/api/')) {
    e.respondWith(networkFirst(request));
  } else {
    e.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request).then(res => {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(request, clone));
    return res;
  });
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(request, clone));
    return res;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'لا يوجد اتصال' }), { headers: { 'Content-Type': 'application/json' } });
  }
}
