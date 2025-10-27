import React from "react";
// Adjust path if needed asdasd
import { Outlet } from "react-router-dom";
import Navbarfrist from "../Components/Dashbord/Navbarfrist";

const Layout = () => {
  return (
    <div className='d-flex'>
      <Navbarfrist />
      <div
        className='flex-grow-1 mt-5 p-3'
        style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
