# تعليمات نشر قواعد Firestore

المشكلة الحالية: قواعد أمان Firestore لم يتم نشرها بعد، مما يسبب خطأ "permission-denied" عند محاولة تحميل التذاكر.

## الحل السريع (مؤقت)

لجعل النظام يعمل فوراً بدون نشر القواعد، يمكنك تعطيل التحقق من الصلاحيات مؤقتاً في Firebase Console:

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر project: `liora-store-2027`
3. اذهب إلى **Firestore Database** > **Rules**
4. غيّر القواعد إلى:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
5. انقر **Publish**

⚠️ **تحذير**: هذا يسمح لأي مستخدم مسجل بالوصول لجميع البيانات. استخدم هذا فقط للتطوير!

## الحل الصحيح (للإنتاج)

لنشر القواعد الصحيحة:

### الطريقة 1: عبر Firebase Console

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر project: `liora-store-2027`
3. اذهب إلى **Firestore Database** > **Rules**
4. انسخ محتوى ملف `firestore.rules` من المشروع
5. الصقه في محرر القواعد
6. انقر **Publish**

### الطريقة 2: عبر Firebase CLI

```bash
# تثبيت Firebase CLI إذا لم مثبت
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# نشر القواعد
firebase deploy --only firestore:rules
```

## بعد نشر القواعد

بعد نشر القواعد الصحيحة، النظام سيعمل بشكل كامل مع:
- المستخدمون يرون تذاكرهم فقط
- الأدمنز يرون جميع التذاكر
- الحقول الحساسة محمية (assignedAdminId, status)
- لا يمكن للمستخدم تعديل بيانات الآخرين

## التحقق من النشر

بعد نشر القواعد، تحقق من:
1. افتح نافذة الدعم الفني كـ user
2. يجب أن يظهر نموذج إنشاء التذكرة
3. أنشئ تذكرة
4. سجل الدخول كـ admin
5. اذهب إلى لوحة التحكم > الدعم الفني
6. يجب أن ترى التذكرة التي أنشأها المستخدم
