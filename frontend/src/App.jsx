// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Routes, Route, Navigate } from 'react-router-dom';
// import HomePage from './Page/HomePage';
// import Layout from './layout/layout';

// function App() {

//   return (
//     <div className='flex flex-col items-center justify-start'>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<HomePage />} />
//         </Route>

//       </Routes>

//     </div>
//   )
// }

// export default App

// App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/HomePage";
import Layout from "./layout/layout";
import LoginPage from "./Page/LoginPage";
import { Signal } from "lucide-react";
import SignUp from "./Page/SignUp";

function App() {
  return (
    <div className=" ">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/sign" element={<Layout />}>
          <Route path="/sign" element={<SignUp />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
