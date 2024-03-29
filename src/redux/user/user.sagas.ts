import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
  googleProvider,
  auth,
  createUserProfileDocument,
  getCurrentUser,
} from '../../firebase/firebase';
import { Response } from '../response.interface';
import {
  checkUserSessionFinish,
  signInFailure,
  signInSucces,
  signOutSuccess,
  signUpSuccess,
} from './user.actions';
import userActionsTypes from './user.types';

const takeLatest_any: any = takeLatest;

export function* getSnapshotFromUserAuth(userAuth: any) {
  try {
    const userRef: Response = yield call(
      createUserProfileDocument,
      userAuth,
      {}
    );
    const userSnapShot: Response = yield userRef.get();
    yield put(signInSucces({ id: userSnapShot.id, ...userSnapShot.data() }));
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield auth.signInWithPopup(googleProvider);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
  }
}

export function* signInWithEmailAndPassword({
  payload: { email, password },
}: any) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth: Response = yield getCurrentUser();
    if (!userAuth) yield put(checkUserSessionFinish());
    yield getSnapshotFromUserAuth(userAuth);
    yield put(checkUserSessionFinish());
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
    yield put(checkUserSessionFinish());
  }
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
  }
}

interface Data {
  payload: {
    email: string;
    password: string;
    displayName: string;
  };
}

export function* signUp(data: Data) {
  try {
    const {
      payload: { displayName, password, email },
    } = data;
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    yield createUserProfileDocument(user, { displayName });
    yield put(signUpSuccess());
    yield signInWithEmailAndPassword(data);
  } catch (error) {
    yield put(signInFailure('error'));
    console.error('something went wrong!');
  }
}

export function* onEmailSignInStart() {
  yield takeLatest_any(
    userActionsTypes.EMAIL_SIGN_IN_START,
    signInWithEmailAndPassword
  );
}

export function* onGoogleSignInStart() {
  yield takeLatest_any(userActionsTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onCheckUserSession() {
  yield takeLatest_any(
    userActionsTypes.CHECK_USER_SESSION_START,
    isUserAuthenticated
  );
}

export function* onSignOutStart() {
  yield takeLatest_any(userActionsTypes.SIGN_OUT_START, signOut);
}
export function* onSignUpStart() {
  yield takeLatest_any(userActionsTypes.SIGN_UP_START, signUp);
}

export function* userSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
  ]);
}
