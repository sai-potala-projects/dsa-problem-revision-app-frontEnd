import makeServiceCall from '../../ServiceCalls/makeServiceCall';
import { modifyTableData } from '../../UI/util';
import {
  Get_PROBLEM_FAIL,
  Get_PROBLEM_REQUEST,
  Get_PROBLEM_SUCCESS,
  Save_PROBLEM_FAIL,
  Save_PROBLEM_REQUEST,
  Save_PROBLEM_SUCCESS,
  Reset_PROBLEM_Service_Message,
  Get_COLLECTIONS_REQUEST,
  Get_COLLECTIONS_FAIL,
} from '../Constants/problemConstants';

export const problemServiceCall =
  ({ requestBody, url, isGetServiceCall }: any) =>
  async (dispatch: any) => {
    if (isGetServiceCall) {
      dispatch({ type: Get_PROBLEM_REQUEST });
    } else {
      dispatch({ type: Save_PROBLEM_REQUEST });
    }

    try {
      const { data } = await makeServiceCall(url, requestBody);
      const modifiedData = modifyTableData({ data: data.problems });
      if (isGetServiceCall) {
        dispatch({ type: Get_PROBLEM_SUCCESS, payload: { problemList: modifiedData || [],collections: data.collections||[]} });
      } else {
        dispatch({ type: Save_PROBLEM_SUCCESS, payload: { problemList: modifiedData || [],collections: data.collections||[] } });
      }
    } catch (error: any) {
      if (error.response && error.response.data?.message === 'Invalid Token') {
        dispatch({
          type: Get_PROBLEM_FAIL,
          payload: error.response.data.message,
        });
      } else if (isGetServiceCall) {
        dispatch({
          type: Get_PROBLEM_FAIL,
          payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
      } else {
        dispatch({
          type: Save_PROBLEM_FAIL,
          payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
      }
    }
  };

export const problemServiceCallMessageReset = () => async (dispatch: any) => {
  dispatch({ type: Reset_PROBLEM_Service_Message });
};

export const userCollections =    ({ requestBody, url }: any) =>  async (dispatch: any) =>  {

    dispatch({ type: Get_COLLECTIONS_REQUEST });

  
  try {
    const { data } = await makeServiceCall(url, requestBody);

    dispatch({ type: Get_PROBLEM_SUCCESS, payload: { collections: data.collections||[]} });
    if(data?.collections?.[0].length>0){
      dispatch(problemServiceCall({ requestBody: {collectionName:data?.collections?.[0]}, url: '/problems/get', isGetServiceCall: true }) as any);
    }

    else{
      dispatch({
        type: Get_COLLECTIONS_FAIL,
        payload: 'no collections to display please create one',
      });
    }
  } catch (error: any) {
    if (error.response && error.response.data?.message === 'Invalid Token') {
      dispatch({
        type: Get_COLLECTIONS_FAIL,
        payload: error.response.data.message,
      });
    } 
    
  }
};
