import React from 'react'
import { Search, Bell, Settings2, UserRound, ChevronDown, BellDot } from 'lucide-react'; 

const Navbar = () => {
  return (
    
    <div className="flex h-20    border-gray-600  border-y-3  ">
      
      <div className='flex flex-3/4 bg-amber-300 items-center   '>
      <div className="flex-1 max-w-full relative mr-4 md:mr-6 ml-12  ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Title, author, host, or topic" 
          className="w-150 pl-10 pr-4 py-2  border-gray-600 border-2  focus:outline-none focus:ring-2 focus:border-transparent text-sm md:text-base transition-all duration-200 bg-white"
        />
      </div>
      </div>


       <div className="flex items-center justify-between bg-orange-100 border-l-2 border-gray-600 px-4 py-2  w-fit max-w-sm space-x-4">

      {/* 👤 Profile Info */}
      <div className="flex items-center space-x-3 border-2 border-gray-600  ">
        <img
          src="https://placehold.co/40x40/FF7F00/FFFFFF?text=BW"
          alt="User Avatar"
          className="w-10 h-10  border-orange-400"
        />
        <div className="hidden md:flex flex-col text-sm">
          <span className="font-semibold text-gray-800">Bruce Wayne</span>
          <span className="text-gray-500 text-xs">Story Seeker</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
      </div>

      {/* 🔔 Notification */}
      <div className="relative hover:bg-gray-200 p-2 rounded-full cursor-pointer transition">
        <BellDot className="w-6 h-6 text-gray-700" />
      </div>
    </div>
    </div>
  )
}

export default Navbar
