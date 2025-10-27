// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MyModal from "./Components/global/MyModal";
import { useModal } from "./Components/global/ModalContext";
import PopupModel from "./Components/global/PopupModel";
import ModifyBill from "./Components/ModifyBill";

const App = () => {
  const { openModal } = useModal();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        openModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  return (
    <BrowserRouter>
      <ModifyBill />
      <AppRoutes />
      <PopupModel />
      <MyModal />
    </BrowserRouter>
  );
};

export default App;
