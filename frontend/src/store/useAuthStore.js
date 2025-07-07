
import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";



export const  useAuthStore = create((set) =>({
        authUser:null,
    isSigninUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,

    checkAuth: async () => {
        set({isCheckingAuth:true});
        try {
            const res = await axiosInstance.get("/users/getProfile");
            console.log("check auth res", res.data);

            set({authUser:res.data});
        }catch(error){
            console.log("error in check auth", error);
            set({authUser:null});   
        }finally{
            set({isCheckingAuth:false});
        }
    },


    signup: async(data)=>{
        set({isSigninUp:true});
        try {
            const res = await axiosInstance.post("/users/register", data);
            set({authUser:res.data.user});
            toast.success(res.data.message);
        }catch(error){
            console.log("error in signup", error);
            toast.error("error in signing up");
        }finally{
            set({isSigninUp:false});
        }
    },
    login: async(data)=>{
        set({isloggingIn:true});
        try{
            const res = await axiosInstance.post("/users/login", data);
            set({authUser:res.data.user});
            toast.success(res.data.message);
        }catch(error){
            console.log("error in login", error);
            toast.error("error in logging in");
        }finally{
            set({isLoggingIn:false});

        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/users/logout");
            set({authUser:null});
            toast.success("logged out successfully");
        } catch (error) {
            console.log("error in logout", error);
            toast.error("error in logging out");
        }
    }
    
    }
))