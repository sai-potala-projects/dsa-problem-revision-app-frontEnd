import axios from 'axios';
import Cookie from 'js-cookie';
import { Auth_FAIL, Auth_REQUEST, Auth_SUCCESS } from '../Constants/signInConstants';

interface UserAuth {
  userName?: string;
  email: string;
  password: string;
  authType: string;
}

export const userAuth = (siginInDetails: UserAuth) => async (dispatch: any) => {
  dispatch({
    type: Auth_REQUEST,
  });

  try {
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/signin`, siginInDetails);
    Cookie.set('userInfo', JSON.stringify(data));
    dispatch({ type: Auth_SUCCESS, payload: { data } });
  } catch (error: any) {
    dispatch({
      type: Auth_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message,
    });
  }
};
