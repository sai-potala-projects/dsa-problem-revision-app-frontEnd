import { Reducer, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { userAuthReducer } from './Redux/Reducers/userAuthReducers';
import Cookie from 'js-cookie';
import { getProblemListReducer } from './Redux/Reducers/problemLIstReducers';

const cookieUserInfo = Cookie.get('userInfo') || '';

const userInfo = !!cookieUserInfo ? cookieUserInfo : null;

export const problemServiceDataInitialState = { problemData: [], loading: false, error: '' };

const initialState: any = {
  // Initial state properties
  userDetails: { userInfo },
  problemServiceData: { ...problemServiceDataInitialState },
};

const reducer: Reducer = combineReducers({
  userDetails: userAuthReducer,
  problemServiceData: getProblemListReducer,
});

const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store;
