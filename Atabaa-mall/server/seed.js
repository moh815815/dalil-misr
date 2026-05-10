const { initDb, run, saveDb } = require('./database');

async function seed() {
  const db = await initDb();
  console.log('🌱 بداية تجهيز البيانات...');

  // Clean existing data
  db.run('DELETE FROM sessions');
  db.run('DELETE FROM orders');
  db.run('DELETE FROM products');
  db.run('DELETE FROM merchants');
  db.run('DELETE FROM subcategories');
  db.run('DELETE FROM categories');

  // === CATEGORIES ===
  const categories = [
    { id: 'clothes', name: 'الملابس', icon: 'fa-tshirt', color: '#C0392B', count: 50, image: 'https://placehold.co/300x200/C0392B/FFFFFF?text=الملابس' },
    { id: 'electronics', name: 'الإلكترونيات', icon: 'fa-mobile-alt', color: '#2980B9', count: 35, image: 'https://placehold.co/300x200/2980B9/FFFFFF?text=إلكترونيات' },
    { id: 'footwear', name: 'الأحذية', icon: 'fa-shoe-prints', color: '#E67E22', count: 28, image: 'https://placehold.co/300x200/E67E22/FFFFFF?text=أحذية' },
    { id: 'household', name: 'أدوات المنزل', icon: 'fa-couch', color: '#27AE60', count: 40, image: 'https://placehold.co/300x200/27AE60/FFFFFF?text=منزل' }
  ];
  for (const c of categories) {
    run('INSERT OR REPLACE INTO categories (id, name, icon, color, count, image) VALUES (?,?,?,?,?,?)', [c.id, c.name, c.icon, c.color, c.count, c.image]);
  }

  // === SUBCATEGORIES ===
  const subcategories = [
    { id: 'attaba', category_id: 'clothes', name: 'مول العتبة الرئيسي', area: 'الدور الأول', shops: 25 },
    { id: 'mosky', category_id: 'clothes', name: 'منطقة الموسكي', area: 'شارع الموسكي', shops: 18 },
    { id: 'gumruk', category_id: 'clothes', name: 'شارع الجمرك', area: 'شارع الجمرك', shops: 12 },
    { id: 'attaba', category_id: 'electronics', name: 'مول العتبة الرئيسي', area: 'الدور الثاني', shops: 20 },
    { id: 'abdulaziz', category_id: 'electronics', name: 'شارع عبد العزيز', area: 'شارع عبد العزيز', shops: 15 },
    { id: 'attaba', category_id: 'footwear', name: 'مول العتبة الرئيسي', area: 'الدور الأرضي', shops: 15 },
    { id: 'mosky', category_id: 'footwear', name: 'منطقة الموسكي', area: 'شارع الموسكي', shops: 13 },
    { id: 'attaba', category_id: 'household', name: 'مول العتبة الرئيسي', area: 'الدور الثالث', shops: 22 },
    { id: 'gumruk', category_id: 'household', name: 'شارع الجمرك', area: 'شارع الجمرك', shops: 10 }
  ];
  for (const s of subcategories) {
    run('INSERT OR REPLACE INTO subcategories (id, category_id, name, area, shops) VALUES (?,?,?,?,?)', [s.id, s.category_id, s.name, s.area, s.shops]);
  }

  // === MERCHANTS ===
  const merchants = [
    { name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', section: 'الملابس', rating: 4.5, verified: 1, joined: '2022-03-15', image: 'https://placehold.co/100x100/C0392B/FFFFFF?text=ت1', owner: 'أحمد محمد', email: 'ahmed@attaba.com', password: '123456', products_count: 45, revenue: 125000 },
    { name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', section: 'الملابس', rating: 4.2, verified: 1, joined: '2021-11-20', image: 'https://placehold.co/100x100/2C3E50/FFFFFF?text=م', owner: 'محمود علي', email: 'mahmoud@mosky.com', password: '123456', products_count: 32, revenue: 89000 },
    { name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', section: 'الإلكترونيات', rating: 4.8, verified: 1, joined: '2023-01-10', image: 'https://placehold.co/100x100/27AE60/FFFFFF?text=ت2', owner: 'خالد حسن', email: 'khalid@tech.com', password: '123456', products_count: 58, revenue: 210000 },
    { name: 'الجمرك للحقائب', stall: 'D-11', phone: '0100444555', section: 'الإكسسوارات', rating: 4.0, verified: 0, joined: '2023-06-05', image: 'https://placehold.co/100x100/8E44AD/FFFFFF?text=ج', owner: 'سارة أحمد', email: 'sara@gumruk.com', password: '123456', products_count: 12, revenue: 34000, status: 'معلق' },
    { name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', section: 'الأحذية', rating: 4.6, verified: 1, joined: '2022-08-22', image: 'https://placehold.co/100x100/E67E22/FFFFFF?text=ح', owner: 'محمد كريم', email: 'mohamed@golden.com', password: '123456', products_count: 28, revenue: 156000 },
    { name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', section: 'أدوات المنزل', rating: 4.3, verified: 1, joined: '2023-04-18', image: 'https://placehold.co/100x100/1ABC9C/FFFFFF?text=م1', owner: 'نادية عمر', email: 'nadia@happy.com', password: '123456', products_count: 38, revenue: 98000 },
  ];
  for (const m of merchants) {
    run(`INSERT INTO merchants (name, stall, phone, section, rating, verified, joined, image, owner, email, password, products_count, revenue, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [m.name, m.stall, m.phone, m.section, m.rating, m.verified, m.joined, m.image, m.owner, m.email, m.password, m.products_count, m.revenue, m.status || 'نشط']);
  }

  // === PRODUCTS ===
  let products = [
    { name: 'فستان سهرة تركي مطرز', price: 450, original_price: 650, description: 'فستان سهرة تركي فاخر بتطريز يدوي. قماش دانتيل عالي الجودة. مناسب للحفلات والمناسبات.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['أسود','أحمر','أزرق ملكي','بيج'], sizes: ['M','L','XL','XXL'], images: ['https://placehold.co/600x700/C0392B/FFFFFF?text=فستان1','https://placehold.co/600x700/E74C3C/FFFFFF?text=فستان2','https://placehold.co/600x700/8E44AD/FFFFFF?text=فستان3'], rating: 4.5, sales: 230, featured: 1, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'بدلة رجالي إيطالي', price: 1200, original_price: 1800, description: 'بدلة رجالي إيطالية الصنع. قماش صوفي عالي الجودة. تصميم كلاسيكي أنيق.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['أسود','نيلي','رمادي'], sizes: ['50','52','54','56','58'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=بدلة1','https://placehold.co/600x700/34495E/FFFFFF?text=بدلة2'], rating: 4.8, sales: 120, featured: 1, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'جلابية صعيدي فاخر', price: 280, original_price: 400, description: 'جلابية صعيدي فاخر من القطن المصري الممتاز.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['أبيض','بيج','رمادي فاتح'], sizes: ['M','L','XL','XXL','XXXL'], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=جلابية1','https://placehold.co/600x700/F5F5DC/2C3E50?text=جلابية2'], rating: 4.3, sales: 340, featured: 0, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'بلوفر شتوي صوف', price: 350, description: 'بلوفر شتوي من الصوف الخالص. دافئ وناعم.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['أسود','رمادي','كحلي','بني'], sizes: ['S','M','L','XL','XXL'], images: ['https://placehold.co/600x700/7F8C8D/FFFFFF?text=بلوفر1','https://placehold.co/600x700/95A5A6/FFFFFF?text=بلوفر2','https://placehold.co/600x700/34495E/FFFFFF?text=بلوفر3'], rating: 4.1, sales: 180, featured: 0, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'طرح حرير موسكي', price: 85, original_price: 150, description: 'طرح حرير طبيعي من منطقة الموسكي.', shop_name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', sub_category: 'mosky', colors: ['أحمر','أصفر','أخضر','بنفسجي','وردي'], sizes: ['مقاس واحد'], images: ['https://placehold.co/600x700/E74C3C/FFFFFF?text=طرح1','https://placehold.co/600x700/F39C12/FFFFFF?text=طرح2','https://placehold.co/600x700/9B59B6/FFFFFF?text=طرح3'], rating: 4.4, sales: 560, featured: 1, whatsapp: '0100222333', merchant_id: 2 },
    { name: 'قماش ستان دانتيل', price: 65, description: 'قماش ستان دانتيل عالي الجودة.', shop_name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', sub_category: 'mosky', colors: ['أبيض','أسود','عاجي','وردي فاتح'], sizes: ['المتر'], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=ستان1','https://placehold.co/600x700/BDC3C7/2C3E50?text=ستان2'], rating: 4.0, sales: 890, featured: 0, whatsapp: '0100222333', merchant_id: 2 },
    { name: 'سماعة بلوتوث لاسلكية', price: 320, original_price: 500, description: 'سماعة بلوتوث لاسلكية عالية الجودة. صوت نقي وقوي.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','أبيض','أزرق'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=سماعة1','https://placehold.co/600x700/ECF0F1/2C3E50?text=سماعة2','https://placehold.co/600x700/3498DB/FFFFFF?text=سماعة3'], rating: 4.7, sales: 450, featured: 1, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'محمول شاومي ريدمي نوت 12', price: 4500, original_price: 5500, description: 'محمول شاومي ريدمي نوت 12. شاشة 6.67 بوصة.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','أزرق','ذهبي'], sizes: ['128 جيجا','256 جيجا'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=شاومي1','https://placehold.co/600x700/2980B9/FFFFFF?text=شاومي2','https://placehold.co/600x700/F1C40F/2C3E50?text=شاومي3'], rating: 4.6, sales: 180, featured: 1, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'ساعة ذكية رياضية', price: 650, original_price: 950, description: 'ساعة ذكية رياضية متعددة الوظائف.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','أحمر','أزرق'], sizes: ['مقاس واحد'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=ساعة1','https://placehold.co/600x700/E74C3C/FFFFFF?text=ساعة2','https://placehold.co/600x700/3498DB/FFFFFF?text=ساعة3'], rating: 4.3, sales: 310, featured: 1, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'بوربانك محمول 20000mAh', price: 250, description: 'بوربانك محمول سعة 20000 مللي أمبير.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','أبيض'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=بوربانك1','https://placehold.co/600x700/ECF0F1/2C3E50?text=بوربانك2'], rating: 4.4, sales: 670, featured: 0, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'حذاء رياضي رجالي ماركة', price: 780, original_price: 1200, description: 'حذاء رياضي رجالي ماركة. نعل مريح.', shop_name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', sub_category: 'attaba', colors: ['أسود','أبيض','أزرق'], sizes: ['39','40','41','42','43','44','45'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=حذاء1','https://placehold.co/600x700/ECF0F1/2C3E50?text=حذاء2','https://placehold.co/600x700/2980B9/FFFFFF?text=حذاء3'], rating: 4.7, sales: 320, featured: 1, whatsapp: '0100555666', merchant_id: 5 },
    { name: 'جزمة شتوية جلد', price: 650, original_price: 900, description: 'جزمة شتوية جلد طبيعي. دافئة ومبطنة.', shop_name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', sub_category: 'attaba', colors: ['أسود','بني'], sizes: ['39','40','41','42','43','44'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=جزمة1','https://placehold.co/600x700/8B4513/FFFFFF?text=جزمة2'], rating: 4.5, sales: 150, featured: 1, whatsapp: '0100555666', merchant_id: 5 },
    { name: 'طقم حلل جرانيت 11 قطعة', price: 1450, original_price: 2200, description: 'طقم حلل جرانيت سيراميك عالي الجودة.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'attaba', colors: ['أحمر','أسود','أخضر'], sizes: [], images: ['https://placehold.co/600x700/C0392B/FFFFFF?text=حلل1','https://placehold.co/600x700/2C3E50/FFFFFF?text=حلل2','https://placehold.co/600x700/27AE60/FFFFFF?text=حلل3'], rating: 4.8, sales: 200, featured: 1, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'طقم كاسات بلوري 12 قطعة', price: 250, original_price: 400, description: 'طقم كاسات بلوري شفاف فاخر.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'attaba', colors: ['شفاف'], sizes: [], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=كاسات1','https://placehold.co/600x700/BDC3C7/2C3E50?text=كاسات2'], rating: 4.3, sales: 340, featured: 1, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'مفارش سرير قطن 100%', price: 380, original_price: 550, description: 'مفارش سرير قطن مصري 100%.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'attaba', colors: ['أبيض','بيج','كحلي','رمادي','بنفسجي'], sizes: ['فردي','مزدوج','كينج'], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=مفارش1','https://placehold.co/600x700/34495E/FFFFFF?text=مفارش2'], rating: 4.6, sales: 270, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'سجادة صلاة قطيفة', price: 95, original_price: 150, description: 'سجادة صلاة قطيفة ناعمة.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'gumruk', colors: ['أحمر','أخضر','أزرق','بنفسجي','ذهبي'], sizes: ['مقاس واحد'], images: ['https://placehold.co/600x700/C0392B/FFFFFF?text=سجادة1','https://placehold.co/600x700/27AE60/FFFFFF?text=سجادة2'], rating: 4.4, sales: 870, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
  ];

  for (const p of products) {
    const discount = p.original_price > 0 ? Math.round((1 - p.price / p.original_price) * 100) : 0;
    run(`INSERT INTO products (name, price, original_price, description, shop_name, stall, phone, category, sub_category, colors, sizes, images, rating, sales, featured, discount, whatsapp, merchant_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [p.name, p.price, p.original_price || null, p.description, p.shop_name, p.stall, p.phone, p.category, p.sub_category, JSON.stringify(p.colors), JSON.stringify(p.sizes), JSON.stringify(p.images), p.rating, p.sales, p.featured, discount, p.whatsapp, p.merchant_id]);
  }

  // === MORE PRODUCTS ===
  const moreProducts = [
    { name: 'بنطلون جينز رجالي', price: 320, original_price: 450, description: 'بنطلون جينز رجالي تركي. قماش دنيم عالي الجودة. مريح وعصري.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['كحلي','أسود','رمادي'], sizes: ['30','32','34','36','38','40'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=جينز1','https://placehold.co/600x700/34495E/FFFFFF?text=جينز2'], rating: 4.2, sales: 410, featured: 0, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'تيشرت قطن رجالي', price: 85, original_price: 130, description: 'تيشرت قطن مصري 100%. خامة عالية الجودة. متوفر بألوان متعددة.', shop_name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', sub_category: 'attaba', colors: ['أبيض','أسود','أحمر','أزرق','أخضر'], sizes: ['S','M','L','XL','XXL'], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=تيشرت1','https://placehold.co/600x700/E74C3C/FFFFFF?text=تيشرت2'], rating: 4.0, sales: 890, featured: 0, whatsapp: '0100111222', merchant_id: 1 },
    { name: 'شال حرير موسكي', price: 120, original_price: 200, description: 'شال حرير ناعم من منطقة الموسكي. نقشات شرقية جميلة. مناسب للسهرات.', shop_name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', sub_category: 'mosky', colors: ['ذهبي','فضي','أسود','أحمر'], sizes: ['مقاس واحد'], images: ['https://placehold.co/600x700/D4AC0D/2C3E50?text=شال1','https://placehold.co/600x700/BDC3C7/2C3E50?text=شال2'], rating: 4.3, sales: 290, featured: 0, whatsapp: '0100222333', merchant_id: 2 },
    { name: 'فستان بناتي قطيفة', price: 180, description: 'فستان بناتي قطيفة فاخر. مريح وأنيق. مناسب للأطفال من سن 3-12 سنة.', shop_name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', sub_category: 'mosky', colors: ['وردي','بنفسجي','أحمر','أزرق'], sizes: ['3-4','5-6','7-8','9-10','11-12'], images: ['https://placehold.co/600x700/E91E63/FFFFFF?text=فستان2','https://placehold.co/600x700/9B59B6/FFFFFF?text=فستان3'], rating: 4.1, sales: 560, featured: 0, whatsapp: '0100222333', merchant_id: 2 },
    { name: 'تابلت سامسونج A9', price: 3200, original_price: 4000, description: 'تابلت سامسونج جالكسي A9. شاشة 11 بوصة. ذاكرة 128 جيجا.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','فضي'], sizes: ['128 جيجا'], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=تابلت1','https://placehold.co/600x700/34495E/FFFFFF?text=تابلت2'], rating: 4.5, sales: 95, featured: 0, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'شاحن متنقل 30000mAh', price: 350, original_price: 500, description: 'شاحن متنقل سوبر سعة 30000 مللي أمبير. شحن سريع. 3 منافذ USB.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'attaba', colors: ['أسود','أبيض'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=شاحن1','https://placehold.co/600x700/ECF0F1/2C3E50?text=شاحن2'], rating: 4.2, sales: 780, featured: 0, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'كابل USB-C سريع', price: 45, description: 'كابل USB-C شحن سريع. طول 1.5 متر. متين ومقاوم للقطع.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'abdulaziz', colors: ['أسود','أبيض','أحمر'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=كابل1','https://placehold.co/600x700/E74C3C/FFFFFF?text=كابل2'], rating: 4.0, sales: 1200, featured: 0, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'ماوس لاسلكي', price: 120, description: 'ماوس لاسلكي مريح. حساسية عالية. بطارية تدوم 6 شهور.', shop_name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', sub_category: 'abdulaziz', colors: ['أسود','أبيض','أزرق'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=ماوس1','https://placehold.co/600x700/3498DB/FFFFFF?text=ماوس2'], rating: 3.9, sales: 450, featured: 0, whatsapp: '0100333444', merchant_id: 3 },
    { name: 'حذاء كاجوال رجالي', price: 450, original_price: 650, description: 'حذاء كاجوال رجالي جلد طبيعي. مريح للمشي اليومي.', shop_name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', sub_category: 'attaba', colors: ['بني','أسود','كحلي'], sizes: ['39','40','41','42','43','44','45'], images: ['https://placehold.co/600x700/8B4513/FFFFFF?text=كاجوال1','https://placehold.co/600x700/2C3E50/FFFFFF?text=كاجوال2'], rating: 4.4, sales: 230, featured: 0, whatsapp: '0100555666', merchant_id: 5 },
    { name: 'حذاء رياضي حريمي', price: 550, original_price: 750, description: 'حذاء رياضي حريمي ماركة. نعل Air لتخفيف الصدمات.', shop_name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', sub_category: 'attaba', colors: ['وردي','أبيض','أسود','رمادي'], sizes: ['36','37','38','39','40','41'], images: ['https://placehold.co/600x700/E91E63/FFFFFF?text=حريمي1','https://placehold.co/600x700/ECF0F1/2C3E50?text=حريمي2'], rating: 4.6, sales: 180, featured: 0, whatsapp: '0100555666', merchant_id: 5 },
    { name: 'شبشب رجالي جلدي', price: 150, description: 'شبشب رجالي جلدي فاخر. مريح ومناسب للصيف.', shop_name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', sub_category: 'mosky', colors: ['بني','أسود'], sizes: ['40','41','42','43','44','45'], images: ['https://placehold.co/600x700/8B4513/FFFFFF?text=شبشب3','https://placehold.co/600x700/2C3E50/FFFFFF?text=شبشب4'], rating: 3.8, sales: 340, featured: 0, whatsapp: '0100555666', merchant_id: 5 },
    { name: 'طقم أطباق صيني 24 قطعة', price: 680, original_price: 950, description: 'طقم أطباق صيني فاخر 24 قطعة. مناسب لـ 6 أفراد. تصميم كلاسيكي.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'attaba', colors: ['أبيض','ذهبي'], sizes: [], images: ['https://placehold.co/600x700/ECF0F1/2C3E50?text=اطباق1','https://placehold.co/600x700/D4AC0D/2C3E50?text=اطباق2'], rating: 4.5, sales: 160, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'حافظة طعام حرارية', price: 220, description: 'حافظة طعام حرارية 3 أدوار. تحفظ الطعام ساخناً لساعات.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'attaba', colors: ['أسود','أحمر','أزرق'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=حافظة1','https://placehold.co/600x700/C0392B/FFFFFF?text=حافظة2'], rating: 4.2, sales: 280, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'طاسة تيفال جرانيت', price: 180, original_price: 280, description: 'طاسة تيفال جرانيت مانعة للالتصاق. قطر 28 سم. مناسبة لجميع البوتاجازات.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'gumruk', colors: ['أسود','أحمر'], sizes: [], images: ['https://placehold.co/600x700/2C3E50/FFFFFF?text=طاسة1','https://placehold.co/600x700/E74C3C/FFFFFF?text=طاسة2'], rating: 4.0, sales: 520, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
    { name: 'مفرش سفرة بلاستيك', price: 65, description: 'مفرش سفرة بلاستيك شفاف متين. يغطي سفرة 6 أفراد.', shop_name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', sub_category: 'gumruk', colors: ['شفاف','أبيض'], sizes: [], images: ['https://placehold.co/600x700/E0E0E0/2C3E50?text=مفرش1','https://placehold.co/600x700/ECF0F1/2C3E50?text=مفرش2'], rating: 3.7, sales: 680, featured: 0, whatsapp: '0100666777', merchant_id: 6 },
  ];
  for (const p of moreProducts) {
    const discount = p.original_price > 0 ? Math.round((1 - p.price / p.original_price) * 100) : 0;
    run(`INSERT INTO products (name, price, original_price, description, shop_name, stall, phone, category, sub_category, colors, sizes, images, rating, sales, featured, discount, whatsapp, merchant_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [p.name, p.price, p.original_price || null, p.description, p.shop_name, p.stall, p.phone, p.category, p.sub_category, JSON.stringify(p.colors), JSON.stringify(p.sizes), JSON.stringify(p.images), p.rating, p.sales, p.featured, discount, p.whatsapp, p.merchant_id]);
  }
  products = [...products, ...moreProducts];

  // === ORDERS ===
  const orders = [
    { order_no: 'ORD-1001', customer_name: 'أحمد عبد الله', customer_phone: '0100999111', items: [{id:1,name:'فستان سهرة',qty:2,price:450}], total: 900, status: 'تم التوصيل', payment: 'مدفوع', created_at: '2026-05-08 14:30' },
    { order_no: 'ORD-1002', customer_name: 'مريم حسن', customer_phone: '0100888222', items: [{id:7,name:'سماعة بلوتوث',qty:1,price:320}], total: 320, status: 'قيد التوصيل', payment: 'مدفوع', created_at: '2026-05-09 10:15' },
    { order_no: 'ORD-1003', customer_name: 'علي محمد', customer_phone: '0100777333', items: [{id:11,name:'حذاء رياضي',qty:1,price:780},{id:13,name:'طقم كاسات',qty:2,price:250}], total: 1280, status: 'قيد المراجعة', payment: 'غير مدفوع', created_at: '2026-05-09 16:45' },
    { order_no: 'ORD-1004', customer_name: 'فاطمة الزهراء', customer_phone: '0100666444', items: [{id:10,name:'بوربانك',qty:1,price:250}], total: 250, status: 'تم التوصيل', payment: 'مدفوع', created_at: '2026-05-07 11:20' },
    { order_no: 'ORD-1005', customer_name: 'يوسف أحمد', customer_phone: '0100555555', items: [{id:2,name:'بدلة رجالي',qty:1,price:1200},{id:4,name:'بلوفر',qty:1,price:350}], total: 1550, status: 'ملغي', payment: 'مسترد', created_at: '2026-05-06 09:00' },
  ];

  for (const o of orders) {
    run('INSERT INTO orders (order_no, customer_name, customer_phone, items, total, status, payment, created_at) VALUES (?,?,?,?,?,?,?,?)',
      [o.order_no, o.customer_name, o.customer_phone, JSON.stringify(o.items), o.total, o.status, o.payment, o.created_at]);
  }

  saveDb();
  console.log('✅ تم تجهيز البيانات بنجاح!');
  console.log('📊 الإحصائيات:');
  console.log(`   - ${categories.length} أقسام رئيسية`);
  console.log(`   - ${subcategories.length} أقسام فرعية`);
  console.log(`   - ${merchants.length} تجار`);
  console.log(`   - ${products.length} منتج`);
  console.log(`   - ${orders.length} طلب`);
  console.log('\n🔑 بيانات الدخول:');
  console.log('   التاجر: 0100111222 / 123456');
  console.log('   الإدارة: admin / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
