# نظام الصلاحيات الجديد - Discord Clone

## نظرة عامة

تم إنشاء نظام صلاحيات جديد وأكثر مرونة لمشروع Discord Clone. هذا النظام يعمل جنباً إلى جنب مع نظام الأدوار الحالي دون تغيير أي من الوظائف الموجودة.

## المميزات الرئيسية

### 🎯 **نظام صلاحيات مفصل**
- **50+ صلاحية مختلفة** مقسمة إلى 11 مجموعة
- **صلاحيات خاصة بالقنوات** (Channel-specific permissions)
- **صلاحيات خاصة بالأعضاء** (Member-specific permissions)
- **قواعد ذكية** للتحقق من الصلاحيات

### 🏗️ **هيكل مرن**
- **نظام أدوار موجود** (Admin, Moderator, Guest) - لم يتغير
- **نظام صلاحيات جديد** يعمل مع الأدوار
- **إمكانية التوسع** لإضافة صلاحيات جديدة بسهولة

### 🎨 **واجهة مستخدم متطورة**
- **عرض مرئي للصلاحيات** مع مجموعات منظمة
- **مقارنة الأدوار** side-by-side
- **صفحة معلومات شاملة** في الإعدادات

## الملفات الجديدة

### أنواع البيانات
```
src/types/permissions.ts
```
- `Permission` enum - جميع الصلاحيات المتاحة
- `PermissionGroup` interface - مجموعات الصلاحيات
- `MemberPermissions` interface - صلاحيات العضو
- `PermissionCheck` interface - نتيجة فحص الصلاحية

### منطق الصلاحيات
```
src/lib/permissions.ts
```
- `ROLE_PERMISSIONS` - تعريف الصلاحيات لكل دور
- `PERMISSION_GROUPS` - مجموعات الصلاحيات للعرض
- `checkPermission()` - فحص صلاحية واحدة
- `checkMultiplePermissions()` - فحص صلاحيات متعددة
- `getMemberPermissions()` - الحصول على صلاحيات العضو

### Hook للاستخدام
```
src/hooks/use-permissions.ts
```
- `usePermissions(serverId)` - Hook رئيسي
- دوال مساعدة للصلاحيات الشائعة
- معلومات العضو الحالي

### مكونات الواجهة
```
src/components/permissions/
├── permissions-display.tsx      # عرض الصلاحيات
├── permissions-info.tsx         # معلومات صلاحيات العضو
└── page.tsx                     # صفحة الصلاحيات في الإعدادات
```

## كيفية الاستخدام

### 1. فحص صلاحية واحدة
```typescript
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/types/permissions';

const MyComponent = () => {
  const { hasPermission } = usePermissions(serverId);
  
  const canDeleteServer = hasPermission(Permission.DELETE_SERVER);
  const canCreateChannel = hasPermission(Permission.CREATE_CHANNEL);
  
  return (
    <div>
      {canDeleteServer && <DeleteServerButton />}
      {canCreateChannel && <CreateChannelButton />}
    </div>
  );
};
```

### 2. فحص صلاحيات متعددة
```typescript
const { hasAllPermissions, hasAnyPermission } = usePermissions(serverId);

// يجب أن يكون لديه جميع الصلاحيات
const canManageServer = hasAllPermissions([
  Permission.MANAGE_SERVER,
  Permission.MANAGE_MEMBERS
]);

// يكفي أن يكون لديه أي من الصلاحيات
const canModerate = hasAnyPermission([
  Permission.MODERATE_MESSAGES,
  Permission.DELETE_OTHERS_MESSAGES
]);
```

### 3. استخدام الدوال المساعدة
```typescript
const {
  canManageServer,
  canDeleteServer,
  canCreateChannel,
  canManageMembers,
  canKickMembers,
  canSendMessages,
  isAdmin,
  isModerator,
  isGuest
} = usePermissions(serverId);

// استخدام مباشر
if (canManageServer()) {
  // إظهار أزرار إدارة الخادم
}
```

### 4. عرض الصلاحيات
```typescript
import { PermissionsDisplay } from '@/components/permissions/permissions-display';

const permissions = getMemberPermissionsList();

<PermissionsDisplay
  permissions={permissions}
  title="Your Permissions"
  showDescriptions={true}
  compact={false}
/>
```

## مجموعات الصلاحيات

### 1. **Server Management**
- `MANAGE_SERVER` - إدارة إعدادات الخادم
- `DELETE_SERVER` - حذف الخادم
- `VIEW_SERVER_INSIGHTS` - عرض إحصائيات الخادم

### 2. **Channel Management**
- `CREATE_CHANNEL` - إنشاء قنوات جديدة
- `EDIT_CHANNEL` - تعديل إعدادات القنوات
- `DELETE_CHANNEL` - حذف القنوات
- `MANAGE_CHANNEL_PERMISSIONS` - إدارة صلاحيات القنوات

### 3. **Member Management**
- `MANAGE_MEMBERS` - إدارة الأعضاء
- `KICK_MEMBERS` - طرد الأعضاء
- `BAN_MEMBERS` - حظر الأعضاء
- `CHANGE_MEMBER_ROLES` - تغيير أدوار الأعضاء

### 4. **Message Management**
- `SEND_MESSAGES` - إرسال الرسائل
- `EDIT_MESSAGES` - تعديل الرسائل
- `DELETE_MESSAGES` - حذف الرسائل
- `DELETE_OTHERS_MESSAGES` - حذف رسائل الآخرين
- `PIN_MESSAGES` - تثبيت الرسائل

### 5. **Voice & Video**
- `JOIN_VOICE_CHANNELS` - الانضمام للقنوات الصوتية
- `SPEAK_IN_VOICE_CHANNELS` - التحدث في القنوات الصوتية
- `USE_VOICE_ACTIVITY` - استخدام كشف الصوت
- `PRIORITY_SPEAKER` - متحدث ذو أولوية
- `STREAM_VIDEO` - بث الفيديو

### 6. **Invites**
- `CREATE_INVITES` - إنشاء دعوات
- `MANAGE_INVITES` - إدارة الدعوات

### 7. **Reactions & Emojis**
- `ADD_REACTIONS` - إضافة ردود الفعل
- `USE_EXTERNAL_EMOJIS` - استخدام الإيموجي الخارجية
- `USE_EXTERNAL_STICKERS` - استخدام الملصقات الخارجية

### 8. **Files & Attachments**
- `ATTACH_FILES` - إرفاق الملفات
- `EMBED_LINKS` - تضمين الروابط

### 9. **Mentions**
- `MENTION_EVERYONE` - ذكر الجميع
- `MENTION_ROLES` - ذكر الأدوار

### 10. **Moderation**
- `MODERATE_MESSAGES` - إدارة الرسائل
- `VIEW_AUDIT_LOG` - عرض سجل التدقيق
- `MANAGE_WEBHOOKS` - إدارة Webhooks

### 11. **Advanced Features**
- `MANAGE_ROLES` - إدارة الأدوار
- `MANAGE_EMOJIS_AND_STICKERS` - إدارة الإيموجي والملصقات
- `MANAGE_EXPRESSIONS` - إدارة التعبيرات
- `USE_APPLICATION_COMMANDS` - استخدام أوامر التطبيق
- `MANAGE_THREADS` - إدارة المواضيع
- `USE_PUBLIC_THREADS` - استخدام المواضيع العامة
- `USE_PRIVATE_THREADS` - استخدام المواضيع الخاصة
- `SEND_MESSAGES_IN_THREADS` - إرسال رسائل في المواضيع

## قواعد خاصة

### 1. **حذف الخادم**
- لا يمكن حذف الخادم إذا كان العضو هو الإداري الوحيد

### 2. **تغيير الأدوار**
- لا يمكن تغيير دور الإداري إذا كان هو الإداري الوحيد

### 3. **حذف القنوات**
- لا يمكن حذف قناة "General"

### 4. **تعديل القنوات**
- Moderator يمكنه تعديل/حذف القنوات التي أنشأها فقط

### 5. **طرد الأعضاء**
- لا يمكن طرد عضو له دور أعلى أو مساوي

## التوسع المستقبلي

### إضافة صلاحية جديدة
1. إضافة الصلاحية إلى `Permission` enum
2. إضافة الصلاحية إلى `ROLE_PERMISSIONS` المناسبة
3. إضافة الصلاحية إلى `PERMISSION_GROUPS` المناسبة
4. إضافة وصف الصلاحية في `getPermissionDescription()`
5. إضافة اسم العرض في `getPermissionDisplayName()`

### إضافة دور جديد
1. إضافة الدور إلى `MemberRole` enum
2. إضافة صلاحيات الدور في `ROLE_PERMISSIONS`
3. تحديث منطق التحقق في `checkPermission()`

## المزايا

### ✅ **سهولة الاستخدام**
- Hook بسيط للاستخدام
- دوال مساعدة للصلاحيات الشائعة
- واجهة مستخدم واضحة

### ✅ **مرونة عالية**
- إمكانية إضافة صلاحيات جديدة بسهولة
- دعم الصلاحيات الخاصة بالقنوات
- قواعد ذكية للتحقق

### ✅ **أمان محسن**
- فحص شامل للصلاحيات
- قواعد خاصة لحماية النظام
- منع التلاعب بالصلاحيات

### ✅ **تجربة مستخدم ممتازة**
- عرض مرئي للصلاحيات
- مقارنة الأدوار
- صفحة معلومات شاملة

## الخلاصة

نظام الصلاحيات الجديد يوفر:
- **وضوح أكبر** في فهم الصلاحيات
- **مرونة عالية** في إدارة الصلاحيات
- **أمان محسن** مع قواعد ذكية
- **تجربة مستخدم ممتازة** مع واجهة متطورة

النظام يعمل بشكل كامل مع النظام الحالي دون أي تغييرات في الوظائف الموجودة، مما يجعله ترقية آمنة ومفيدة. 