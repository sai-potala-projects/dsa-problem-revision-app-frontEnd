import { problemServiceDataInitialState } from '../../store';
import {
  Get_COLLECTIONS_FAIL,
  Get_COLLECTIONS_REQUEST,
  Get_COLLECTIONS_SUCCESS,
  Get_PROBLEM_FAIL,
  Get_PROBLEM_REQUEST,
  Get_PROBLEM_SUCCESS,
  Reset_PROBLEM_Service_Message,
  Save_PROBLEM_FAIL,
  Save_PROBLEM_REQUEST,
  Save_PROBLEM_SUCCESS,
} from '../Constants/problemConstants';

export const getProblemListReducer = (state = { ...problemServiceDataInitialState }, action: any) => {
  switch (action.type) {
    case Get_COLLECTIONS_REQUEST:
      return { ...state, loading: true };
    case Get_COLLECTIONS_SUCCESS:
      return { ...state, loading: false,collections:action.payload.collections };
    case Get_COLLECTIONS_FAIL:
        return { ...state, loading: false,error: action.payload };
    case Get_PROBLEM_REQUEST:
      return { ...state, loading: true };
    case Get_PROBLEM_SUCCESS:
      return { ...state, loading: false, problemData: action.payload.problemList,collections:action.payload.collections };
    case Get_PROBLEM_FAIL:
      return { ...state, loading: false, error: action.payload };
    case Save_PROBLEM_REQUEST:
      return {
        ...state,
        saveLoading: true,
      };
    case Save_PROBLEM_SUCCESS:
      return {
        ...state,
        saveLoading: false,
        problemData: action.payload.problemList,
        saveSuccess: 'Selected rows Saved successfully',
        collections:action.payload.collections
      };
    case Save_PROBLEM_FAIL:
      return {
        ...state,
        saveLoading: false,
        saveError: action.payload,
      };
    case Reset_PROBLEM_Service_Message:
      return {
        ...state,
        saveSuccess: '',
        saveError: '',
      };
    case Reset_PROBLEM_Service_Message:
      return {
        ...state,
        saveSuccess: '',
        saveError: '',
      };
    default:
      return state;
  }
};
