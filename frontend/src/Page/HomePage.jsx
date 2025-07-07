import { useState } from "react";
import Card from "../components/Card";
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
  const [selectedGenre, setSelectedGenre] = useState("All");
  const genresToShow = showAll ? ALLOWED_GENRES : ALLOWED_GENRES.slice(0, 7);
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="bg-orange-100 min-h-screen p-4">
      {" "}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Categories</h1>
      {/* Genre Boxes */}
      <div className="flex flex-wrap gap-4">
        {genresToShow.map((genre, index) => (
          <div
            key={index}
            className={`px-4 py-2 border-2  text-sm md:text-base
                        font-medium transition-all duration-200 cursor-pointer
                        ${
                          selectedGenre === genre
                            ? "bg-amber-500 text-black border-amber-500 "
                            : "hover:bg-amber-500  text-gray-800"
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
      <div className="flex justify-between pr-40">
        <h1 className="text-2xl font-bold text-gray-800 my-4 pt-12">
          Popular Books
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 my-4 pt-12">More</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <div className="flex justify-between pr-40">
        <h1 className="text-2xl font-bold text-gray-800 my-4 pt-12">
          {" "}
          Recommended Books
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 my-4 pt-12">More</h1>
      </div>
      <div className="flex flex-wrap gap-4 pt-6">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default HomePage;
