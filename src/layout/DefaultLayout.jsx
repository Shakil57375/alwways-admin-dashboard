import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header/index.jsx";
import Sidebar from "../components/Sidebar/index.jsx";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../features/auth/authSlice.js";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useSelector(selectAccessToken);
  const navigate = useNavigate();
  
  // Close sidebar when screen size changes to prevent sidebar being open on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/auth/signin");
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Render nothing if the user is not authenticated
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main>
          <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet /> {/* Render route-specific components */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
