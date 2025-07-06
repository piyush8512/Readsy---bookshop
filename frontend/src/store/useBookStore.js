import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useBookStore = create((set) => ({
  isAddingBook: false,
  addBookStatus: "idle", 
    addBook: async (formData, token) => {
    set({ isAddingBook: true, addBookStatus: "idle" });
    try {
      const res = await axiosInstance.post("/books", formData, {
        headers: {
          token: token, 
          "Content-Type": "multipart/form-data", 
        },
      });

      if (res.data.success) {
        set({ addBookStatus: "success" });
        toast.success(res.data.message || "Book added successfully!");
      } else {
        set({ addBookStatus: "error" });
        toast.error(res.data.message || "Failed to add book.");
      }
      return res.data; 
    } catch (error) {
      console.error("Error adding book:", error);
      set({ addBookStatus: "error" });
      toast.error(error.response?.data?.message || "Something went wrong.");
      throw error;
    } finally {
      set({ isAddingBook: false });
      // Optionally reset status after a short delay
    //   setTimeout(() => set({ addBookStatus: "idle" }), 3000);
    }
  },
}));