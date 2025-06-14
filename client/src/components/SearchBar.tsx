import type { SearchFilters } from "../types/SearchFIlters";

export const SearchBar = ({
  onSearchChange,
  onLocationChange,
  filters,
  locations,
}: {
  onSearchChange: (search: string) => void;
  onLocationChange: (location: string) => void;
  filters: SearchFilters;
  locations: string[];
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Location Filter */}
        <div className="md:w-64">
          <select
            value={filters.location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.search || filters.location) && (
        <button
          onClick={() => {
            onSearchChange("");
            onLocationChange("");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};
