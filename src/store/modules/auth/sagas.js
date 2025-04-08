import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.loginSuccess({...response.data}));

    toast.success('Logged in successfully');

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    history.push(payload.prevPath);
  } catch(e) {
    toast.error('Invalid credentials');

    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
  const {id, name, email, password} = payload;

  try{
    if(id) {
      yield call(axios.put, '/users', {
        email,
        name,
        password: password || undefined,
      });
      toast.success('Your data was updated successfully');
      yield put(actions.registerUpdatedSuccess({ name, email, password }));
    } else {
      yield call(axios.post, '/users', {
        email,
        name,
        password,
      });
      toast.success('Your account was created successfully');
      yield put(actions.registerCreatedSuccess({ name, email, password }));
      history.push('/login');
    }
  } catch(e) {
    const errors = get(e, 'response.data.errors', []);
    const status = get(e, 'responde.status', 0);

    if (status === 401) {
      toast.error('You need to login again');
      yield put(actions.loginFailure());
      return history.push('/login');
    }

    if (errors.lenght > 0) {
      errors.map(error => toast.error(error));
    } else {
      toast.error('Something went wrong');
    }

    yield put(actions.registerFailure());
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
