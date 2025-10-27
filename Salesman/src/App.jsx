import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./ComponentsCreated/SideBar/SideBar";
import Dashboard from "./ComponentsCreated/DashBoard/Dashboard";
import Login from "./ComponentsCreated/Login/Login";
import MobileBillForm from "./ComponentsCreated/AddBill/AddBill";
import ProtectedRoute from "./ComponentsCreated/ProtectedRoute/ProtectedRoutes";

function App() {
  const [userDetail, setUserDetail] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  return (
    <BrowserRouter>
      {/* Sidebar overlay (fixed, doesn’t push content) */}
      <SideBar userName={userDetail} />

      {/* Main content always full screen */}
      <div className="flex justify-center items-start min-h-screen w-full p-6">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard userDetail={userDetail} setUserDetail={setUserDetail} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login setUserDetail={setUserDetail} />}
          />
          <Route
            path="/addbill"
            element={
              <ProtectedRoute>
                <MobileBillForm userDetail={userDetail} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
