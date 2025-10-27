import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Home, Users } from "lucide-react";

import axios from "../../Config/axios";
import { toast } from "react-toastify";

const SideBar = ({ userName }) => {
  const navigate = useNavigate();

  console.log(userName);

  const handleLogOut = async () => {
    try {
      const res = await axios.get("/logout", { withCredentials: true });
      console.log(res.data);

      if (res.data?.success) {
        toast.success("User logged out successfully");
        localStorage.removeItem("userData");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userNameLocal = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <div className="flex">
        {/* {isOpen && ( */}
        <Sidebar className="fixed left-0 top-0 h-screen w-64 z-40 bg-white shadow-lg">
          <SidebarHeader>
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-xl font-bold">My App</h2>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>User</SidebarGroupLabel>
              <SidebarGroupContent>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer">
                    <Users size={18} />
                    <span>{userNameLocal?.data?.name || "Guest"}</span>
                  </li>
                </ul>
              </SidebarGroupContent>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <ul className="space-y-1">
                  <Link
                    to={"/"}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>

                  <Link
                    to={"/addbill"}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <Users size={18} />

                    <span>Add Bill</span>
                  </Link>
                </ul>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-3 py-2 text-sm">
              <button
                className=" text-xs hover:underline border p-2 bg-blue-700 text-white rounded"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarTrigger className=" left-4 relative top-4 z-50 p-4 cursor-pointer" />
      </div>
    </>
  );
};

export default SideBar;
