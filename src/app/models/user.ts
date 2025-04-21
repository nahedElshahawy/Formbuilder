export interface User {
  id: number;
  userName: string;
  email: string;
  userShortName: string;
  password: string;
  role: '', // 'admin', 'editor', 'viewer' etc.
  permissions: [''], // ['view_users', 'edit_users', ...]

}
