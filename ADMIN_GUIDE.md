# Liora Store Admin Dashboard Guide

## نظرة عامة

تم إنشاء نظام Admin Dashboard احترافي لموقع Liora Store مع نظام صلاحيات متعدد المستويات.

---

## الدخول للوحة التحكم

### الطريقة 1: من حساب المستخدم
1. سجل الدخول بحسابك في Liora Store
2. اضغط على Avatar المستخدم في الـ Navbar
3. إذا كان لديك صلاحية Admin، سيظهر خيار "لوحة التحكم"
4. اضغط عليه للدخول

### الطريقة 2: مباشرة عبر URL
1. افتح المتصفح واذهب إلى: `http://localhost:5173/#admin`
2. إذا كان لديك صلاحية Admin، سيتم نقلك للوحة التحكم
3. إذا لم يكن لديك صلاحية، سيتم إرجاعك للصفحة الرئيسية

---

## الأدوار والصلاحيات

### 1. User (مستخدم عادي)
- **الصلاحيات**: لا يوجد
- **الوصول**: لا يمكن الدخول للوحة التحكم

### 2. Support (دعم فني)
- **الصلاحيات**:
  - عرض الطلبات
  - عرض المستخدمين
  - إرسال الإشعارات
- **الوصول**: لوحة التحكم (صفحات محدودة)

### 3. Admin (أدمن)
- **الصلاحيات**:
  - إدارة المنتجات (إضافة، تعديل، حذف)
  - إدارة الطلبات
  - إدارة المستخدمين
  - إدارة الفئات
  - إدارة الكوبونات
  - إدارة التقييمات
  - إرسال الإشعارات
  - عرض التحليلات
- **الوصول**: لوحة التحكم الكاملة (باستثناء إدارة الأدمنز)

### 4. Super Admin (أدمن رئيسي)
- **الصلاحيات**: كل الصلاحيات + إدارة الأدمنز
- **الوصول**: لوحة التحكم الكاملة + إدارة الأدمنز

---

## إنشاء أول Super Admin

لإنشاء أول Super Admin، اتبع الخطوات التالية:

### 1. إنشاء حساب Firebase
1. ادخل على [Firebase Console](https://console.firebase.google.com/)
2. افتح مشروع `liora-store-2027`
3. اذهب إلى Authentication
4. اضغط "Add user"
5. أدخل البريد الإلكتروني وكلمة المرور
6. اضغط "Add user"

### 2. إضافة Role في Firestore
1. اذهب إلى Firestore Database
2. افتح collection `users`
3. ابحث عن المستخدم الجديد باستخدام UID
4. أضف الحقل التالي:
```json
{
  "role": "super_admin"
}
```

### 3. تحديث Display Name (اختياري)
في نفس المستند، يمكنك إضافة:
```json
{
  "name": "Liora Admin — HaMo",
  "username": "hamo_admin"
}
```

---

## إضافة Admin جديد

### من قبل Super Admin

1. سجل الدخول كـ Super Admin
2. اذهب إلى "إدارة الأدمنز" في لوحة التحكم
3. اضغط "إضافة أدمن"
4. أدخل بيانات الأدمن الجديد
5. اختر الدور (Admin أو Super Admin)
6. اضغط "حفظ"

### يدوياً في Firestore

1. أنشئ حساب Firebase للمستخدم الجديد
2. في Firestore، أضف المستخدم في collection `users`:
```json
{
  "uid": "USER_UID",
  "email": "admin@example.com",
  "username": "admin_name",
  "name": "Admin Name",
  "role": "admin",
  "createdAt": "...",
  "phone": "...",
  "countryCode": "..."
}
```

---

## تطبيق Firestore Security Rules

لتطبيق قواعد الأمان الجديدة:

### الطريقة 1: من Firebase Console
1. اذهب إلى [Firestore Database](https://console.firebase.google.com/)
2. اضغط على "Rules" tab
3. انسخ محتوى ملف `firestore.rules` في المشروع
4. الصقه في المحرر
5. اضغط "Publish"

### الطريقة 2: باستخدام Firebase CLI
```bash
firebase deploy --only firestore:rules
```

---

## Collections في Firestore

### الموجودة حالياً:
- `users` - بيانات المستخدمين
- `usernames` - للبحث عن المستخدمين

### الجديدة (للـAdmin):
- `products` - المنتجات
- `orders` - الطلبات
- `categories` - الفئات
- `coupons` - الكوبونات
- `reviews` - التقييمات
- `notifications` - الإشعارات
- `analytics` - التحليلات (اختياري)

---

## صفحات لوحة التحكم

### 1. الرئيسية (Dashboard)
- إحصائيات سريعة (مبيعات، طلبات، مستخدمين، منتجات)
- رسوم بيانية
- آخر الطلبات
- أكثر المنتجات مبيعاً

### 2. المنتجات (Products)
- عرض جميع المنتجات
- إضافة منتج جديد
- تعديل منتج
- حذف منتج
- بحث وتصفية

### 3. الطلبات (Orders)
- عرض جميع الطلبات
- عرض تفاصيل الطلب
- تغيير حالة الطلب
- تصفية حسب الحالة

### 4. المستخدمين (Users)
- عرض جميع المستخدمين
- عرض بيانات المستخدم
- تصفية حسب الدور

### 5. الإشعارات (Notifications)
- إرسال إشعار لجميع المستخدمين
- إرسال إشعار لمستخدم محدد
- أنواع الإشعارات (معلومات، عرض خاص، تنبيه)

### 6. الفئات (Categories)
- إضافة فئة جديدة
- تعديل فئة
- حذف فئة

### 7. الكوبونات (Coupons)
- إنشاء كوبون جديد
- تعديل كوبون
- حذف كوبون
- تفعيل/تعطيل كوبون

### 8. التقييمات (Reviews)
- عرض جميع التقييمات
- حذف تقييم غير مناسب

### 9. التحليلات (Analytics)
- إحصائيات المبيعات
- أكثر المنتجات مبيعاً
- أفضل الفئات
- نمو المستخدمين

### 10. الإعدادات (Settings)
- معلومات حساب الأدمن
- تغيير كلمة المرور
- تسجيل الخروج

### 11. إدارة الأدمنز (Admin Management) - Super Admin فقط
- عرض جميع الأدمنز
- إضافة أدمن جديد
- تغيير دور الأدمن
- حذف صلاحية الأدمن

---

## هيكل المشروع

```
src/
├── components/
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminOrders.jsx
│       ├── AdminUsers.jsx
│       ├── AdminNotifications.jsx
│       ├── AdminCategories.jsx
│       ├── AdminCoupons.jsx
│       ├── AdminReviews.jsx
│       ├── AdminAnalytics.jsx
│       ├── AdminSettings.jsx
│       └── AdminManagement.jsx
├── context/
│   ├── AdminContext.jsx
│   └── AuthContext.jsx
└── App.jsx
```

---

## مميزات التصميم

- RTL العربية بالكامل
- Cairo Font
- Dark Mode افتراضي
- Responsive (Mobile, Tablet, Desktop)
- تصميم متوافق مع Liora Store
- Sidebar قابل للطي في Mobile
- Animations ناعمة
- نفس ألوان Brand

---

## الأمان

### حمايةRoutes
- لا يمكن للمستخدم العادي الدخول للوحة التحكم
- محاولة الدخول المباشر عبر URL سيتم رفضها
- كل صفحة محمية بالصلاحيات

### Firestore Security Rules
- المستخدم لا يمكنه تعديل Role الخاص به
- المستخدم لا يمكنه تعديل بيانات مستخدم آخر
- Role يمكن تعديله فقط بواسطة Super Admin
- كل Collection محمية بالصلاحيات المناسبة

---

## اختبار النظام

### اختبار كـ User عادي
1. سجل الدخول بحساب User عادي
2. حاول الدخول لـ `/#admin`
3. يجب أن يتم رفضك وإرجاعك للصفحة الرئيسية
4. لا يجب أن يظهر خيار "لوحة التحكم" في القائمة

### اختبار كـ Support
1. سجل الدخول بحساب Support
2. اذهب للوحة التحكم
3. تحقق من ظهور الصفحات المسموح فقط
4. يجب ألا تظهر "إدارة الأدمنز"

### اختبار كـ Admin
1. سجل الدخول بحساب Admin
2. اذهب للوحة التحكم
3. تحقق من ظهور جميع الصفحات (باستثناء إدارة الأدمنز)
4. جرب إضافة منتج

### اختبار كـ Super Admin
1. سجل الدخول بحساب Super Admin
2. اذهب للوحة التحكم
3. تحقق من ظهور جميع الصفحات
4. جرب إضافة أدمن جديد

---

## استكشاف الأخطاء

### لا يمكنني الدخول للوحة التحكم
- تأكد من أن حسابك له Role في Firestore
- تأكد من أن Role ليس "user"
- تحقق من Console في المتصفح للأخطاء

### Security Rules لا تعمل
- تأكد من نشر Rules في Firebase Console
- تحقق من أن المشروع الصحيح مفتوح
- حاول نشر Rules مرة أخرى

### الصفحات لا تظهر
- تأكد من أن لديك الصلاحيات المناسبة
- تحقق من AdminContext في Console
- تأكد من أن URL صحيح (`/#admin`)

---

## الملاحظات المهمة

1. **لا تقم بتعديل User UI** - لوحة التحكم منفصلة تماماً
2. **لا تستخدم Hardcoded Emails** - الصلاحيات مبنية على Firestore Role
3. **لا تحذف Features موجودة** - فقط أضف الميزات الجديدة
4. **اختبر قبل النشر** - تأكد من عمل كل شيء
5. **حافظ على Design Consistency** - استخدم نفس التصميم

---

## الدعم

إذا واجهت أي مشاكل، تحقق من:
1. Firebase Console للتأكد من إعدادات المشروع
2. Console في المتصفح للأخطاء
3. Firestore Security Rules
4. Network Tab في DevTools لطلب Firebase

---

## التحديثات المستقبلية

يمكن إضافة:
- Real-time Analytics
- Advanced Charts
- Export Data
- Advanced Filtering
- Email Notifications
- SMS Notifications
- Multi-language Support
- Advanced Permissions
