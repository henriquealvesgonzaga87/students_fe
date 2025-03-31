import {call, put, all, takeLatest} from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import { toast } from 'react-toastify';

const request = () => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, 600);
});


function* exampleRequest() {
  try{
    yield call(request);
    yield put(actions.clickButtonSuccess());
  } catch {
    toast.error('Deu erro.');
    yield put(actions.clickButtonFailure());
  }
}

export default all([
  takeLatest(types.CLICKED_BUTTON_REQUEST, exampleRequest),
])
