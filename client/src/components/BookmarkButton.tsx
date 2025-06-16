import { useState } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

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
      // Show login dialog if user is not authenticated
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        onToggle(companyId, false); // This will trigger login dialog in parent
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`ml-auto p-2 rounded-full transition-all duration-200 ${
        bookmarked
          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {loading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="text-lg text-yellow-600">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </span>
      )}
    </button>
  );
};
