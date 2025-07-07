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
import Saved from "./Page/Saved";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  console.log("Auth_User", authUser);
  const isAdmin = authUser?.data?.role === "admin";
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
        <Route path="/saved" element={<Layout />}>
          <Route index element={<Saved />} />
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

        <Route path="/addbook" element={<Layout />}>
          <Route
            path="/addbook"
            element={authUser && isAdmin ? <AddBook /> : <Navigate to={"/"} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
