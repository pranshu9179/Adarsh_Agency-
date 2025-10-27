import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ModalProvider } from "./Components/global/ModalContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ModalProvider>
      <App />

      <Toaster />
    </ModalProvider>
  </Provider>
);
