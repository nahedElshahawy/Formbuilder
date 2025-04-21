import { Injectable } from '@angular/core';
@Injectable({
providedIn: 'root'
})
export class UserDataService {



// يمكنك جعلها واجهة (interface) أرقى لو أردت، لكن بهذه البساطة يكفي
private userData: { username?: string; password?: string; token?: string } = {};

setUserData(data: { username?: string; password?: string; token: string }) {
this.userData = data;
}

getUserData() {
return this.userData;
}

clearUserData() {
this.userData = {};
}
}
