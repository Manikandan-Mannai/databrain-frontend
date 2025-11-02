import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import chartSlice from "../slices/chartSlice";
import dashboardReducer from "../slices/dashboardSlice";
import dataReducer from "../slices/dataSlice";
import queryReducer from "../slices/querySlice";
import themeReducer from "../slices/themeSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  chart: chartSlice,
  data: dataReducer,
  query: queryReducer,
  dashboard: dashboardReducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
