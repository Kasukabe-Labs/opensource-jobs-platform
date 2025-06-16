import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { Company } from "./types/Company";
import type { SearchFilters } from "./types/SearchFIlters";
import { useDebounce } from "./hooks/useDebouce";
import { SearchBar } from "./components/SearchBar";
import { CompanyCard } from "./components/CompanyCard";
import { BookmarksPage } from "./components/BookmarksPage";
import { LoginDialog } from "./components/LoginDialog";
import { useAuth } from "./hooks/useAuth";
import axios from "axios";

function App() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [currentPage, setCurrentPage] = useState<"home" | "bookmarks">("home");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    location: "",
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const { user, loading: authLoading, checkAuth } = useAuth();
  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE}/bookmarks`, {
        withCredentials: true,
      });
      setBookmarkedIds(new Set(res.data.bookmarkedCompanyIds));
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
    }
  };

  const handleBookmarkToggle = (id: string, state: boolean) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      state ? updated.add(id) : updated.delete(id);
      return updated;
    });
  };

  const fetchCompanies = useCallback(
    async (
      resetList = false,
      currentCursor: string | null = null,
      searchTerm = "",
      locationFilter = ""
    ) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          limit: "20",
          ...(currentCursor && { cursor: currentCursor }),
          ...(searchTerm.trim() && { search: searchTerm.trim() }),
          ...(locationFilter.trim() && { location: locationFilter.trim() }),
        });

        const res = await fetch(`${API_BASE}/search?${params}`);
        const data = await res.json();

        setCompanies((prev) =>
          resetList ? data.companiesData : [...prev, ...data.companiesData]
        );
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE]
  );

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/locations`);
      const data = await res.json();
      setLocations(data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, [API_BASE]);

  useEffect(() => {
    setCursor(null);
    setHasMore(true);
    fetchCompanies(true, null, debouncedSearch, filters.location);
  }, [debouncedSearch, filters.location, fetchCompanies]);

  // Initial load
  useEffect(() => {
    fetchCompanies(true);
    fetchLocations();
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchCompanies(false, cursor, debouncedSearch, filters.location);
        }
      });

      if (node) observer.current.observe(node);
    },
    [
      loading,
      hasMore,
      cursor,
      debouncedSearch,
      filters.location,
      fetchCompanies,
    ]
  );

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const handleLocationChange = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const resultsInfo = useMemo(() => {
    const hasFilters = filters.search || filters.location;
    const filterText = [];

    if (filters.search) filterText.push(`"${filters.search}"`);
    if (filters.location) filterText.push(`in ${filters.location}`);

    return hasFilters
      ? `Showing results for ${filterText.join(" ")} • ${
          companies.length
        } companies found`
      : `${companies.length} companies`;
  }, [filters, companies.length]);

  if (currentPage === "bookmarks") {
    return (
      <BookmarksPage
        onBack={() => setCurrentPage("home")}
        user={user}
        onLoginRequired={() => setShowLoginDialog(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6 font-sans text-zinc-800">
      <div className="max-w-3xl mx-auto space-y-6 mt-12">
        <div className="flex flex-wrap space-y-4 md:space-y-0 justify-between items-center">
          <h1 className="text-3xl font-bold">Remote OSS Companies Finder</h1>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setCurrentPage("bookmarks")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>📚</span>
                My Bookmarks
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.profile_picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user.name}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginDialog(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <SearchBar
          onSearchChange={handleSearchChange}
          onLocationChange={handleLocationChange}
          filters={filters}
          locations={locations}
        />

        <div className="mb-4">
          <p className="text-sm text-gray-600">{resultsInfo}</p>
        </div>

        <div className="space-y-6">
          {companies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              isLast={index === companies.length - 1}
              ref={index === companies.length - 1 ? lastCompanyRef : undefined}
              isBookmarked={bookmarkedIds.has(company.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-500">Loading companies...</span>
            </div>
          </div>
        )}

        {!hasMore && companies.length > 0 && (
          <p className="text-center text-gray-400 py-8">
            You've reached the end.
          </p>
        )}

        {!loading && companies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No companies found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        apiUrl={API_BASE}
      />
    </div>
  );
}

export default App;
