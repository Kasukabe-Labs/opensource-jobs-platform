import { useEffect, useState } from "react";
import axios from "axios";

interface Bookmark {
  id: string;
  companyname: string;
  location: string;
  description: string;
  logourl: string;
  websiteurl: string;
  created_at: string;
  updated_at: string;
}

const API_BASE = import.meta.env.VITE_API_URL;

export const BookmarksPage = ({
  onBack,
  user,
  onLoginRequired,
}: {
  onBack: () => void;
  user: any;
  onLoginRequired: () => void;
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onLoginRequired();
      return;
    }
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/bookmarks`, {
        withCredentials: true,
      });
      setBookmarks(res.data);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/bookmarks/${id}`, {
        withCredentials: true,
      });
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-100 p-6 font-sans text-zinc-800">
      <div className="max-w-3xl mx-auto space-y-6 mt-12">
        <div className="flex flex-wrap space-y-4 md:space-y-0 items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back to Search
          </button>
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading bookmarks...</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">No bookmarks yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((company) => (
              <div
                key={company.id}
                className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <a
                  href={company.websiteurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <img
                    src={company.logourl}
                    alt={company.companyname}
                    className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;base64,..."; // placeholder fallback
                    }}
                  />
                </a>

                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {company.companyname}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {company.location}
                      </p>
                      <p className="text-sm mt-1 line-clamp-3">
                        {company.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Joined:{" "}
                        {new Date(company.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBookmark(company.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-full"
                      title="Remove bookmark"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
