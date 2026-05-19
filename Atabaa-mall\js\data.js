// بيانات مول العتبة - Ataba Mall Data
const Store = {
  cart: [],
  currentPage: 'home',
  currentProduct: null,
  currentCategory: null,
  currentSubCategory: null,
  lightboxImages: [],
  lightboxIndex: 0,
  merchants: [
    { id: 1, name: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', section: 'الملابس', rating: 4.5, verified: true, joined: '2022-03-15', image: 'https://placehold.co/100x100/C0392B/FFFFFF?text=ت1' },
    { id: 2, name: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', section: 'الملابس', rating: 4.2, verified: true, joined: '2021-11-20', image: 'https://placehold.co/100x100/2C3E50/FFFFFF?text=م' },
    { id: 3, name: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', section: 'الإلكترونيات', rating: 4.8, verified: true, joined: '2023-01-10', image: 'https://placehold.co/100x100/27AE60/FFFFFF?text=ت2' },
    { id: 4, name: 'الجمرك للحقائب', stall: 'D-11', phone: '0100444555', section: 'الإكسسوارات', rating: 4.0, verified: false, joined: '2023-06-05', image: 'https://placehold.co/100x100/8E44AD/FFFFFF?text=ج' },
    { id: 5, name: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', section: 'الأحذية', rating: 4.6, verified: true, joined: '2022-08-22', image: 'https://placehold.co/100x100/E67E22/FFFFFF?text=ح' },
    { id: 6, name: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', section: 'أدوات المنزل', rating: 4.3, verified: true, joined: '2023-04-18', image: 'https://placehold.co/100x100/1ABC9C/FFFFFF?text=م1' },
  ],
  products: [
    // ===== CLOTHES - Attaba =====
    { id: 1, name: 'فستان سهرة تركي مطرز', price: 450, originalPrice: 650, description: 'فستان سهرة تركي فاخر بتطريز يدوي. قماش دانتيل عالي الجودة. مناسب للحفلات والمناسبات. متوفر بمقاسات مختلفة.', shopName: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', subCategory: 'attaba', colors: ['أسود', 'أحمر', 'أزرق ملكي', 'بيج'], sizes: ['M', 'L', 'XL', 'XXL'], images: [
      'https://placehold.co/600x700/C0392B/FFFFFF?text=فستان+1', 'https://placehold.co/600x700/E74C3C/FFFFFF?text=فستان+2', 'https://placehold.co/600x700/8E44AD/FFFFFF?text=فستان+3', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=فستان+4'
    ], rating: 4.5, sales: 230, featured: true, discount: 30, whatsapp: '0100111222' },
    { id: 2, name: 'بدلة رجالي إيطالي', price: 1200, originalPrice: 1800, description: 'بدلة رجالي إيطالية الصنع. قماش صوفي عالي الجودة. تصميم كلاسيكي أنيق مناسب للمناسبات الرسمية.', shopName: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', subCategory: 'attaba', colors: ['أسود', 'نيلي', 'رمادي'], sizes: ['50', '52', '54', '56', '58'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=بدلة+1', 'https://placehold.co/600x700/34495E/FFFFFF?text=بدلة+2', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=بدلة+3'
    ], rating: 4.8, sales: 120, featured: true, discount: 33, whatsapp: '0100111222' },
    { id: 3, name: 'جلابية صعيدي فاخر', price: 280, originalPrice: 400, description: 'جلابية صعيدي فاخر من القطن المصري الممتاز. مشغول بتطريز بسيط عند الياقة والصدر.', shopName: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', subCategory: 'attaba', colors: ['أبيض', 'بيج', 'رمادي فاتح'], sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'], images: [
      'https://placehold.co/600x700/ECF0F1/2C3E50?text=جلابية+1', 'https://placehold.co/600x700/F5F5DC/2C3E50?text=جلابية+2'
    ], rating: 4.3, sales: 340, featured: false, discount: 30, whatsapp: '0100111222' },
    { id: 4, name: 'بلوفر شتوي صوف', price: 350, description: 'بلوفر شتوي من الصوف الخالص. دافئ وناعم. مناسب للأجواء الباردة.', shopName: 'العتبة للتجارة', stall: 'A-15', phone: '0100111222', category: 'clothes', subCategory: 'attaba', colors: ['أسود', 'رمادي', 'كحلي', 'بني'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: [
      'https://placehold.co/600x700/7F8C8D/FFFFFF?text=بلوفر+1', 'https://placehold.co/600x700/95A5A6/FFFFFF?text=بلوفر+2', 'https://placehold.co/600x700/34495E/FFFFFF?text=بلوفر+3'
    ], rating: 4.1, sales: 180, featured: false, discount: 0, whatsapp: '0100111222' },
    // ===== CLOTHES - Mosky =====
    { id: 5, name: 'طرح حرير موسكي', price: 85, originalPrice: 150, description: 'طرح حرير طبيعي من منطقة الموسكي. ألوان زاهية وجودة عالية. مناسبة لجميع الأوقات.', shopName: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', subCategory: 'mosky', colors: ['أحمر', 'أصفر', 'أخضر', 'بنفسجي', 'وردي'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/E74C3C/FFFFFF?text=طرح+1', 'https://placehold.co/600x700/F39C12/FFFFFF?text=طرح+2', 'https://placehold.co/600x700/9B59B6/FFFFFF?text=طرح+3'
    ], rating: 4.4, sales: 560, featured: true, discount: 43, whatsapp: '0100222333' },
    { id: 6, name: 'قماش ستان دانتيل', price: 65, description: 'قماش ستان دانتيل عالي الجودة. مناسب لصناعة الفساتين والبلوزات. متوفر بالمتر.', shopName: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', subCategory: 'mosky', colors: ['أبيض', 'أسود', 'عاجي', 'وردي فاتح'], sizes: ['المتر'], images: [
      'https://placehold.co/600x700/ECF0F1/2C3E50?text=ستان+1', 'https://placehold.co/600x700/BDC3C7/2C3E50?text=ستان+2'
    ], rating: 4.0, sales: 890, featured: false, discount: 0, whatsapp: '0100222333' },
    { id: 7, name: 'أكسسوارات شعر موسكي', price: 25, description: 'مجموعة أكسسوارات شعر متنوعة. تيجان وبراويز وكبوش. مناسبة للأطفال والبنات.', shopName: 'الموسكي للأزياء', stall: 'B-22', phone: '0100222333', category: 'clothes', subCategory: 'mosky', colors: ['ذهبي', 'فضي', 'وردي', 'متعدد الألوان'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/F1C40F/2C3E50?text=اكسسوارات+1', 'https://placehold.co/600x700/BDC3C7/2C3E50?text=اكسسوارات+2'
    ], rating: 3.8, sales: 1200, featured: false, discount: 0, whatsapp: '0100222333' },
    // ===== CLOTHES - Gumruk =====
    { id: 8, name: 'شنطة يد جلد طبيعي', price: 550, originalPrice: 800, description: 'شنطة يد جلد طبيعي فاخر. مصنوعة يدوياً من أجود أنواع الجلود. تصميم كلاسيكي أنيق.', shopName: 'الجمرك للحقائب', stall: 'D-11', phone: '0100444555', category: 'clothes', subCategory: 'gumruk', colors: ['بني', 'أسود', 'كحلي'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/8B4513/FFFFFF?text=شنطة+1', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=شنطة+2', 'https://placehold.co/600x700/8B4513/FFFFFF?text=شنطة+3'
    ], rating: 4.6, sales: 95, featured: true, discount: 31, whatsapp: '0100444555' },
    { id: 9, name: 'محفظة رجالي جلد', price: 180, originalPrice: 250, description: 'محفظة رجالي جلد طبيعي. متعددة الجيوب. خفيفة وعملية.', shopName: 'الجمرك للحقائب', stall: 'D-11', phone: '0100444555', category: 'clothes', subCategory: 'gumruk', colors: ['أسود', 'بني', 'كحلي'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=محفظة+1', 'https://placehold.co/600x700/34495E/FFFFFF?text=محفظة+2'
    ], rating: 4.2, sales: 210, featured: false, discount: 28, whatsapp: '0100444555' },
    // ===== ELECTRONICS =====
    { id: 10, name: 'سماعة بلوتوث لاسلكية', price: 320, originalPrice: 500, description: 'سماعة بلوتوث لاسلكية عالية الجودة. صوت نقي وقوي. بطارية تدوم 12 ساعة. مع مايك مدمج.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'attaba', colors: ['أسود', 'أبيض', 'أزرق'], sizes: [], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=سماعة+1', 'https://placehold.co/600x700/ECF0F1/2C3E50?text=سماعة+2', 'https://placehold.co/600x700/3498DB/FFFFFF?text=سماعة+3', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=سماعة+4'
    ], rating: 4.7, sales: 450, featured: true, discount: 36, whatsapp: '0100333444' },
    { id: 11, name: 'محمول شاومي ريدمي نوت 12', price: 4500, originalPrice: 5500, description: 'محمول شاومي ريدمي نوت 12. شاشة 6.67 بوصة. كاميرا 50 ميجابكسل. بطارية 5000 مللي أمبير.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'attaba', colors: ['أسود', 'أزرق', 'ذهبي'], sizes: ['128 جيجا', '256 جيجا'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=شاومي+1', 'https://placehold.co/600x700/2980B9/FFFFFF?text=شاومي+2', 'https://placehold.co/600x700/F1C40F/2C3E50?text=شاومي+3'
    ], rating: 4.6, sales: 180, featured: true, discount: 18, whatsapp: '0100333444' },
    { id: 12, name: 'ساعة ذكية رياضية', price: 650, originalPrice: 950, description: 'ساعة ذكية رياضية متعددة الوظائف. قياس ضربات القلب وضغط الدم. مقاومة للماء.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'attaba', colors: ['أسود', 'أحمر', 'أزرق'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=ساعة+1', 'https://placehold.co/600x700/E74C3C/FFFFFF?text=ساعة+2', 'https://placehold.co/600x700/3498DB/FFFFFF?text=ساعة+3'
    ], rating: 4.3, sales: 310, featured: true, discount: 31, whatsapp: '0100333444' },
    { id: 13, name: 'بوربانك محمول 20000mAh', price: 250, description: 'بوربانك محمول سعة 20000 مللي أمبير. شحن سريع. منفذين USB. خفيف ومحمول.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'attaba', colors: ['أسود', 'أبيض'], sizes: [], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=بوربانك+1', 'https://placehold.co/600x700/ECF0F1/2C3E50?text=بوربانك+2'
    ], rating: 4.4, sales: 670, featured: false, discount: 0, whatsapp: '0100333444' },
    { id: 14, name: 'إسورة ذكية لياقة بدنية', price: 380, originalPrice: 550, description: 'إسورة ذكية لمتابعة اللياقة البدنية. قياس الخطوات والنوم والسعرات. مقاومة للماء.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'abdulaziz', colors: ['أسود', 'أزرق', 'وردي'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=اسورة+1', 'https://placehold.co/600x700/3498DB/FFFFFF?text=اسورة+2'
    ], rating: 4.1, sales: 280, featured: false, discount: 30, whatsapp: '0100333444' },
    { id: 15, name: 'سبيكر بلوتوث محمول', price: 220, description: 'سبيكر بلوتوث محمول بصوت عالي النقاء. بطارية تدوم 8 ساعات. مقاوم للماء.', shopName: 'عبد العزيز تك', stall: 'C-05', phone: '0100333444', category: 'electronics', subCategory: 'abdulaziz', colors: ['أسود', 'أحمر', 'أزرق'], sizes: [], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=سبيكر+1', 'https://placehold.co/600x700/E74C3C/FFFFFF?text=سبيكر+2'
    ], rating: 4.0, sales: 430, featured: false, discount: 0, whatsapp: '0100333444' },
    // ===== FOOTWEAR =====
    { id: 16, name: 'حذاء رياضي رجالي ماركة', price: 780, originalPrice: 1200, description: 'حذاء رياضي رجالي ماركة. نعل مريح لتقليل الام القدم. خفيف وجيد التهوية.', shopName: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', subCategory: 'attaba', colors: ['أسود', 'أبيض', 'أزرق'], sizes: ['39', '40', '41', '42', '43', '44', '45'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=حذاء+1', 'https://placehold.co/600x700/ECF0F1/2C3E50?text=حذاء+2', 'https://placehold.co/600x700/2980B9/FFFFFF?text=حذاء+3', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=حذاء+4'
    ], rating: 4.7, sales: 320, featured: true, discount: 35, whatsapp: '0100555666' },
    { id: 17, name: 'جزمة شتوية جلد', price: 650, originalPrice: 900, description: 'جزمة شتوية جلد طبيعي. دافئة ومبطنة من الداخل. نعل مطاطي مانع للانزلاق.', shopName: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', subCategory: 'attaba', colors: ['أسود', 'بني'], sizes: ['39', '40', '41', '42', '43', '44'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=جزمة+1', 'https://placehold.co/600x700/8B4513/FFFFFF?text=جزمة+2'
    ], rating: 4.5, sales: 150, featured: true, discount: 27, whatsapp: '0100555666' },
    { id: 18, name: 'صندل صيفي حريمي', price: 180, originalPrice: 280, description: 'صندل صيفي حريمي أنيق. كعب متوسط. مريح ومناسب للمشي.', shopName: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', subCategory: 'mosky', colors: ['أسود', 'بيج', 'ذهبي', 'فضي'], sizes: ['36', '37', '38', '39', '40', '41'], images: [
      'https://placehold.co/600x700/2C3E50/FFFFFF?text=صندل+1', 'https://placehold.co/600x700/D4AC0D/2C3E50?text=صندل+2', 'https://placehold.co/600x700/BDC3C7/2C3E50?text=صندل+3'
    ], rating: 4.0, sales: 430, featured: false, discount: 35, whatsapp: '0100555666' },
    { id: 19, name: 'شبشب منزلي قطيفة', price: 85, description: 'شبشب منزلي قطيفة ناعم. مريح ودافئ. متوفر بألوان متعددة.', shopName: 'الحذاء الذهبي', stall: 'E-30', phone: '0100555666', category: 'footwear', subCategory: 'mosky', colors: ['وردي', 'أزرق', 'بيج', 'رمادي'], sizes: ['36', '37', '38', '39', '40', '41', '42'], images: [
      'https://placehold.co/600x700/E91E63/FFFFFF?text=شبشب+1', 'https://placehold.co/600x700/9B59B6/FFFFFF?text=شبشب+2'
    ], rating: 3.9, sales: 610, featured: false, discount: 0, whatsapp: '0100555666' },
    // ===== HOUSEHOLD =====
    { id: 20, name: 'طقم حلل جرانيت 11 قطعة', price: 1450, originalPrice: 2200, description: 'طقم حلل جرانيت سيراميك عالي الجودة. 11 قطعة متنوعة. مانع للالتصاق. مناسب لجميع البوتاجازات.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'attaba', colors: ['أحمر', 'أسود', 'أخضر'], sizes: [], images: [
      'https://placehold.co/600x700/C0392B/FFFFFF?text=حلل+1', 'https://placehold.co/600x700/2C3E50/FFFFFF?text=حلل+2', 'https://placehold.co/600x700/27AE60/FFFFFF?text=حلل+3'
    ], rating: 4.8, sales: 200, featured: true, discount: 34, whatsapp: '0100666777' },
    { id: 21, name: 'طقم كاسات بلوري 12 قطعة', price: 250, originalPrice: 400, description: 'طقم كاسات بلوري شفاف فاخر. 12 قطعة. مناسب للعصائر والمشروبات.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'attaba', colors: ['شفاف'], sizes: [], images: [
      'https://placehold.co/600x700/ECF0F1/2C3E50?text=كاسات+1', 'https://placehold.co/600x700/BDC3C7/2C3E50?text=كاسات+2'
    ], rating: 4.3, sales: 340, featured: true, discount: 37, whatsapp: '0100666777' },
    { id: 22, name: 'مفارش سرير قطن 100%', price: 380, originalPrice: 550, description: 'مفارش سرير قطن مصري 100%. عالية النعومة. متوفر بمقاسات فردي ومزدوج وكينج.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'attaba', colors: ['أبيض', 'بيج', 'كحلي', 'رمادي', 'بنفسجي'], sizes: ['فردي', 'مزدوج', 'كينج'], images: [
      'https://placehold.co/600x700/ECF0F1/2C3E50?text=مفارش+1', 'https://placehold.co/600x700/34495E/FFFFFF?text=مفارش+2', 'https://placehold.co/600x700/9B59B6/FFFFFF?text=مفارش+3'
    ], rating: 4.6, sales: 270, featured: false, discount: 30, whatsapp: '0100666777' },
    { id: 23, name: 'طقم ملاعق وشوك ستانلس ستيل', price: 180, description: 'طقم ملاعق وشوك ستانلس ستيل 24 قطعة. لامع وعالي الجودة. مناسب للاستخدام اليومي.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'gumruk', colors: ['فضي', 'ذهبي'], sizes: [], images: [
      'https://placehold.co/600x700/BDC3C7/2C3E50?text=ملاعق+1', 'https://placehold.co/600x700/F1C40F/2C3E50?text=ملاعق+2'
    ], rating: 4.0, sales: 520, featured: false, discount: 0, whatsapp: '0100666777' },
    { id: 24, name: 'براد شاي زجاج بلوري', price: 120, description: 'براد شاي زجاج بلوري فاخر. سعة 1.5 لتر. مناسب للشاي البارد والساخن.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'gumruk', colors: ['شفاف'], sizes: [], images: [
      'https://placehold.co/600x700/ECF0F1/2C3E50?text=براد+1', 'https://placehold.co/600x700/BDC3C7/2C3E50?text=براد+2'
    ], rating: 4.1, sales: 390, featured: false, discount: 0, whatsapp: '0100666777' },
    { id: 25, name: 'سجادة صلاة قطيفة', price: 95, originalPrice: 150, description: 'سجادة صلاة قطيفة ناعمة. فاخرة ومريحة. متوفرة بتصاميم وألوان متعددة.', shopName: 'المنزل السعيد', stall: 'F-08', phone: '0100666777', category: 'household', subCategory: 'gumruk', colors: ['أحمر', 'أخضر', 'أزرق', 'بنفسجي', 'ذهبي'], sizes: ['مقاس واحد'], images: [
      'https://placehold.co/600x700/C0392B/FFFFFF?text=سجادة+1', 'https://placehold.co/600x700/27AE60/FFFFFF?text=سجادة+2', 'https://placehold.co/600x700/8E44AD/FFFFFF?text=سجادة+3'
    ], rating: 4.4, sales: 870, featured: false, discount: 36, whatsapp: '0100666777' },
  ],
  categories: [
    { id: 'clothes', name: 'الملابس', icon: 'fa-tshirt', color: '#C0392B', count: 50, image: 'https://placehold.co/300x200/C0392B/FFFFFF?text=الملابس', subcategories: [
      { id: 'attaba', name: 'مول العتبة الرئيسي', area: 'الدور الأول', shops: 25 },
      { id: 'mosky', name: 'منطقة الموسكي', area: 'شارع الموسكي', shops: 18 },
      { id: 'gumruk', name: 'شارع الجمرك', area: 'شارع الجمرك', shops: 12 },
    ]},
    { id: 'electronics', name: 'الإلكترونيات', icon: 'fa-mobile-alt', color: '#2980B9', count: 35, image: 'https://placehold.co/300x200/2980B9/FFFFFF?text=إلكترونيات', subcategories: [
      { id: 'attaba', name: 'مول العتبة الرئيسي', area: 'الدور الثاني', shops: 20 },
      { id: 'abdulaziz', name: 'شارع عبد العزيز', area: 'شارع عبد العزيز', shops: 15 },
    ]},
    { id: 'footwear', name: 'الأحذية', icon: 'fa-shoe-prints', color: '#E67E22', count: 28, image: 'https://placehold.co/300x200/E67E22/FFFFFF?text=أحذية', subcategories: [
      { id: 'attaba', name: 'مول العتبة الرئيسي', area: 'الدور الأرضي', shops: 15 },
      { id: 'mosky', name: 'منطقة الموسكي', area: 'شارع الموسكي', shops: 13 },
    ]},
    { id: 'household', name: 'أدوات المنزل', icon: 'fa-couch', color: '#27AE60', count: 40, image: 'https://placehold.co/300x200/27AE60/FFFFFF?text=منزل', subcategories: [
      { id: 'attaba', name: 'مول العتبة الرئيسي', area: 'الدور الثالث', shops: 22 },
      { id: 'gumruk', name: 'شارع الجمرك', area: 'شارع الجمرك', shops: 10 },
    ]},
  ],
  adminStats: {
    totalUsers: 1250,
    totalMerchants: 48,
    totalProducts: 2450,
    totalOrders: 8900,
    pendingVerifications: 7,
    monthlyRevenue: 285000,
    activeListings: 1890,
    reportsToday: 3,
  },
  adminMerchants: [
    { id: 1, name: 'العتبة للتجارة', owner: 'أحمد محمد', phone: '0100111222', email: 'ahmed@attaba.com', status: 'نشط', joinDate: '2022-03-15', products: 45, revenue: 125000 },
    { id: 2, name: 'الموسكي للأزياء', owner: 'محمود علي', phone: '0100222333', email: 'mahmoud@mosky.com', status: 'نشط', joinDate: '2021-11-20', products: 32, revenue: 89000 },
    { id: 3, name: 'عبد العزيز تك', owner: 'خالد حسن', phone: '0100333444', email: 'khalid@tech.com', status: 'نشط', joinDate: '2023-01-10', products: 58, revenue: 210000 },
    { id: 4, name: 'الجمرك للحقائب', owner: 'سارة أحمد', phone: '0100444555', email: 'sara@gumruk.com', status: 'معلق', joinDate: '2023-06-05', products: 12, revenue: 34000 },
    { id: 5, name: 'الحذاء الذهبي', owner: 'محمد كريم', phone: '0100555666', email: 'mohamed@golden.com', status: 'نشط', joinDate: '2022-08-22', products: 28, revenue: 156000 },
    { id: 6, name: 'المنزل السعيد', owner: 'نادية عمر', phone: '0100666777', email: 'nadia@happy.com', status: 'نشط', joinDate: '2023-04-18', products: 38, revenue: 98000 },
    { id: 7, name: 'الموبيليا العصرية', owner: 'كريم حسن', phone: '0100777888', email: 'kareem@modern.com', status: 'معلق', joinDate: '2024-01-15', products: 5, revenue: 12000 },
    { id: 8, name: 'أنوار الموسكي', owner: 'هند سعيد', phone: '0100888999', email: 'hend@anwar.com', status: 'مرفوض', joinDate: '2024-02-01', products: 0, revenue: 0 },
  ],
  dashboardOrders: [
    { id: 'ORD-1001', customer: 'أحمد عبد الله', items: 2, total: 830, status: 'تم التوصيل', date: '2026-05-08', payment: 'مدفوع', phone: '0100999111' },
    { id: 'ORD-1002', customer: 'مريم حسن', items: 1, total: 450, status: 'قيد التوصيل', date: '2026-05-09', payment: 'مدفوع', phone: '0100888222' },
    { id: 'ORD-1003', customer: 'علي محمد', items: 3, total: 1250, status: 'قيد المراجعة', date: '2026-05-09', payment: 'غير مدفوع', phone: '0100777333' },
    { id: 'ORD-1004', customer: 'فاطمة الزهراء', items: 1, total: 320, status: 'تم التوصيل', date: '2026-05-07', payment: 'مدفوع', phone: '0100666444' },
    { id: 'ORD-1005', customer: 'يوسف أحمد', items: 2, total: 780, status: 'ملغي', date: '2026-05-06', payment: 'مسترد', phone: '0100555555' },
    { id: 'ORD-1006', customer: 'نورا سامي', items: 4, total: 2150, status: 'قيد التوصيل', date: '2026-05-09', payment: 'مدفوع', phone: '0100444666' },
    { id: 'ORD-1007', customer: 'كريم عبد الرحمن', items: 1, total: 1200, status: 'قيد المراجعة', date: '2026-05-10', payment: 'غير مدفوع', phone: '0100333777' },
    { id: 'ORD-1008', customer: 'سارة إبراهيم', items: 2, total: 560, status: 'تم التوصيل', date: '2026-05-05', payment: 'مدفوع', phone: '0100222888' },
  ],
};
