import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6 mt-12">
        {/* Header */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          <Button variant="secondary" onClick={onBack}>
            ← Back to Search
          </Button>
          <Label className="text-3xl font-bold">My Bookmarks</Label>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <Label>Loading bookmarks...</Label>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <Label className="text-lg opacity-60">No bookmarks yet</Label>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition">
                <CardContent className="flex gap-4 items-start p-4">
                  {/* Logo */}
                  <a
                    href={company.websiteurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Avatar className="w-16 h-16 rounded-lg">
                      <AvatarImage
                        src={company.logourl}
                        alt={company.companyname}
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;base64,..."; // Your fallback
                        }}
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {company.companyname?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </a>

                  {/* Info */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label className="text-lg font-semibold block">
                          {company.companyname}
                        </Label>
                        <Label className="text-sm block opacity-70">
                          {company.location}
                        </Label>
                        <Label className="text-sm mt-1 block line-clamp-3">
                          {company.description}
                        </Label>
                        <Label className="text-xs mt-2 block opacity-50">
                          Joined:{" "}
                          {new Date(company.created_at).toLocaleDateString()}
                        </Label>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Remove bookmark"
                        onClick={() => removeBookmark(company.id)}
                        className="text-destructive ml-4"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
