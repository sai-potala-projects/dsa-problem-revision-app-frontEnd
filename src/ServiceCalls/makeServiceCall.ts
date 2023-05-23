import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const makeServiceCall = (url: string, requestBody: string = '') => {
  const userInfo: any = Cookies.get('userInfo') || '';
  let token: string = '';
  if (userInfo) {
    const parsedUserInfo: any = JSON.parse(userInfo);
    token = parsedUserInfo?.token || '';
  } else {
    return Promise.reject('Unauthorized');
  }
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_LOCAL_BASE_URL, // Use an environment variable or your dynamic base URL
  });

  axiosInstance.interceptors.request.use((config: any) => {
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });

  return axiosInstance.post(`${url}`, requestBody);
};

export default makeServiceCall;
