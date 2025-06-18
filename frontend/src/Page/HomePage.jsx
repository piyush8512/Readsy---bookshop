import React from "react";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  return (
    <div>
      <Sidebar />
      <div className="text-6xl text-red-500 font-bold text-center mt-40">
        🚀 Tailwind is Working!
      </div>
    </div>
  );
};

export default HomePage;
