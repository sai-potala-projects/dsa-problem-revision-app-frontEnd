import { Auth_FAIL, Auth_REQUEST, Auth_Reset, Auth_SUCCESS } from '../Constants/signInConstants';

export const userAuthReducer = (state = {}, action: any) => {
  switch (action.type) {
    case Auth_REQUEST:
      return { loading: true };
    case Auth_SUCCESS:
      return { loading: false, userInfo: action.payload.data };
    case Auth_FAIL:
      return { loading: false, error: action.payload };
    case Auth_Reset:
      return {};
    default:
      return state;
  }
};
