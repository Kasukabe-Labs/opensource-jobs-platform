import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { Company } from "./types/Company";
import type { SearchFilters } from "./types/SearchFIlters";
import { useDebounce } from "./hooks/useDebouce";
import { SearchBar } from "./components/SearchBar";
import { CompanyCard } from "./components/CompanyCard";

function App() {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    location: "",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

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
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyRef = useCallback(
    (node: HTMLAnchorElement | null) => {
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

  return (
    <div className="min-h-screen bg-zinc-100 p-6 font-sans text-zinc-800">
      <div className="max-w-3xl mx-auto space-y-6 mt-12">
        <h1 className="text-3xl font-bold text-center mb-4">
          Remote OSS Companies Finder
        </h1>

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
    </div>
  );
}

export default App;
