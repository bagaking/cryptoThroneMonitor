import {UPDATE_ACCOUNT_INFO, UPDATE_IDENTITY, UPDATE_CODE} from '../actions';

const initialState = {
  accountInfo: null,
  identity: null,
  code: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT_INFO: {
      const {accountInfo} = action.payload;
      console.log('UPDATE_ACCOUNT_INFO ', accountInfo);
      return {
        ...state,
        accountInfo,
      };
    }
    case UPDATE_IDENTITY: {
      const {identity} = action.payload;
      console.log('UPDATE_IDENTITY ', identity);
      return {
        ...state,
        identity,
      };
    }
    case UPDATE_CODE: {
      const {code} = action.payload;
      console.log('UPDATE_CODE ', code);
      return {
        ...state,
        code,
      };
    }
    default:
      return state;
  }
}
