// // mock-user.service.ts
// import { Injectable } from '@angular/core';
// import { of } from 'rxjs';
// import { User } from '../services/user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class MockUserService {
//   private users: User[] = [
//     { id: 1, username: 'testuser1', email: 'test1@example.com', nickname: 'Test1', password: 'password1', DeviceID: 123456 },
//     { id: 2, username: 'testuser2', email: 'test2@example.com', nickname: 'Test2', password: 'password2', DeviceID: 123456 },
//   ];

//   getUsers() {
//     return of(this.users);
//   }

//   addUser(user: User) {
//     user.id = this.users.length + 1;
//     this.users.push(user);
//     return of(user);
//   }

//   updateUser(user: User) {
//     const index = this.users.findIndex(u => u.id === user.id);
//     if (index !== -1) {
//       this.users[index] = user;
//     }
//     return of(user);
//   }

//   deleteUser(id: number) {
//     this.users = this.users.filter(user => user.id !== id);
//     return of(null);
//   }
// }
