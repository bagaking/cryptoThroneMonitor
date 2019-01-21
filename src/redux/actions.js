export const UPDATE_ACCOUNT_INFO = 'UPDATE_ACCOUNT_INFO';
export const UPDATE_IDENTITY = 'UPDATE_IDENTITY';
export const UPDATE_CODE = 'UPDATE_CODE';

export const updateAccountInfo = accountInfo => ({
  type: UPDATE_ACCOUNT_INFO,
  payload: {
    accountInfo,
  },
});

export const updateIdentity = identity => ({
  type: UPDATE_IDENTITY,
  payload: {
    identity,
  },
});

export const updateCode = code => ({
  type: UPDATE_CODE,
  payload: {
    code,
  },
});
