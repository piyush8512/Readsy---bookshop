import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Home, Grid3X3, BookOpen, Download, Bookmark, Settings, HelpCircle, LogOut, LogIn } from 'lucide-react';

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
  };

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-inter"> 
      {/* Sidebar container */}
      <div className="w-16 bg-orange-100 border-2 border-gray-600 flex flex-col items-center py-4 space-y-6 
                      sm:w-16 md:w-16 lg:w-16 xl:w-16">
        {/* Logo/Flame Icon */}
        <div className="p-2 bg-orange-500 rounded-lg shadow-md">
          <Flame className="w-6 h-6 text-white" />
        </div>

        {/* Top Navigation Items */}
        <div className="flex flex-col space-y-4 w-full px-2">
          {/* Home */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <Home className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Home</div>
          </div>
          
          {/* Category */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/category')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <Grid3X3 className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Category</div>
          </div>

          {/* Library */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/library')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <BookOpen className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Library</div>
          </div>

          {/* Download */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/downloads')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <Download className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Download</div>
          </div>

          {/* Saved */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/saved')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <Bookmark className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Saved</div>
          </div>
        </div>

        {/* Spacer to push bottom items down */}
        <div className="flex-1"></div>

        {/* Bottom Navigation Items */}
        <div className="flex flex-col space-y-6 w-full px-2">
          {/* Settings */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/settings')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <Settings className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Settings</div>
          </div>

          {/* Support */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/support')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Support</div>
          </div>

          {/* Login */}
          <div 
            className="flex flex-col items-center space-y-1 group"
            onClick={() => handleNavigation('/login')}
          >
            <div className="p-2 hover:bg-orange-200 rounded-lg cursor-pointer transition-colors duration-200">
              <LogIn className="w-6 h-6 text-gray-600 group-hover:text-orange-700" />
            </div>
            <div className="text-xs text-gray-500 text-center group-hover:text-orange-700">Login</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;