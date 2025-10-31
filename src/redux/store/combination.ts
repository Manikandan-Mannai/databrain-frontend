import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import chartSlice from "../slices/chartSlice";
import dataReducer from "../slices/dataSlice";
import queryReducer from "../slices/querySlice"; 

const rootReducer = combineReducers({
  auth: authSlice,
  chart: chartSlice,
  data: dataReducer,
  query: queryReducer, // ← ADD THIS
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
