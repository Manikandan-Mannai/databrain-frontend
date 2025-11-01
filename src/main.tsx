// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import store from "./redux/store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { hydrate } from "./redux/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

store.dispatch(hydrate());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
