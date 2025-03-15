import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/index.jsx";
import Sidebar from "../components/Sidebar/index.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../features/auth/authSlice.js";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useSelector(selectAccessToken)

  if (!token) {
    return null; // Render nothing if the user is not authenticated
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet /> {/* Render route-specific components */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
