# نظام الدعم الفني - Liora Store

## نظرة عامة
نظام دعم فني كامل مع تذاكر ومحادثات realtime مدمج في Liora Store.

## المميزات

### للمستخدمين
- زر دعم فني عائم في أسفل الشاشة
- إنشاء تذاكر دعم جديدة
- محادثة realtime مع فريق الدعم
- إشعارات عند وصول رسائل جديدة
- تتبع حالة التذكرة (مفتوح، قيد المعالجة، محلول، مغلق)

### للأدمنز
- قسم "الدعم الفني" في لوحة التحكم
- عرض جميع التذاكر حسب الحالة
- استلام التذاكر وتعيينها للأدمن
- الرد على المستخدمين عبر المحادثة
- تغيير حالة التذكرة
- رسالة نظام تلقائية عند استلام التذكرة

## الصلاحيات

### المستخدم العادي
- إنشاء تذاكر
- إرسال رسائل في تذاكره الخاصة
- عرض تذاكره فقط

### Support
- عرض جميع التذاكر
- استلام التذاكر
- الرد على المستخدمين
- تغيير حالة التذكرة

### Admin
- كل صلاحيات Support
- صلاحيات إضافية للمنتجات والطلبات

### Super Admin
- كل الصلاحيات
- إدارة الأدمنز

## هيكل البيانات في Firestore

### Collection: tickets/{ticketId}
```javascript
{
  userId: string,
  userName: string,
  userEmail: string,
  subject: string,
  description: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  assignedTo: string | null,
  assignedToName: string | null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Subcollection: tickets/{ticketId}/messages/{messageId}
```javascript
{
  ticketId: string,
  senderId: string,
  senderName: string,
  senderRole: 'user' | 'admin' | 'system',
  message: string,
  createdAt: Timestamp
}
```

**ملاحظة أمنية:** قواعد Firestore تضمن أن المستخدمين يمكنهم فقط قراءة وإنشاء التذاكر الخاصة بهم، بينما يمكن لـ support/admin/super_admin قراءة وإدارة جميع التذاكر.

## نشر قواعد Firestore

لتطبيق قواعد الأمان، استخدم Firebase CLI:

```bash
# تثبيت Firebase CLI إذا لم مثبت
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# نشر القواعد
firebase deploy --only firestore:rules
```

أو انسخ محتوى `firestore.rules` إلى Firebase Console:
1. افتح Firebase Console
2. اختر project: liora-store-2027
3. اذهب إلى Firestore Database > Rules
4. انسخ والصق قواعد من `firestore.rules`
5. انقر Publish

## اختبار النظام

### سيناريو 1: المستخدم ينشئ تذكرة
1. سجل الدخول كمستخدم عادي
2. اضغط على زر الدعم الفني (أيقونة الرسالة في أسفل الشاشة)
3. املأ نموذج إنشاء التذكرة (عنوان ووصف)
4. اضغط "إرسال التذكرة"
5. تحقق من ظهور التذكرة في Firestore

### سيناريو 2: الأدمن يستلم التذكرة
1. سجل الدخول كأدمن (support/admin/super_admin)
2. اذهب إلى لوحة التحكم (#admin)
3. اختر "الدعم الفني" من القائمة
4. ابحث عن التذكرة المفتوحة
5. اضغط "استلام التذكرة"
6. تحقق من تغيير الحالة إلى "قيد المعالجة"
7. تحقق من إرسال رسالة نظام تلقائية

### سيناريو 3: المحادثة Realtime
1. كمستخدم، افتح المحادثة
2. اكتب رسالة وأرسلها
3. كمستخدم آخر في tab مختلف، تحقق من ظهور الرسالة
4. كأدمن، ارد على الرسالة
5. كمستخدم، تحقق من استلام الرد بدون refresh

### سيناريو 4: تغيير الحالة
1. كأدمن، اختر تذكرة
2. غيّر الحالة إلى "محلول"
3. كمستخدم، تحقق من ظهور رسالة "تم حل طلب الدعم"
4. تحقق من إمكانية إعادة فتح التذكرة

### سيناريو 5: الإشعارات
1. كأدمن، أرسل رسالة لمستخدم
2. كمستخدم، تحقق من ظهور إشعار جديد
3. تحقق من محتوى الإشعار

## استكشاف الأخطاء

### التذكرة لا تظهر في لوحة التحكم
- تأكد من أن الأدمن لديه صلاحية 'support' أو أعلى
- تحقق من قواعد Firestore في Firebase Console
- تأكد من أن المستخدم أنشأ التذكرة بنجاح

### الرسائل لا تظهر realtime
- تحقق من استخدام onSnapshot بشكل صحيح
- تأكد من أن ticketId صحيح
- تحقق من اتصال الإنترنت

### الإشعارات لا تعمل
- تأكد من استخدام useNotifications بشكل صحيح
- تحقق من أن addSupportNotification يتم استدعاؤها
- تحقق من localStorage لـ liora_notifications_unread

### خطأ "permission-denied"
- تحقق من قواعد Firestore
- تأكد من أن المستخدم لديه الصلاحية المناسبة
- تحقق من أن role في users collection صحيح

## الملفات المضافة/المعدلة

### الملفات الجديدة
- `src/components/support/SupportChat.jsx` - مكون المحادثة للمستخدمين
- `src/components/admin/AdminSupport.jsx` - لوحة تحكم الدعم الفني
- `firestore.rules` - قواعد أمان Firestore
- `SUPPORT_SYSTEM.md` - هذا الملف

### الملفات المعدلة
- `src/App.jsx` - إضافة AdminSupport ورابط الدعم
- `src/components/layout/MainLayout.jsx` - إضافة SupportChat
- `src/components/admin/AdminLayout.jsx` - إضافة قائمة الدعم الفني
- `src/context/AdminContext.jsx` - إضافة صلاحيات support
- `src/context/NotificationContext.jsx` - إضافة إشعارات الدعم

## ملاحظات مهمة

1. **قواعد Firestore**: يجب نشر قواعد الأمان قبل استخدام النظام في الإنتاج
2. **Realtime**: النظام يستخدم onSnapshot للتحديثات الفورية
3. **الإشعارات**: الإشعارات محلية حالياً، يمكن توسيعها لإشعارات push
4. **الصلاحيات**: الصلاحيات محمية في Firestore Rules وليس فقط في الواجهة
5. **System Messages**: الرسالة التلقائية تُرسل مرة واحدة فقط عند استلام التذكرة

## التطويرات المستقبلية

- إضافة مرفقات للرسائل
- نظام تقييم للدعم الفني
- إحصائيات وتقارير للتذاكر
- ردود جاهزة (canned responses)
- تكامل مع email notifications
- نظام البحث في التذاكر
- تصنيف التذاكر حسب النوع
