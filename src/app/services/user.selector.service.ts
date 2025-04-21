import { createFeatureSelector, createSelector, createReducer } from '@ngrx/store';
import { UserState  } from './user-reducer.service';

// في حال استخدمت تسميتها user في StoreModule.forRoot({ user: userReducer })
export const selectUserState = createFeatureSelector('user');


// export const selectUsername = createSelector(
// selectUserState,
// (state) => state.username
// );

// export const selectPassword = createSelector(
// selectUserState,
// (state) => state.password
// );

// export const selectToken = createSelector(
// selectUserState,
// (state) => state.token
// );

