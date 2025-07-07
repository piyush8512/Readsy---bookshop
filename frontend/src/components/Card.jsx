import React from "react";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";

const Card = ({ coverImage, title, author, rating, isSaved, onSaveToggle }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-400" : "text-black "
          }`}
          fill={i <= rating ? "currentColor" : "black"}
          stroke="currentColor"
        />
      );
    }
    return stars;
  };

  return (
    <div className="relative flex flex-col w-48 min-w-40 border-2 border-black overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer">
      <div className="w-full h-45 flex items-center justify-center  border-b border-gray-200 m-2">
        <img
          src={coverImage}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
          {title}title
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {author}author
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center">{renderStars()}</div>
          <div className="text-black">
            <Bookmark className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
