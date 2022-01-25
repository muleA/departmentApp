import { createStore,applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from "redux-thunk";  //used to support asynchronous actions 
import departmentReducer from "./Features/Department/State/reducer/department.reducer"; 
const store = createStore(departmentReducer, composeWithDevTools(
    applyMiddleware(thunkMiddleware)));   

export default store;
//Store rootReducer type 
export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch;