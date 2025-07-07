import React from "react";
import { Settings } from "lucide-react";
import { CircleX  } from "lucide-react";

const Settingss = ({ showSettings, toggleSettings }) => {
  return (
    <div
      className={`fixed top-0 right-0 min-h-screen w-90 mt-20 border-l-2 border-gray-600 transform transition-transform duration-300 ease-in-out z-50
        ${showSettings ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className=" flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 mx-12">
          <h2 className="text-3xl px-4 py-7 font-semibold text-gray-800">
            Settings
          </h2>
          <button
            onClick={toggleSettings} // Close button
            className="text-black hover:text-black"
          >
            <CircleX className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-4">
          <div className="pt-4 px-4 mx-2  border-t-2   cursor-pointer text-black">
            App Language
          </div>
          <div className="pt-4 px-4 mx-2  border-t-2  cursor-pointer text-black">
            Notification
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Gift Headway
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Explore Headway for Business
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Privacy Policy
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Terms of Use
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Subscription Terms
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Manage Subscription
          </div>
          <div className="pt-4 px-4 mx-2 border-t-2  cursor-pointer text-black">
            Logout
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 items-center flex flex-col justify-center">
          <button className=" bg-orange-500 text-black py-2 flex  px-12 hover:bg-orange-600 transition-colors flex-col items-center">
            Contact Support
          </button>
          <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center">
            Version 264.2.0.5566
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settingss;
