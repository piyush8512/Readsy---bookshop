import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/sign";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-orange-100 font-inter">
      <div className="fixed h-full  z-10">
          <Sidebar />
        </div>
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!isLoginPage ? "md:ml-16" : ""}`}>
        {/* Fixed Navbar - hidden on login page */}
        {!isLoginPage && (
          <div className="fixed w-full md:w-[calc(100%-4rem)] z-10">
            <Navbar />
          </div>
        )}
        {/* Scrollable Content */}
        <div className={`flex-1 p-4 md:p-6 overflow-y-auto ${
          !isLoginPage ? "pt-16 md:pt-20 mt-16 md:mt-0" : ""
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;