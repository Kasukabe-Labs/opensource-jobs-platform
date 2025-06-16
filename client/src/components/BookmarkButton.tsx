import { useState } from "react";
import axios from "axios";

export const BookmarkButton = ({
  companyId,
  isBookmarkedInitial,
  onToggle,
}: {
  companyId: string;
  isBookmarkedInitial: boolean;
  onToggle: (companyId: string, newState: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarkedInitial);

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (bookmarked) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/bookmarks/${companyId}`,
          {
            withCredentials: true,
          }
        );
        setBookmarked(false);
        onToggle(companyId, false);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/bookmarks`,
          { companyId },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setBookmarked(true);
        onToggle(companyId, true);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`ml-auto px-2 py-1 rounded-full text-sm ${
        bookmarked ? "bg-yellow-300 text-black" : "bg-gray-200 text-gray-700"
      }`}
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
};
