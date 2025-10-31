import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
// import dashboardSlice from "../slices/dashboardSlice";
import chartSlice from "../slices/chartSlice";
import dataReducer from "../slices/dataSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  // dashboard: dashboardSlice,
  chart: chartSlice,
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
