// ============================================================
// دليل مصر - Egypt Business Directory
// Structured data ready for Supabase migration
// ============================================================

const EGYPT_DATA = {
  governorates: [
    {
      id: 1,
      name: 'القاهرة',
      districts: [
        {
          id: 101,
          name: 'وسط البلد',
          streets: [
            {
              id: 1001,
              name: 'شارع طلعت حرب',
              shops: [
                { id: 10001, name: 'سوبر ماركت طلعت', activity: 'سوبر ماركت', address: 'شارع طلعت حرب، تقاطع شارع محمد محمود', phone: '0100111222', whatsapp: '20100111222', locationLink: 'https://maps.google.com/?q=30.046,31.237', rating: 4.2 },
                { id: 10002, name: 'صيدلية النيل', activity: 'صيدلية', address: 'شارع طلعت حرب، بجوار البنك الأهلي', phone: '0100222333', whatsapp: '20100222333', locationLink: 'https://maps.google.com/?q=30.047,31.238', rating: 4.5 },
                { id: 10003, name: 'كافيه جراند', activity: 'كافيه', address: 'شارع طلعت حرب، فوق محل الملابس', phone: '0100333444', whatsapp: '20100333444', locationLink: 'https://maps.google.com/?q=30.0465,31.2375', rating: 4.0 }
              ]
            },
            {
              id: 1002,
              name: 'شارع محمد محمود',
              shops: [
                { id: 10004, name: 'مطعم كشري التحرير', activity: 'مطاعم', address: 'شارع محمد محمود، أمام كلية الهندسة', phone: '0100444555', whatsapp: '20100444555', locationLink: 'https://maps.google.com/?q=30.045,31.235', rating: 4.7 },
                { id: 10005, name: 'مكتبة النهضة', activity: 'مكتبات', address: 'شارع محمد محمود، تقاطع طلعت حرب', phone: '0100555666', whatsapp: '20100555666', locationLink: 'https://maps.google.com/?q=30.0455,31.236', rating: 4.3 }
              ]
            }
          ]
        },
        {
          id: 102,
          name: 'مدينة نصر',
          streets: [
            {
              id: 1003,
              name: 'شارع عباس العقاد',
              shops: [
                { id: 10006, name: 'مخبز عباس', activity: 'مخابز', address: 'شارع عباس العقاد، بجوار مسجد الرحمن', phone: '0100666777', whatsapp: '20100666777', locationLink: 'https://maps.google.com/?q=30.058,31.329', rating: 4.1 },
                { id: 10007, name: 'صيدلية العقاد', activity: 'صيدلية', address: 'شارع عباس العقاد، أمام مدرسة النصر', phone: '0100777888', whatsapp: '20100777888', locationLink: 'https://maps.google.com/?q=30.059,31.330', rating: 4.6 },
                { id: 10008, name: 'مطعم الباشا', activity: 'مطاعم', address: 'شارع عباس العقاد، بجوار سيتي ستارز', phone: '0100888999', whatsapp: '20100888999', locationLink: 'https://maps.google.com/?q=30.0585,31.3295', rating: 4.4 }
              ]
            },
            {
              id: 1004,
              name: 'شارع الطيران',
              shops: [
                { id: 10009, name: 'سوبر ماركت الطيران', activity: 'سوبر ماركت', address: 'شارع الطيران، مدينة نصر', phone: '0100999000', whatsapp: '20100999000', locationLink: 'https://maps.google.com/?q=30.060,31.325', rating: 4.0 },
                { id: 10010, name: 'حلواني الميريلاند', activity: 'حلواني', address: 'شارع الطيران، تقاطع عباس العقاد', phone: '0101000111', whatsapp: '20101000111', locationLink: 'https://maps.google.com/?q=30.061,31.326', rating: 4.8 }
              ]
            }
          ]
        },
        {
          id: 103,
          name: 'فيصل',
          streets: [
            {
              id: 1005,
              name: 'شارع فيصل الرئيسي',
              shops: [
                { id: 10011, name: 'مخبز البلح', activity: 'مخابز', address: 'شارع فيصل الرئيسي، أمام مسجد الرحمة', phone: '0101111222', whatsapp: '20101111222', locationLink: 'https://maps.google.com/?q=29.990,31.210', rating: 4.3 },
                { id: 10012, name: 'عطارة الهرم', activity: 'عطارة', address: 'شارع فيصل الرئيسي، بجوار سينما فيصل', phone: '0101222333', whatsapp: '20101222333', locationLink: 'https://maps.google.com/?q=29.991,31.211', rating: 4.1 }
              ]
            },
            {
              id: 1006,
              name: 'شارع الملك فيصل',
              shops: [
                { id: 10013, name: 'مطعم كشري فيصل', activity: 'مطاعم', address: 'شارع الملك فيصل، تقاطع الطريق الدائري', phone: '0101333444', whatsapp: '20101333444', locationLink: 'https://maps.google.com/?q=29.988,31.208', rating: 4.6 },
                { id: 10014, name: 'صيدلية فيصل', activity: 'صيدلية', address: 'شارع الملك فيصل، بجوار البنك', phone: '0101444555', whatsapp: '20101444555', locationLink: 'https://maps.google.com/?q=29.989,31.209', rating: 4.2 }
              ]
            }
          ]
        },
        {
          id: 104,
          name: 'مصر الجديدة',
          streets: [
            {
              id: 1007,
              name: 'شارع الحجاز',
              shops: [
                { id: 10015, name: 'سوبر ماركت الحجاز', activity: 'سوبر ماركت', address: 'شارع الحجاز، مصر الجديدة', phone: '0101555666', whatsapp: '20101555666', locationLink: 'https://maps.google.com/?q=30.085,31.345', rating: 4.4 },
                { id: 10016, name: 'مطعم ميرامار', activity: 'مطاعم', address: 'شارع الحجاز، بجوار الكنيسة', phone: '0101666777', whatsapp: '20101666777', locationLink: 'https://maps.google.com/?q=30.086,31.346', rating: 4.7 }
              ]
            },
            {
              id: 1008,
              name: 'شارع النزهة',
              shops: [
                { id: 10017, name: 'كافيه النزهة', activity: 'كافيه', address: 'شارع النزهة، تقاطع الحجاز', phone: '0101777888', whatsapp: '20101777888', locationLink: 'https://maps.google.com/?q=30.083,31.348', rating: 4.5 },
                { id: 10018, name: 'صيدلية النزهة', activity: 'صيدلية', address: 'شارع النزهة، بجوار المستشفى', phone: '0101888999', whatsapp: '20101888999', locationLink: 'https://maps.google.com/?q=30.084,31.349', rating: 4.0 }
              ]
            }
          ]
        },
        {
          id: 105,
          name: 'المهندسين',
          streets: [
            {
              id: 1009,
              name: 'شارع سوريا',
              shops: [
                { id: 10019, name: 'مطعم سوريا', activity: 'مطاعم', address: 'شارع سوريا، المهندسين', phone: '0101999000', whatsapp: '20101999000', locationLink: 'https://maps.google.com/?q=30.065,31.205', rating: 4.6 },
                { id: 10020, name: 'صيدلية دواء', activity: 'صيدلية', address: 'شارع سوريا، بجوار البنك', phone: '0102000111', whatsapp: '20102000111', locationLink: 'https://maps.google.com/?q=30.066,31.206', rating: 4.3 }
              ]
            },
            {
              id: 1010,
              name: 'شارع جامعة الدول العربية',
              shops: [
                { id: 10021, name: 'سوبر ماركت الجامعة', activity: 'سوبر ماركت', address: 'شارع جامعة الدول العربية، المهندسين', phone: '0102111222', whatsapp: '20102111222', locationLink: 'https://maps.google.com/?q=30.063,31.202', rating: 4.1 },
                { id: 10022, name: 'مكتبة المهندس', activity: 'مكتبات', address: 'شارع جامعة الدول العربية، تقاطع سوريا', phone: '0102222333', whatsapp: '20102222333', locationLink: 'https://maps.google.com/?q=30.064,31.203', rating: 4.4 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'الجيزة',
      districts: [
        {
          id: 201,
          name: 'الدقي',
          streets: [
            {
              id: 2001,
              name: 'شارع التحرير',
              shops: [
                { id: 20001, name: 'صيدلية الدقي', activity: 'صيدلية', address: 'شارع التحرير، الدقي', phone: '0102333444', whatsapp: '20102333444', locationLink: 'https://maps.google.com/?q=30.042,31.210', rating: 4.5 },
                { id: 20002, name: 'مخبز الدقي', activity: 'مخابز', address: 'شارع التحرير، تقاطع شارع الدقي', phone: '0102444555', whatsapp: '20102444555', locationLink: 'https://maps.google.com/?q=30.043,31.211', rating: 4.0 },
                { id: 20003, name: 'مطعم الذوق', activity: 'مطاعم', address: 'شارع التحرير، بجوار البنك الأهلي', phone: '0102555666', whatsapp: '20102555666', locationLink: 'https://maps.google.com/?q=30.0425,31.2105', rating: 4.3 }
              ]
            },
            {
              id: 2002,
              name: 'شارع مصدق',
              shops: [
                { id: 20004, name: 'كافيه مصدق', activity: 'كافيه', address: 'شارع مصدق، الدقي', phone: '0102666777', whatsapp: '20102666777', locationLink: 'https://maps.google.com/?q=30.040,31.215', rating: 4.6 },
                { id: 20005, name: 'سوبر ماركت مصدق', activity: 'سوبر ماركت', address: 'شارع مصدق، أمام الجامعة', phone: '0102777888', whatsapp: '20102777888', locationLink: 'https://maps.google.com/?q=30.041,31.216', rating: 4.1 }
              ]
            }
          ]
        },
        {
          id: 202,
          name: 'العجوزة',
          streets: [
            {
              id: 2003,
              name: 'شارع النيل',
              shops: [
                { id: 20006, name: 'مطعم النيل', activity: 'مطاعم', address: 'شارع النيل، العجوزة', phone: '0102888999', whatsapp: '20102888999', locationLink: 'https://maps.google.com/?q=30.048,31.218', rating: 4.8 },
                { id: 20007, name: 'صيدلية العجوزة', activity: 'صيدلية', address: 'شارع النيل، بجوار كوبري الجامعة', phone: '0102999000', whatsapp: '20102999000', locationLink: 'https://maps.google.com/?q=30.049,31.219', rating: 4.2 }
              ]
            },
            {
              id: 2004,
              name: 'شارع أحمد عرابي',
              shops: [
                { id: 20008, name: 'حلواني عرابي', activity: 'حلواني', address: 'شارع أحمد عرابي، العجوزة', phone: '0103000111', whatsapp: '20103000111', locationLink: 'https://maps.google.com/?q=30.051,31.222', rating: 4.4 },
                { id: 20009, name: 'مكتبة العجوزة', activity: 'مكتبات', address: 'شارع أحمد عرابي، تقاطع النيل', phone: '0103111222', whatsapp: '20103111222', locationLink: 'https://maps.google.com/?q=30.052,31.223', rating: 4.0 }
              ]
            }
          ]
        },
        {
          id: 203,
          name: 'الهرم',
          streets: [
            {
              id: 2005,
              name: 'شارع الهرم',
              shops: [
                { id: 20010, name: 'سوبر ماركت الهرم', activity: 'سوبر ماركت', address: 'شارع الهرم، بجوار أهرامات الجيزة', phone: '0103222333', whatsapp: '20103222333', locationLink: 'https://maps.google.com/?q=29.978,31.128', rating: 4.2 },
                { id: 20011, name: 'مطعم الفراعنة', activity: 'مطاعم', address: 'شارع الهرم، أمام المنطقة السياحية', phone: '0103333444', whatsapp: '20103333444', locationLink: 'https://maps.google.com/?q=29.979,31.129', rating: 4.5 },
                { id: 20012, name: 'عطارة الهرم', activity: 'عطارة', address: 'شارع الهرم، بجوار مسجد الرماح', phone: '0103444555', whatsapp: '20103444555', locationLink: 'https://maps.google.com/?q=29.9785,31.1285', rating: 4.1 }
              ]
            },
            {
              id: 2006,
              name: 'شارع المريوطية',
              shops: [
                { id: 20013, name: 'مخبز المريوطية', activity: 'مخابز', address: 'شارع المريوطية، الهرم', phone: '0103555666', whatsapp: '20103555666', locationLink: 'https://maps.google.com/?q=29.974,31.120', rating: 4.3 },
                { id: 20014, name: 'صيدلية الهرم الجديدة', activity: 'صيدلية', address: 'شارع المريوطية، تقاطع الهرم', phone: '0103666777', whatsapp: '20103666777', locationLink: 'https://maps.google.com/?q=29.975,31.121', rating: 4.6 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'الإسكندرية',
      districts: [
        {
          id: 301,
          name: 'محطة الرمل',
          streets: [
            {
              id: 3001,
              name: 'شارع سعد زغلول',
              shops: [
                { id: 30001, name: 'مقهى سعد زغلول', activity: 'كافيه', address: 'شارع سعد زغلول، محطة الرمل', phone: '0103777888', whatsapp: '20103777888', locationLink: 'https://maps.google.com/?q=31.196,29.898', rating: 4.4 },
                { id: 30002, name: 'صيدلية الرمل', activity: 'صيدلية', address: 'شارع سعد زغلول، بجوار المحطة', phone: '0103888999', whatsapp: '20103888999', locationLink: 'https://maps.google.com/?q=31.197,29.899', rating: 4.7 },
                { id: 30003, name: 'سوبر ماركت الرمل', activity: 'سوبر ماركت', address: 'شارع سعد زغلول، تقاطع شارع النصر', phone: '0103999000', whatsapp: '20103999000', locationLink: 'https://maps.google.com/?q=31.1965,29.8985', rating: 4.0 }
              ]
            },
            {
              id: 3002,
              name: 'كورنيش البحر',
              shops: [
                { id: 30004, name: 'مطعم السمك الطازج', activity: 'مطاعم', address: 'كورنيش البحر، محطة الرمل', phone: '0104000111', whatsapp: '20104000111', locationLink: 'https://maps.google.com/?q=31.202,29.903', rating: 4.9 },
                { id: 30005, name: 'كافيه الكورنيش', activity: 'كافيه', address: 'كورنيش البحر، بجوار مكتبة الإسكندرية', phone: '0104111222', whatsapp: '20104111222', locationLink: 'https://maps.google.com/?q=31.208,29.909', rating: 4.6 }
              ]
            }
          ]
        },
        {
          id: 302,
          name: 'سيدي جابر',
          streets: [
            {
              id: 3003,
              name: 'شارع النصر',
              shops: [
                { id: 30006, name: 'مخبز سيدي جابر', activity: 'مخابز', address: 'شارع النصر، سيدي جابر', phone: '0104222333', whatsapp: '20104222333', locationLink: 'https://maps.google.com/?q=31.220,29.920', rating: 4.2 },
                { id: 30007, name: 'صيدلية الإسكندرية', activity: 'صيدلية', address: 'شارع النصر، بجوار محطة سيدي جابر', phone: '0104333444', whatsapp: '20104333444', locationLink: 'https://maps.google.com/?q=31.221,29.921', rating: 4.5 }
              ]
            },
            {
              id: 3004,
              name: 'شارع فريد',
              shops: [
                { id: 30008, name: 'مطعم فريد', activity: 'مطاعم', address: 'شارع فريد، سيدي جابر', phone: '0104444555', whatsapp: '20104444555', locationLink: 'https://maps.google.com/?q=31.218,29.918', rating: 4.3 },
                { id: 30009, name: 'حلواني سيدي جابر', activity: 'حلواني', address: 'شارع فريد، تقاطع النصر', phone: '0104555666', whatsapp: '20104555666', locationLink: 'https://maps.google.com/?q=31.219,29.919', rating: 4.7 }
              ]
            }
          ]
        },
        {
          id: 303,
          name: 'العجمي',
          streets: [
            {
              id: 3005,
              name: 'شارع البيطاش',
              shops: [
                { id: 30010, name: 'مطعم البيطاش', activity: 'مطاعم', address: 'شارع البيطاش، العجمي', phone: '0104666777', whatsapp: '20104666777', locationLink: 'https://maps.google.com/?q=31.138,29.813', rating: 4.4 },
                { id: 30011, name: 'سوبر ماركت العجمي', activity: 'سوبر ماركت', address: 'شارع البيطاش، بجوار الشاطئ', phone: '0104777888', whatsapp: '20104777888', locationLink: 'https://maps.google.com/?q=31.139,29.814', rating: 4.1 }
              ]
            },
            {
              id: 3006,
              name: 'شارع الصفا',
              shops: [
                { id: 30012, name: 'كافيه الصفا', activity: 'كافيه', address: 'شارع الصفا، العجمي', phone: '0104888999', whatsapp: '20104888999', locationLink: 'https://maps.google.com/?q=31.135,29.810', rating: 4.5 },
                { id: 30013, name: 'صيدلية العجمي', activity: 'صيدلية', address: 'شارع الصفا، تقاطع البيطاش', phone: '0104999000', whatsapp: '20104999000', locationLink: 'https://maps.google.com/?q=31.136,29.811', rating: 4.3 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'الدقهلية',
      districts: [
        {
          id: 401,
          name: 'المنصورة',
          streets: [
            {
              id: 4001,
              name: 'شارع الجيش',
              shops: [
                { id: 40001, name: 'سوبر ماركت المنصورة', activity: 'سوبر ماركت', address: 'شارع الجيش، المنصورة', phone: '0105000111', whatsapp: '20105000111', locationLink: 'https://maps.google.com/?q=31.040,31.380', rating: 4.3 },
                { id: 40002, name: 'صيدلية المنصورة', activity: 'صيدلية', address: 'شارع الجيش، بجوار المسجد', phone: '0105111222', whatsapp: '20105111222', locationLink: 'https://maps.google.com/?q=31.041,31.381', rating: 4.6 }
              ]
            },
            {
              id: 4002,
              name: 'شارع سعد زغلول',
              shops: [
                { id: 40003, name: 'مطعم كشري المنصورة', activity: 'مطاعم', address: 'شارع سعد زغلول، المنصورة', phone: '0105222333', whatsapp: '20105222333', locationLink: 'https://maps.google.com/?q=31.038,31.378', rating: 4.5 },
                { id: 40004, name: 'مخبز المنصورة', activity: 'مخابز', address: 'شارع سعد زغلول، تقاطع الجيش', phone: '0105333444', whatsapp: '20105333444', locationLink: 'https://maps.google.com/?q=31.039,31.379', rating: 4.0 }
              ]
            }
          ]
        },
        {
          id: 402,
          name: 'طلخا',
          streets: [
            {
              id: 4003,
              name: 'شارع الجمهورية',
              shops: [
                { id: 40005, name: 'صيدلية طلخا', activity: 'صيدلية', address: 'شارع الجمهورية، طلخا', phone: '0105444555', whatsapp: '20105444555', locationLink: 'https://maps.google.com/?q=31.056,31.359', rating: 4.1 },
                { id: 40006, name: 'مطعم طلخا', activity: 'مطاعم', address: 'شارع الجمهورية، بجوار البنك', phone: '0105555666', whatsapp: '20105555666', locationLink: 'https://maps.google.com/?q=31.057,31.360', rating: 4.3 }
              ]
            },
            {
              id: 4004,
              name: 'شارع النحاس',
              shops: [
                { id: 40007, name: 'سوبر ماركت النحاس', activity: 'سوبر ماركت', address: 'شارع النحاس، طلخا', phone: '0105666777', whatsapp: '20105666777', locationLink: 'https://maps.google.com/?q=31.054,31.357', rating: 4.2 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'الشرقية',
      districts: [
        {
          id: 501,
          name: 'الزقازيق',
          streets: [
            {
              id: 5001,
              name: 'شارع فاروق',
              shops: [
                { id: 50001, name: 'صيدلية الزقازيق', activity: 'صيدلية', address: 'شارع فاروق، الزقازيق', phone: '0105777888', whatsapp: '20105777888', locationLink: 'https://maps.google.com/?q=30.565,31.502', rating: 4.4 },
                { id: 50002, name: 'مخبز الزقازيق', activity: 'مخابز', address: 'شارع فاروق، بجوار المحكمة', phone: '0105888999', whatsapp: '20105888999', locationLink: 'https://maps.google.com/?q=30.566,31.503', rating: 4.1 }
              ]
            },
            {
              id: 5002,
              name: 'شارع أحمد عرابي',
              shops: [
                { id: 50003, name: 'سوبر ماركت الشرقية', activity: 'سوبر ماركت', address: 'شارع أحمد عرابي، الزقازيق', phone: '0105999000', whatsapp: '20105999000', locationLink: 'https://maps.google.com/?q=30.563,31.500', rating: 4.3 },
                { id: 50004, name: 'مطعم الشرقية', activity: 'مطاعم', address: 'شارع أحمد عرابي، تقاطع فاروق', phone: '0106000111', whatsapp: '20106000111', locationLink: 'https://maps.google.com/?q=30.564,31.501', rating: 4.6 }
              ]
            }
          ]
        },
        {
          id: 502,
          name: 'بلبيس',
          streets: [
            {
              id: 5003,
              name: 'شارع الجمهورية',
              shops: [
                { id: 50005, name: 'صيدلية بلبيس', activity: 'صيدلية', address: 'شارع الجمهورية، بلبيس', phone: '0106111222', whatsapp: '20106111222', locationLink: 'https://maps.google.com/?q=30.420,31.560', rating: 4.2 },
                { id: 50006, name: 'مطعم بلبيس', activity: 'مطاعم', address: 'شارع الجمهورية، بجوار المسجد', phone: '0106222333', whatsapp: '20106222333', locationLink: 'https://maps.google.com/?q=30.421,31.561', rating: 4.0 }
              ]
            },
            {
              id: 5004,
              name: 'شارع الثورة',
              shops: [
                { id: 50007, name: 'مخبز بلبيس', activity: 'مخابز', address: 'شارع الثورة، بلبيس', phone: '0106333444', whatsapp: '20106333444', locationLink: 'https://maps.google.com/?q=30.418,31.558', rating: 4.5 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'القليوبية',
      districts: [
        {
          id: 601,
          name: 'شبرا الخيمة',
          streets: [
            {
              id: 6001,
              name: 'شارع أحمد حلمي',
              shops: [
                { id: 60001, name: 'سوبر ماركت شبرا', activity: 'سوبر ماركت', address: 'شارع أحمد حلمي، شبرا الخيمة', phone: '0106444555', whatsapp: '20106444555', locationLink: 'https://maps.google.com/?q=30.128,31.253', rating: 4.0 },
                { id: 60002, name: 'صيدلية شبرا', activity: 'صيدلية', address: 'شارع أحمد حلمي، بجوار الموقف', phone: '0106555666', whatsapp: '20106555666', locationLink: 'https://maps.google.com/?q=30.129,31.254', rating: 4.3 }
              ]
            },
            {
              id: 6002,
              name: 'شارع السكة الجديدة',
              shops: [
                { id: 60003, name: 'مطعم شبرا', activity: 'مطاعم', address: 'شارع السكة الجديدة، شبرا الخيمة', phone: '0106666777', whatsapp: '20106666777', locationLink: 'https://maps.google.com/?q=30.125,31.250', rating: 4.2 },
                { id: 60004, name: 'مخبز شبرا', activity: 'مخابز', address: 'شارع السكة الجديدة، تقاطع أحمد حلمي', phone: '0106777888', whatsapp: '20106777888', locationLink: 'https://maps.google.com/?q=30.126,31.251', rating: 4.4 }
              ]
            }
          ]
        },
        {
          id: 602,
          name: 'بنها',
          streets: [
            {
              id: 6003,
              name: 'شارع سعد زغلول',
              shops: [
                { id: 60005, name: 'صيدلية بنها الجديدة', activity: 'صيدلية', address: 'شارع سعد زغلول، بنها', phone: '0106888999', whatsapp: '20106888999', locationLink: 'https://maps.google.com/?q=30.462,31.186', rating: 4.6 },
                { id: 60006, name: 'مطعم كشري بنها', activity: 'مطاعم', address: 'شارع سعد زغلول، بجوار المحطة', phone: '0106999000', whatsapp: '20106999000', locationLink: 'https://maps.google.com/?q=30.463,31.187', rating: 4.5 }
              ]
            },
            {
              id: 6004,
              name: 'شارع الحرية',
              shops: [
                { id: 60007, name: 'سوبر ماركت بنها', activity: 'سوبر ماركت', address: 'شارع الحرية، بنها', phone: '0107000111', whatsapp: '20107000111', locationLink: 'https://maps.google.com/?q=30.460,31.184', rating: 4.1 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'الغربية',
      districts: [
        {
          id: 701,
          name: 'طنطا',
          streets: [
            {
              id: 7001,
              name: 'شارع البورصة',
              shops: [
                { id: 70001, name: 'صيدلية طنطا', activity: 'صيدلية', address: 'شارع البورصة، طنطا', phone: '0107111222', whatsapp: '20107111222', locationLink: 'https://maps.google.com/?q=30.786,31.000', rating: 4.3 },
                { id: 70002, name: 'مخبز طنطا', activity: 'مخابز', address: 'شارع البورصة، بجوار المسجد', phone: '0107222333', whatsapp: '20107222333', locationLink: 'https://maps.google.com/?q=30.787,31.001', rating: 4.0 }
              ]
            },
            {
              id: 7002,
              name: 'شارع الجيش',
              shops: [
                { id: 70003, name: 'مطعم طنطا', activity: 'مطاعم', address: 'شارع الجيش، طنطا', phone: '0107333444', whatsapp: '20107333444', locationLink: 'https://maps.google.com/?q=30.784,30.998', rating: 4.4 },
                { id: 70004, name: 'سوبر ماركت طنطا', activity: 'سوبر ماركت', address: 'شارع الجيش، تقاطع البورصة', phone: '0107444555', whatsapp: '20107444555', locationLink: 'https://maps.google.com/?q=30.785,30.999', rating: 4.2 }
              ]
            }
          ]
        },
        {
          id: 702,
          name: 'المحلة الكبرى',
          streets: [
            {
              id: 7003,
              name: 'شارع البحر',
              shops: [
                { id: 70005, name: 'صيدلية المحلة', activity: 'صيدلية', address: 'شارع البحر، المحلة الكبرى', phone: '0107555666', whatsapp: '20107555666', locationLink: 'https://maps.google.com/?q=30.972,31.161', rating: 4.5 },
                { id: 70006, name: 'مطعم المحلة', activity: 'مطاعم', address: 'شارع البحر، بجوار النادي', phone: '0107666777', whatsapp: '20107666777', locationLink: 'https://maps.google.com/?q=30.973,31.162', rating: 4.1 }
              ]
            },
            {
              id: 7004,
              name: 'شارع شكري',
              shops: [
                { id: 70007, name: 'سوبر ماركت المحلة', activity: 'سوبر ماركت', address: 'شارع شكري، المحلة الكبرى', phone: '0107777888', whatsapp: '20107777888', locationLink: 'https://maps.google.com/?q=30.970,31.159', rating: 4.3 },
                { id: 70008, name: 'مخبز المحلة', activity: 'مخابز', address: 'شارع شكري، تقاطع البحر', phone: '0107888999', whatsapp: '20107888999', locationLink: 'https://maps.google.com/?q=30.971,31.160', rating: 4.6 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'المنوفية',
      districts: [
        {
          id: 801,
          name: 'شبين الكوم',
          streets: [
            {
              id: 8001,
              name: 'شارع جمال عبد الناصر',
              shops: [
                { id: 80001, name: 'صيدلية شبين', activity: 'صيدلية', address: 'شارع جمال عبد الناصر، شبين الكوم', phone: '0107999000', whatsapp: '20107999000', locationLink: 'https://maps.google.com/?q=30.550,31.010', rating: 4.2 },
                { id: 80002, name: 'مخبز شبين', activity: 'مخابز', address: 'شارع جمال عبد الناصر، بجوار الجامعة', phone: '0108000111', whatsapp: '20108000111', locationLink: 'https://maps.google.com/?q=30.551,31.011', rating: 4.4 }
              ]
            },
            {
              id: 8002,
              name: 'شارع الكفاح',
              shops: [
                { id: 80003, name: 'مطعم شبين', activity: 'مطاعم', address: 'شارع الكفاح، شبين الكوم', phone: '0108111222', whatsapp: '20108111222', locationLink: 'https://maps.google.com/?q=30.548,31.008', rating: 4.1 },
                { id: 80004, name: 'سوبر ماركت شبين', activity: 'سوبر ماركت', address: 'شارع الكفاح، تقاطع جمال عبد الناصر', phone: '0108222333', whatsapp: '20108222333', locationLink: 'https://maps.google.com/?q=30.549,31.009', rating: 4.5 }
              ]
            }
          ]
        },
        {
          id: 802,
          name: 'منوف',
          streets: [
            {
              id: 8003,
              name: 'شارع الجلاء',
              shops: [
                { id: 80005, name: 'صيدلية منوف', activity: 'صيدلية', address: 'شارع الجلاء، منوف', phone: '0108333444', whatsapp: '20108333444', locationLink: 'https://maps.google.com/?q=30.464,30.926', rating: 4.3 },
                { id: 80006, name: 'مطعم منوف', activity: 'مطاعم', address: 'شارع الجلاء، بجوار المحطة', phone: '0108444555', whatsapp: '20108444555', locationLink: 'https://maps.google.com/?q=30.465,30.927', rating: 4.0 }
              ]
            },
            {
              id: 8004,
              name: 'شارع السوق',
              shops: [
                { id: 80007, name: 'سوبر ماركت منوف', activity: 'سوبر ماركت', address: 'شارع السوق، منوف', phone: '0108555666', whatsapp: '20108555666', locationLink: 'https://maps.google.com/?q=30.462,30.924', rating: 4.2 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 9,
      name: 'البحيرة',
      districts: [
        {
          id: 901,
          name: 'دمنهور',
          streets: [
            {
              id: 9001,
              name: 'شارع القومية',
              shops: [
                { id: 90001, name: 'صيدلية دمنهور', activity: 'صيدلية', address: 'شارع القومية، دمنهور', phone: '0108666777', whatsapp: '20108666777', locationLink: 'https://maps.google.com/?q=31.030,30.470', rating: 4.5 },
                { id: 90002, name: 'مخبز دمنهور', activity: 'مخابز', address: 'شارع القومية، بجوار البنك', phone: '0108777888', whatsapp: '20108777888', locationLink: 'https://maps.google.com/?q=31.031,30.471', rating: 4.1 }
              ]
            },
            {
              id: 9002,
              name: 'شارع الجمهورية',
              shops: [
                { id: 90003, name: 'مطعم دمنهور', activity: 'مطاعم', address: 'شارع الجمهورية، دمنهور', phone: '0108888999', whatsapp: '20108888999', locationLink: 'https://maps.google.com/?q=31.028,30.468', rating: 4.3 },
                { id: 90004, name: 'سوبر ماركت دمنهور', activity: 'سوبر ماركت', address: 'شارع الجمهورية، تقاطع القومية', phone: '0108999000', whatsapp: '20108999000', locationLink: 'https://maps.google.com/?q=31.029,30.469', rating: 4.6 }
              ]
            }
          ]
        },
        {
          id: 902,
          name: 'كفر الدوار',
          streets: [
            {
              id: 9003,
              name: 'شارع الثورة',
              shops: [
                { id: 90005, name: 'صيدلية كفر الدوار', activity: 'صيدلية', address: 'شارع الثورة، كفر الدوار', phone: '0109000111', whatsapp: '20109000111', locationLink: 'https://maps.google.com/?q=31.030,30.420', rating: 4.0 },
                { id: 90006, name: 'مخبز كفر الدوار', activity: 'مخابز', address: 'شارع الثورة، بجوار المسجد', phone: '0109111222', whatsapp: '20109111222', locationLink: 'https://maps.google.com/?q=31.031,30.421', rating: 4.4 }
              ]
            },
            {
              id: 9004,
              name: 'شارع النيل',
              shops: [
                { id: 90007, name: 'مطعم كفر الدوار', activity: 'مطاعم', address: 'شارع النيل، كفر الدوار', phone: '0109222333', whatsapp: '20109222333', locationLink: 'https://maps.google.com/?q=31.028,30.418', rating: 4.2 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'بورسعيد',
      districts: [
        {
          id: 1001,
          name: 'بورسعيد',
          streets: [
            {
              id: 10001,
              name: 'شارع فلسطين',
              shops: [
                { id: 100001, name: 'صيدلية بورسعيد', activity: 'صيدلية', address: 'شارع فلسطين، بورسعيد', phone: '0109333444', whatsapp: '20109333444', locationLink: 'https://maps.google.com/?q=31.256,32.309', rating: 4.6 },
                { id: 100002, name: 'مطعم بورسعيد', activity: 'مطاعم', address: 'شارع فلسطين، بجوار الشاطئ', phone: '0109444555', whatsapp: '20109444555', locationLink: 'https://maps.google.com/?q=31.257,32.310', rating: 4.8 },
                { id: 100003, name: 'سوبر ماركت بورسعيد', activity: 'سوبر ماركت', address: 'شارع فلسطين، تقاطع محمد علي', phone: '0109555666', whatsapp: '20109555666', locationLink: 'https://maps.google.com/?q=31.2565,32.3095', rating: 4.2 }
              ]
            },
            {
              id: 10002,
              name: 'شارع محمد علي',
              shops: [
                { id: 100004, name: 'مخبز بورسعيد', activity: 'مخابز', address: 'شارع محمد علي، بورسعيد', phone: '0109666777', whatsapp: '20109666777', locationLink: 'https://maps.google.com/?q=31.254,32.307', rating: 4.3 },
                { id: 100005, name: 'كافيه بورسعيد', activity: 'كافيه', address: 'شارع محمد علي، بجوار الكنيسة', phone: '0109777888', whatsapp: '20109777888', locationLink: 'https://maps.google.com/?q=31.255,32.308', rating: 4.5 }
              ]
            }
          ]
        },
        {
          id: 1002,
          name: 'بورفؤاد',
          streets: [
            {
              id: 10003,
              name: 'شارع السويس',
              shops: [
                { id: 100006, name: 'صيدلية بورفؤاد', activity: 'صيدلية', address: 'شارع السويس، بورفؤاد', phone: '0109888999', whatsapp: '20109888999', locationLink: 'https://maps.google.com/?q=31.238,32.330', rating: 4.1 },
                { id: 100007, name: 'مطعم بورفؤاد', activity: 'مطاعم', address: 'شارع السويس، تقاطع القناة', phone: '0109999000', whatsapp: '20109999000', locationLink: 'https://maps.google.com/?q=31.239,32.331', rating: 4.4 }
              ]
            },
            {
              id: 10004,
              name: 'شارع القناة',
              shops: [
                { id: 100008, name: 'سوبر ماركت بورفؤاد', activity: 'سوبر ماركت', address: 'شارع القناة، بورفؤاد', phone: '0101000100', whatsapp: '20101000100', locationLink: 'https://maps.google.com/?q=31.236,32.328', rating: 4.3 }
              ]
            }
          ]
        }
      ]
    }
  ]
};
