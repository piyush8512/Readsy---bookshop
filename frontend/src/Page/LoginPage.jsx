// import React from "react";

// const LoginPage = () => {
//   return (
//     <div className="mt-16  flex items-center justify-center mx-10 ml-24 bg-orange-100">
//       <div className="border-2 border-gray-600 ">
//         <div className="w-full max-w-8xl  overflow-hidden flex flex-col md:flex-row">
//           {/* Left side - Feature description */}
//           <div className="md:w-2/3 p-8 md:p-12 bg-orange-100 flex items-center">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">
//                 Immersive Reading Mode
//               </h2>
//               <p className="text-gray-600">
//                 A synchronized ebook and audiobook feature where users can
//                 listen to the narration while the text is highlighted, offering
//                 a seamless reading and listening experience.
//               </p>
//             </div>
//           </div>

//           {/* Right side - Signup form */}
//           <div className="md:w-1/3 p-8 md:p-12 border-l-2 border-gray-500">
//             <div className="text-center mb-8">
//               <h1 className="text-2xl font-bold text-gray-800 mb-12">
//                 Create an account
//               </h1>
//               <p className="text-gray-600">
//                 One subscription for Litverse, Recognotes, and Sparks
//               </p>
//             </div>

//             {/* Social login buttons */}
//             <div className="space-y-4 mb-3">
//               <button className="w-full flex items-center justify-center py-5 px-4 border border-gray-300  text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white hover:cursor-pointer">
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
//                 </svg>
//                 Continue with Google
//               </button>

//               <button className="w-full flex items-center justify-center py-5 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white hover:cursor-pointer">
//                 <svg
//                   className="w-5 h-5 mr-2 text-blue-600"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
//                 </svg>
//                 Continue with Facebook
//               </button>
//             </div>

//             <div className="relative my-4 ">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2  text-gray-500">
//                   or sign up with email
//                 </span>
//               </div>
//             </div>

//             {/* Email form - you can expand this part */}
//             <div className="space-y-4">
//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//             <div className="space-y-4 mt-4">
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//             <button className="w-full mt-8 flex items-center justify-center py-5 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white hover:cursor-pointer">
//               Continue
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      //if login succesful then navigate to home route
      console.log("Login successful");
      window.location.href = "/";
      
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="mt-16 flex items-center justify-center mx-10 ml-24 bg-orange-100">
      <div className="border-2 border-gray-600">
        <div className="w-full max-w-8xl overflow-hidden flex flex-col md:flex-row">
          {/* Left section */}
          <div className="md:w-2/3 p-8 md:p-12 bg-orange-100 flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Immersive Reading Mode
              </h2>
              <p className="text-gray-600">
                A synchronized ebook and audiobook feature where users can
                listen to the narration while the text is highlighted, offering
                a seamless reading and listening experience.
              </p>
            </div>
          </div>

          {/* Right section - Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:w-1/3 p-8 md:p-12 border-l-2 border-gray-500"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-12">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Log in to your Litverse, Recognotes, or Sparks account
              </p>
            </div>

            {/* Social buttons */}
            <div className="space-y-4 mb-3">
              <button
                type="button"
                className="w-full flex items-center justify-center py-5 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c..."></path>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center py-5 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c..."></path>
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-orange-100 text-gray-500">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-4">
              <input
                type="email"
                {...register("email")}
                placeholder="Email address"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500" : "focus:border-indigo-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-4 mt-4">
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500" : "focus:border-indigo-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-8 flex items-center justify-center py-5 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-orange-400 hover:text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2 hover:bg-amber-500" />
                  Logging in...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
