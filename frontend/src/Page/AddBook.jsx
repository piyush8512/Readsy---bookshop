import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema } from "../schema/bookSchema";
import { useBookStore } from "../store/useBookStore"; // Import the store
import {
  BookOpen,
  User,
  FileText,
  DollarSign,
  Image,
  Tag,
  Calendar,
  Package,
  Star,
  Building,
  Globe,
  Save,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";


const AddBook = ({ token }) => {
  const { addBook, isAddingBook, addBookStatus } = useBookStore(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isFeatured: false,
      genre: [],
    },
  });

  const watchedCoverImage = watch("coverImageUrl");

  const [additionalImages, setAdditionalImages] = useState([
    null,
    null,
    null,
    null,
  ]);

  const handleAdditionalImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...additionalImages];
      newImages[index] = e.target.files[0];
      setAdditionalImages(newImages);
    }
  };


  const onSubmit = async (data) => {

    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            // For genre, if it's a string from input, split it by comma
            if (key === "genre" && typeof data[key] === "string") {
              data[key]
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => formData.append(`${key}[]`, item));
            } else {
              data[key].forEach((item) => formData.append(`${key}[]`, item));
            }
          } else if (data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (typeof data[key] === "boolean") {
            formData.append(key, data[key] ? "true" : "false");
          } else {
            formData.append(key, data[key]);
          }
        }
      }

      additionalImages.forEach((image, index) => {
        if (image) {
          formData.append(`additionalImage${index + 1}`, image);
        }
      });

      const response = await addBook(formData, token);

      if (response.success) {
        reset(); 
        setAdditionalImages([null, null, null, null]);
      }
    } catch (err) {
      console.error("Error adding book from component:", err);
    }
  };

  return (
    <div className="min-h-screen border-2 border-gray-600 mt-6 flex flex-col lg:flex-row">
      <div className="max-w-3xl border-r-2 border-black p-8 lg:w-3/5">
        {/* Header */}
        {/* Success/Error Messages - Now use addBookStatus from the store */}
        {addBookStatus === "success" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Book successfully added to the library!
            </p>
          </div>
        )}

        {addBookStatus === "error" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">
              Failed to add book. Please try again.
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <div className=" px-8 ">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-black" />
              <h2 className="text-2xl font-bold text-black">Book Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="border-b pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-black" />
                <span>Basic Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>Title</span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="Enter book title"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:border-transparent transition-all duration-200"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.title.message}</span>
                    </p>
                  )}
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4 text-black" />
                    <span>Author</span>
                  </label>
                  <input
                    {...register("author")}
                    placeholder="Enter author name"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:border-transparent transition-all duration-200"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.author.message}</span>
                    </p>
                  )}
                </div>

                {/* Publisher */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-black" />
                    <span>Publisher</span>
                  </label>
                  <input
                    {...register("publisher")}
                    placeholder="Enter publisher name"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.publisher && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.publisher.message}</span>
                    </p>
                  )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-black" />
                    <span>Language</span>
                  </label>
                  <input
                    {...register("language")}
                    placeholder="Enter language"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.language && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.language.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 mt-6">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-black" />
                  <span>Description</span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Enter book description"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.description.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Pricing & Publication Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Pricing & Publication</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-black" />
                    <span>Price ($)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.price.message}</span>
                    </p>
                  )}
                </div>

                {/* Publication Year */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>Publication Year</span>
                  </label>
                  <input
                    type="number"
                    {...register("publicationYear")}
                    placeholder="2024"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.publicationYear && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.publicationYear.message}</span>
                    </p>
                  )}
                </div>

                {/* Stock Quantity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-black" />
                    <span>Stock Quantity</span>
                  </label>
                  <input
                    type="number"
                    {...register("stockQuantity")}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.stockQuantity && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.stockQuantity.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images & Media Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Image className="w-5 h-5 text-purple-600" />
                <span>Images & Media</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Image className="w-4 h-4 text-black" />
                    <span>Cover Image</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setValue("coverImageUrl", e.target.files?.[0]);
                    }}
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  {errors.coverImageUrl && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.coverImageUrl.message}</span>
                    </p>
                  )}
                  {watchedCoverImage &&
                    typeof watchedCoverImage !== "string" && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(watchedCoverImage)}
                          alt="Cover preview"
                          className="w-32 h-40 object-cover shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                </div>
              </div>

              {/* Additional Images (up to 4) */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-4">
                  Additional Gallery Images (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Image className="w-4 h-4 text-black" />
                        <span>Image {index + 1}</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageChange(e, index)}
                        className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                      />
                      {additionalImages[index] && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(additionalImages[index])}
                            alt={`Additional Image ${index + 1} preview`}
                            className="w-24 h-24 object-cover shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories & Features Section */}
            <div className="pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <span>Categories & Features</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-black" />
                    <span>Genres</span>
                  </label>
                  <input
                    {...register("genre", {})}
                    placeholder="Fiction, Drama, Romance (comma separated)"
                    className="w-full px-4 py-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.genre && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.genre.message}</span>
                    </p>
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Star className="w-4 h-4 text-black" />
                    <span>Featured Status</span>
                  </label>
                  <div className="flex items-center space-x-3 mt-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isFeatured")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Mark as Featured Book
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-black">
              <button
                type="submit"
                disabled={isAddingBook}
                className={`w-full flex items-center justify-center space-x-3 px-8 py-4 font-semibold text-black transition-all duration-200 border-2 border-black ${
                  isAddingBook
                    ? "cursor-not-allowed opacity-70"
                    : "hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isAddingBook ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-black"></div>
                    <span>Adding Book...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Add Book to Library</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Book Previews */}
      <div className="lg:w-2/5 p-8 flex flex-col items-center justify-start pt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Image className="w-6 h-6 text-indigo-600" />
          <span>Book Previews</span>
        </h2>
        {/* Main Cover Image Section */}
        <div className="mb-8 w-full max-w-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Cover Image
          </h3>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg aspect-[3/4] flex items-center justify-center bg-gray-100">
            {watchedCoverImage && typeof watchedCoverImage !== "string" ? (
              <img
                src={URL.createObjectURL(watchedCoverImage)}
                alt="Book Cover Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-gray-400">No Cover Image Selected</span>
            )}
          </div>
        </div>
        {/* Four Small Additional Image Boxes */}
        <div className="w-full max-w-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Additional Images
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {additionalImages.map((image, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm aspect-square flex items-center justify-center bg-gray-100"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Additional Book Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No image</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
