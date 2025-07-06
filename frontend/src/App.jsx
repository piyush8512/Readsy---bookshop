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
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import AddBook from "./Page/AddBook";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className=" ">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        {/* <Route path="/login" element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route> */}
        <Route path="/login" element={<Layout />}>
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
        </Route>
        {/* <Route path="/sign" element={<Layout />}>
          <Route path="/sign" element={<SignUp />} />
        </Route> */}
        <Route
          path="/sign"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        />

        {/* <Route path="/addbook" element={<Layout />}>
          <Route path="/addbook"
            element={
              authUser && authUser.role === "" ? (
                <AddBook />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
        </Route> */}
          <Route path="/addbook" element={<Layout />}>
          <Route path="/addbook" element={<AddBook />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
