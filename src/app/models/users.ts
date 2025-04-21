import { NewUser } from './new-user';

export const users: NewUser[] = [
  {
    id: 1,
    username: 'nahed',
    email: 'john.doe@example.com',
    nickname: 'Johnny',
    password: 'securePass123' // يفضل تشفير كلمة المرور عند التعامل مع الـ backend
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    nickname: 'Janey',
    password: 'strongPass456'
  }
];
