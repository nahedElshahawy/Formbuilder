export interface Users {
 id: number;
 name: string;
 email: string;
//  role: 'admin' | 'user'; // يمكنك إضافة المزيد من الأدوار حسب الحاجة
 isActive: boolean;
 twoFactorEnabled: boolean; // هل المصادقة الثنائية مفعلة؟
 qrCodeImage?: string; // الصورة الخاصة بـ QR Code عند تمكين 2FA
 secretKey?: string; // المفتاح السري الخاص بـ 2FA
 TwoFactorCode?: string;
  token?: string;
  role?: string; // 'admin', 'editor', 'viewer' etc.
  permissions?: string[]; // ['view_users', 'edit_users', ...]
}
