import React, { useState } from "react";

const HomePage = () => {
  const ALLOWED_GENRES = [
    "All",
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Horror",
    "Biography",
    "History",
    "Self-Help",
    "Childrens",
    "Young Adult",
    "Poetry",
    "Travel",
    "Cooking",
    "Art",
    "Business",
    "Technology",
    "Science",
    "Health",
    "Education",
    "Religion",
    "Spirituality",
    "Comics",
    "Graphic Novels",
    "Manga",
    "True Crime",
    "Classics",
    "Contemporary",
  ];

  const [showAll, setShowAll] = useState(false);
  // 1. Add state to manage the selected genre, initialized to 'All'
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genresToShow = showAll ? ALLOWED_GENRES : ALLOWED_GENRES.slice(0, 7);

  // Handler for genre click
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    // You might also want to trigger fetching books for this genre here
    // e.g., fetchBooksByGenre(genre);
  };

  return (
    <div className="bg-orange-100 min-h-screen p-4">
      {" "}
      {/* Added some padding for better visibility */}
      {/* Category Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Categories</h1>
      {/* Genre Boxes */}
      <div className="flex flex-wrap gap-4">
        {genresToShow.map((genre, index) => (
          <div
            key={index} // Using index as key is okay if items don't change order or get added/removed. For stable lists, a unique ID from the genre object would be better.
            className={`px-4 py-2 border-2  text-sm md:text-base
                        font-medium transition-all duration-200 cursor-pointer
                        ${
                          selectedGenre === genre // 3. Conditionally apply classes
                            ? "bg-amber-500 text-black border-amber-500 " // Active/selected style
                            : "hover:bg-amber-500  text-gray-800" // Default and hover style
                        }`}
            onClick={() => handleGenreClick(genre)} 
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
      {/* Rest of your HomePage content would go here,
          and potentially filter books based on `selectedGenre` */}
    </div>
  );
};

export default HomePage;
