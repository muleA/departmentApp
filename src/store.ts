import { createStore,applyMiddleware } from "redux";   
import thunkMiddleware from "redux-thunk";  //used to support asynchronous actions 
import departmentReducer from "./Features/Department/State/reducer/department.reducer"; 
const store = createStore(departmentReducer, applyMiddleware(thunkMiddleware));  
export default store;
//Store rootReducer type 
export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch;