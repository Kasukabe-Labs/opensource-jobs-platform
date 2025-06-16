import { useState } from "react";

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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/bookmarks/${companyId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (res.ok) {
          setBookmarked(false);
          onToggle(companyId, false);
        }
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/bookmarks`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyId }),
        });

        if (res.ok) {
          setBookmarked(true);
          onToggle(companyId, true);
        }
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
