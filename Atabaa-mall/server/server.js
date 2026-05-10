const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { initDb, all, get, run, saveDb } = require('./database');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// ===== MULTER FOR FILE UPLOADS =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + uuidv4().slice(0,8) + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

// ===== SESSION HELPERS =====
function createSession(merchantId, role = 'merchant') {
  const token = uuidv4();
  run('INSERT INTO sessions (id, merchant_id, role) VALUES (?, ?, ?)', [token, merchantId, role]);
  return token;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  const session = get('SELECT * FROM sessions WHERE id = ?', [token]);
  if (!session) return res.status(401).json({ error: 'جلسة غير صالحة' });
  req.merchantId = session.merchant_id;
  req.role = session.role;
  next();
}

// ===== CATEGORIES =====
app.get('/api/categories', (req, res) => {
  const cats = all('SELECT * FROM categories ORDER BY name');
  cats.forEach(c => {
    c.subcategories = all('SELECT * FROM subcategories WHERE category_id = ?', [c.id]);
  });
  res.json(cats);
});

// ===== PRODUCTS =====
app.get('/api/products', (req, res) => {
  const { category, sub_category, featured, search, sort, min_price, max_price, merchant_id } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (sub_category) { sql += ' AND sub_category = ?'; params.push(sub_category); }
  if (featured === 'true') { sql += ' AND featured = 1'; }
  if (search) { sql += ' AND (name LIKE ? OR description LIKE ? OR shop_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (merchant_id) { sql += ' AND merchant_id = ?'; params.push(merchant_id); }
  if (min_price) { sql += ' AND price >= ?'; params.push(+min_price); }
  if (max_price) { sql += ' AND price <= ?'; params.push(+max_price); }
  if (sort === 'price_asc') sql += ' ORDER BY price ASC';
  else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
  else if (sort === 'rating') sql += ' ORDER BY rating DESC';
  else if (sort === 'sales') sql += ' ORDER BY sales DESC';
  else sql += ' ORDER BY created_at DESC';
  let products = all(sql, params);
  products = products.map(p => ({
    ...p,
    colors: JSON.parse(p.colors || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    images: JSON.parse(p.images || '[]'),
    discount: p.original_price > 0 ? Math.round((1 - p.price / p.original_price) * 100) : 0
  }));
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const p = get('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!p) return res.status(404).json({ error: 'غير موجود' });
  p.colors = JSON.parse(p.colors || '[]');
  p.sizes = JSON.parse(p.sizes || '[]');
  p.images = JSON.parse(p.images || '[]');
  p.discount = p.original_price > 0 ? Math.round((1 - p.price / p.original_price) * 100) : 0;
  res.json(p);
});

app.post('/api/products', authMiddleware, upload.array('images', 10), (req, res) => {
  const { name, price, original_price, description, category, sub_category, colors, sizes, shop_name, stall, phone, whatsapp } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'الاسم والسعر مطلوبان' });
  const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
  const merchant = get('SELECT * FROM merchants WHERE id = ?', [req.merchantId]);
  const discount = original_price > 0 ? Math.round((1 - price / original_price) * 100) : 0;
  const result = run(`INSERT INTO products (name, price, original_price, description, shop_name, stall, phone, category, sub_category, colors, sizes, images, discount, whatsapp, merchant_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [name, +price, original_price || null, description || '', shop_name || merchant?.name, stall || merchant?.stall, phone || merchant?.phone, category || 'clothes', sub_category || 'attaba', JSON.stringify(colors ? colors.split(',').map(c => c.trim()) : []), JSON.stringify(sizes ? sizes.split(',').map(s => s.trim()) : []), JSON.stringify(images), discount, whatsapp || phone || merchant?.phone, req.merchantId]);
  res.json({ id: result.lastInsertRowid, message: 'تم إضافة المنتج' });
});

app.put('/api/products/:id', authMiddleware, upload.array('images', 10), (req, res) => {
  const p = get('SELECT * FROM products WHERE id = ? AND merchant_id = ?', [req.params.id, req.merchantId]);
  if (!p) return res.status(404).json({ error: 'غير موجود أو غير مصرح' });
  const { name, price, original_price, description, category, sub_category, colors, sizes, shop_name, stall, phone, whatsapp } = req.body;
  let images = JSON.parse(p.images || '[]');
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(f => '/uploads/' + f.filename);
    images = [...images, ...newImages];
  }
  const discount = original_price > 0 ? Math.round((1 - price / original_price) * 100) : 0;
  run(`UPDATE products SET name=?, price=?, original_price=?, description=?, shop_name=?, stall=?, phone=?, category=?, sub_category=?, colors=?, sizes=?, images=?, discount=?, whatsapp=? WHERE id=?`,
    [name || p.name, +price || p.price, original_price || p.original_price, description || p.description, shop_name || p.shop_name, stall || p.stall, phone || p.phone, category || p.category, sub_category || p.sub_category, JSON.stringify(colors ? colors.split(',').map(c => c.trim()) : JSON.parse(p.colors)), JSON.stringify(sizes ? sizes.split(',').map(s => s.trim()) : JSON.parse(p.sizes)), JSON.stringify(images), discount, whatsapp || phone || p.phone, req.params.id]);
  res.json({ message: 'تم تحديث المنتج' });
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const p = get('SELECT * FROM products WHERE id = ? AND merchant_id = ?', [req.params.id, req.merchantId]);
  if (!p) return res.status(404).json({ error: 'غير موجود أو غير مصرح' });
  run('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'تم حذف المنتج' });
});

// ===== MERCHANTS =====
app.get('/api/merchants', (req, res) => {
  const merchants = all('SELECT id, name, stall, phone, section, rating, verified, joined, image, status, owner, products_count, revenue FROM merchants ORDER BY name');
  res.json(merchants);
});

app.get('/api/merchants/:id', (req, res) => {
  const m = get('SELECT id, name, stall, phone, section, rating, verified, joined, image, status, owner, products_count, revenue FROM merchants WHERE id = ?', [req.params.id]);
  if (!m) return res.status(404).json({ error: 'غير موجود' });
  m.products = all('SELECT * FROM products WHERE merchant_id = ?', [m.id]).map(p => ({ ...p, colors: JSON.parse(p.colors || '[]'), sizes: JSON.parse(p.sizes || '[]'), images: JSON.parse(p.images || '[]') }));
  res.json(m);
});

app.post('/api/merchants/login', (req, res) => {
  const { phone, password } = req.body;
  const m = get('SELECT * FROM merchants WHERE phone = ? AND password = ?', [phone, password || '123456']);
  if (!m) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  const token = createSession(m.id, 'merchant');
  res.json({ token, merchant: { id: m.id, name: m.name, stall: m.stall, phone: m.phone, section: m.section, rating: m.rating, verified: m.verified, image: m.image } });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin' || password !== 'admin123') return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  const token = createSession(0, 'admin');
  res.json({ token, role: 'admin' });
});

app.put('/api/merchants/:id/verify', authMiddleware, (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
  run('UPDATE merchants SET verified = 1, status = ? WHERE id = ?', ['نشط', req.params.id]);
  res.json({ message: 'تم توثيق التاجر' });
});

app.put('/api/merchants/:id/status', authMiddleware, (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
  const { status } = req.body;
  run('UPDATE merchants SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'تم تحديث الحالة' });
});

// ===== ORDERS =====
app.get('/api/orders', (req, res) => {
  const orders = all('SELECT * FROM orders ORDER BY created_at DESC');
  orders.forEach(o => { o.items = JSON.parse(o.items || '[]'); });
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_phone, items, total } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'السلة فارغة' });
  const orderNo = 'ORD-' + Date.now().toString().slice(-6);
  run('INSERT INTO orders (order_no, customer_name, customer_phone, items, total) VALUES (?,?,?,?,?)',
    [orderNo, customer_name || 'عميل', customer_phone || '', JSON.stringify(items), +total || 0]);
  res.json({ order_no: orderNo, message: 'تم إنشاء الطلب' });
});

app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
  const { status } = req.body;
  run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'تم تحديث حالة الطلب' });
});

// ===== DASHBOARD STATS =====
app.get('/api/admin/stats', (req, res) => {
  const totalMerchants = get('SELECT COUNT(*) as count FROM merchants')?.count || 0;
  const totalProducts = get('SELECT COUNT(*) as count FROM products')?.count || 0;
  const totalOrders = get('SELECT COUNT(*) as count FROM orders')?.count || 0;
  const pendingVerifications = get('SELECT COUNT(*) as count FROM merchants WHERE status = ?', ['معلق'])?.count || 0;
  const activeListings = get('SELECT COUNT(*) as count FROM products')?.count || 0;
  const totalRevenue = get('SELECT COALESCE(SUM(total),0) as sum FROM orders WHERE status = ?', ['تم التوصيل'])?.sum || 0;
  res.json({ totalMerchants, totalProducts, totalOrders, pendingVerifications, activeListings, totalRevenue });
});

app.get('/api/merchant/stats', authMiddleware, (req, res) => {
  const productsCount = get('SELECT COUNT(*) as count FROM products WHERE merchant_id = ?', [req.merchantId])?.count || 0;
  const totalSales = get('SELECT COALESCE(SUM(sales),0) as sum FROM products WHERE merchant_id = ?', [req.merchantId])?.sum || 0;
  const merchant = get('SELECT rating FROM merchants WHERE id = ?', [req.merchantId]);
  res.json({ productsCount, totalSales, rating: merchant?.rating || 0 });
});

// ===== IMAGE UPLOAD (standalone) =====
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'لم يتم رفع أي صور' });
  const urls = req.files.map(f => '/uploads/' + f.filename);
  res.json({ images: urls });
});

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, '..')));

// ===== START =====
async function start() {
  await initDb();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛒 مول العتبة يعمل على: http://localhost:${PORT}`);
    console.log(`📱 افتح المتصفح على http://localhost:${PORT}`);
  });
}

start();
