import { createSelector } from 'reselect';

const selectUser = (state: any) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const userAuthificationLoaded = createSelector(
  [selectUser],
  (user) => user.isLoading
);
