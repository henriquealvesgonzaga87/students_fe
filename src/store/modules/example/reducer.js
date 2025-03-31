import * as types from '../types';

const initialState = {
  clickedButton: false
}

export default function (state=initialState, action) {
  switch(action.type) {
    case types.CLICKED_BUTTON_SUCCESS: {
      console.log('Sucesso');
      const newState = {...state};
      newState.clickedButton = !newState.clickedButton;
      return newState;
    }

    case types.CLICKED_BUTTON_FAILURE: {
      console.log('Deu erro :(');
      return state;
    }

    case types.CLICKED_BUTTON_REQUEST: {
      console.log('Estou fazendo a requisição');
      return state;
    }

    default: {
      return state;
    }
  }
};
