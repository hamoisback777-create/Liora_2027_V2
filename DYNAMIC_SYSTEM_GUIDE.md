# 🔥 Liora Store - Dynamic System Setup Guide

## ✅ ما تم تنفيذه:

### 1. Firebase Storage
- ✅ تم إضافة `getStorage` إلى `firebase.js`
- ✅ تم إنشاء `storage.rules` مع حماية الصور
- ✅ الرفع الحقيقي للصور مع Preview
- ✅ Validation للصور (JPG, PNG, WEBP - حد أقصى 5MB)

### 2. Firestore Realtime
- ✅ استخدام `onSnapshot` بدلاً من `getDocs`
- ✅ تحديث لحظي للمنتجات والأقسام
- ✅ Admin Dashboard يستمع للتغييرات
- ✅ الموقع يستمع للتغييرات

### 3. هيكل البيانات الجديد

**Products Collection:**
```javascript
{
  name: "اسم المنتج",
  description: "وصف المنتج",
  price: 100.00,
  categoryId: "category_id",
  categoryName: "اسم الفئة",
  imageUrl: "https://firebasestorage...",
  status: "available", // or "unavailable"
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

**Categories Collection:**
```javascript
{
  name: "اسم الفئة",
  description: "وصف الفئة",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

---

## ⚠️ خطوات إعداد Firebase Storage (مهم جداً)

### 1. تفعيل Firebase Storage
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. افتح مشروع `liora-store-2027`
3. اذهب إلى **Storage**
4. اضغط **Get Started**
5. اختر القواعد الأمنية:
   - اختر **Start in Test Mode** (للتجربة) أو **Start in Production Mode**
6. اختر موقع Storage (اختر الأقرب لمستخدميك)
7. اضغط **Done**

### 2. تطبيق Storage Rules
بعد تفعيل Storage:
1. اذهب إلى **Storage** → **Rules**
2. انسخ محتوى ملف `storage.rules` من المشروع
3. الصقه في المحرر
4. اضغط **Publish**

**محتوى storage.rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/(default)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdminOrHigher() {
      return getUserRole() in ['admin', 'super_admin'];
    }
    
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated() && isAdminOrHigher();
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. CORS Configuration (مهم للصور)
إذا لم تظهر الصور بعد الرفع، قد تحتاج لإعداد CORS:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

ثم أنشئ ملف `firebase.json`:
```json
{
  "storage": {
    "rules": "storage.rules",
    "cors": [
      [
        {
          "origin": ["*"],
          "method": ["GET"],
          "maxAgeSeconds": 3600
        }
      ]
    ]
  }
}
```

ثم نفذ:
```bash
firebase deploy --only storage
```

---

## 🧪 اختبار النظام

### 1. إضافة قسم
1. سجل الدخول كـ Admin أو Super Admin
2. اذهب إلى "إدارة المنتجات"
3. اضغط "إضافة قسم"
4. أدخل الاسم والوصف
5. اضغط "إضافة"
6. ✅ القسم يظهر فوراً في لوحة التحكم

### 2. إضافة منتج مع صورة
1. من "إدارة المنتجات"
2. اضغط "إضافة منتج"
3. أدخل الاسم والوصف والسعر
4. اختر الفئة
5. اضغط "اختر صورة" واختر صورة من جهازك
6. ✅ Preview للصورة يظهر
7. اضغط "إضافة"
8. ✅ الصورة ترفع إلى Firebase Storage
9. ✅ المنتج يظهر فوراً في لوحة التحكم

### 3. عرض المنتج في الموقع
1. اضغط "عرض الموقع" من Sidebar
2. ✅ المنتج يظهر فوراً في الصفحة الرئيسية
3. ✅ الصورة تظهر بشكل صحيح
4. ✅ البيانات مطابقة تماماً

### 4. Realtime Update
1. من لوحة التحكم، عدل سعر المنتج
2. ✅ السعر يتحدث فوراً في الموقع بدون Refresh
3. من لوحة التحكم، غيّر الحالة إلى "غير متاح"
4. ✅ المنتج يختفي فوراً من الموقع
5. من لوحة التحكم، احذف المنتج
6. ✅ المنتج يختفي فوراً من الموقع

---

## 📁 الملفات المعدلة

1. **src/lib/firebase.js**
   - إضافة `getStorage` وتصدير `storage`

2. **src/components/admin/AdminProducts.jsx**
   - استخدام `onSnapshot` للـ Realtime
   - رفع الصور إلى Firebase Storage
   - تحديث هيكل البيانات (name, imageUrl, categoryId, categoryName)
   - إضافة Preview للصور
   - Validation للصور

3. **src/components/home/ProductsList.jsx**
   - استخدام `onSnapshot` للـ Realtime
   - جلب المنتجات من Firestore الحقيقي
   - فلترة المنتجات المتاحة فقط

4. **src/components/ui/ProductCard.jsx**
   - دعم البيانات الجديدة (imageUrl, name, categoryName)
   - backward compatibility مع البيانات القديمة

5. **storage.rules** (جديد)
   - قواعد أمان Firebase Storage
   - قراءة للجميع
   - كتابة لـ admin/super_admin فقط

---

## 🔒 الأمان

### Firestore Rules
- ✅ products: قراءة للجميع، كتابة لـ admin+
- ✅ categories: قراءة للجميع، كتابة لـ admin+

### Storage Rules
- ✅ products/*: قراءة للجميع، كتابة لـ admin+
- ✅ جميع المسارات الأخرى: ممنوعة

### Protection
- ✅ لا localStorage للبيانات
- ✅ Firestore هو مصدر الحقيقة
- ✅ Firebase Storage للصور
- ✅ Validation على مستوى Client
- ✅ Permission checks على مستوى Firestore

---

## 🎯 الميزات

### Realtime Updates
- ✅ أي تغيير في Firestore ينعكس فوراً
- ✅ لا حاجة لـ Refresh
- ✅ Admin Dashboard و Store يستخدمان نفس البيانات

### Image Upload
- ✅ رفع حقيقي إلى Firebase Storage
- ✅ Preview قبل الحفظ
- ✅ Validation للنوع والحجم
- ✅ Download URL يتم حفظه في Firestore

### Backward Compatibility
- ✅ ProductCard يدعم البيانات القديمة (image, title, tag)
- ✅ ProductCard يدعم البيانات الجديدة (imageUrl, name, categoryName)

---

## ⚡ Performance

- ✅ Realtime listeners تقلل من الطلبات
- ✅ تحديثات لحظية بدون reload
- ✅ الصور محسنة من Firebase Storage
- ✅ Lazy loading يمكن إضافته مستقبلاً

---

## 🚀 الخطوات التالية

بعد تفعيل Firebase Storage:
1. اختبر إضافة منتج مع صورة
2. تأكد أن الصورة ترفع وتظهر
3. اختبر Realtime Updates
4. اختبر عرض المنتجات في الموقع

إذا واجهت أي مشاكل:
- تحقق من Firebase Console → Storage
- تحقق من Storage Rules
- تحقق من CORS configuration
- افتح Console في المتصفح للأخطاء
