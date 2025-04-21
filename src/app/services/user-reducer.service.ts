
import { createReducer, on } from '@ngrx/store';
import { setUserCredentials, clearUserCredentials } from './user-actions.service';

export interface UserState {
username: string;
password: string;
token?: string; // إن أردت حفظ التوكن أو أي بيانات أخرى
}

// الحالة الابتدائية (initial state)
export const initialUserState: UserState = {
username: '',
password: '',
token: ''
};

export const userReducer = createReducer(
initialUserState,
on(setUserCredentials, (state, { username, password, token }) => ({
...state,
username,
password,
token
})),
on(clearUserCredentials, () => ({
...initialUserState
}))
);
