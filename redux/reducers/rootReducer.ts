import { combineReducers } from 'redux';
import userReducer from './adminReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer
});

export type ReducerType = ReturnType<typeof rootReducer>;
export default rootReducer;
