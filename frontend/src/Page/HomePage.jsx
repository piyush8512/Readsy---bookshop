import React, { useState } from "react";

const HomePage = () => {
  const ALLOWED_GENRES = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Romance', 'Horror', 'Biography', 'History',
    'Self-Help', 'Childrens', 'Young Adult', 'Poetry', 'Travel',
    'Cooking', 'Art', 'Business', 'Technology', 'Science',
    'Health', 'Education', 'Religion', 'Spirituality', 'Comics',
    'Graphic Novels', 'Manga', 'True Crime', 'Classics', 'Contemporary'
  ];

  const [showAll, setShowAll] = useState(false);

  const genresToShow = showAll ? ALLOWED_GENRES : ALLOWED_GENRES.slice(0, 7);

  return (
    <div className="bg-orange-100 min-h-screen ">
      {/* Category Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Categories</h1>

      {/* Genre Boxes */}
      <div className="flex flex-wrap gap-4">
        {genresToShow.map((genre, index) => (
          <div
            key={index}
            className="px-4 py-2 border-2 border-gray-600 text-sm md:text-base hover:bg-amber-500 bg-white text-gray-800 font-medium  transition-all duration-200 cursor-pointer"
          >
            {genre}
          </div>
        ))}
      </div>

      {/* Show More / Less Button */}
      {ALLOWED_GENRES.length > 7 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-700 hover:underline"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 my-4">Popular Books</h1>
    </div>
  );
};

export default HomePage;
