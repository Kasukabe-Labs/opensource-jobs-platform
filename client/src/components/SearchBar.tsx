import type { SearchFilters } from "../types/SearchFIlters";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    <Card className="mb-6">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search companies..."
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div className="md:w-64">
            <Select value={filters.location} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Locations</SelectLabel>
                  {locations?.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.location) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onLocationChange("");
            }}
          >
            Clear all filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
