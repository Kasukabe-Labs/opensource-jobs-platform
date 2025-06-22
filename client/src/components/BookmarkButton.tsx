import { useState } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
    <Button
      onClick={toggleBookmark}
      disabled={loading}
      variant="ghost"
      size="icon"
      className={cn(
        "ml-auto transition-transform",
        loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110",
        bookmarked ? "text-yellow-600" : "text-gray-500"
      )}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {loading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : bookmarked ? (
        <FaBookmark className="text-lg" />
      ) : (
        <FaRegBookmark className="text-lg" />
      )}
    </Button>
  );
};
