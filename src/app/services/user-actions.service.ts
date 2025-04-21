import { createAction, props } from '@ngrx/store';

export const setUserCredentials = createAction(
'[Login] Set User Credentials',
props<{ username: string; password: string; token?: string }>()
);

export const clearUserCredentials = createAction(
'[Logout] Clear User Credentials'
);
