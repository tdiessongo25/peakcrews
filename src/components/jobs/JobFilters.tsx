"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TRADES_LIST } from "@/lib/constants";
import type { Trade } from "@/lib/types";
import { ListFilter, Search, RotateCcw, MapPin, DollarSign, Star, Filter, X } from "lucide-react";
import { useState } from "react";

export function JobFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<Trade | "all">("all");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [showASAPOnly, setShowASAPOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedTrade("all");
    setLocation("");
    setPriceRange([0, 1000]);
    setMinRating(0);
    setShowASAPOnly(false);
    setSortBy("newest");
    // Add logic to re-fetch jobs with default filters
  };

  const handleApplyFilters = () => {
    // Add logic to re-fetch jobs with current filter states
    console.log({ 
      searchTerm, 
      selectedTrade, 
      location,
      priceRange,
      minRating,
      showASAPOnly, 
      sortBy 
    });
  };

  const formatPrice = (value: number) => {
    return `$${value}`;
  };

  return (
    <div className="p-4 rounded-lg border bg-card shadow">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="search-term" className="text-sm font-medium">Keywords</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-term"
              placeholder="Job title, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="trade-filter" className="text-sm font-medium">Trade</Label>
          <Select value={selectedTrade} onValueChange={(value) => setSelectedTrade(value as Trade | "all")}>
            <SelectTrigger id="trade-filter">
              <SelectValue placeholder="All Trades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {TRADES_LIST.map((trade) => (
                <SelectItem key={trade} value={trade}>{trade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
           <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
           <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Sort jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="closing_soon">Closing Soon (Urgent)</SelectItem>
              <SelectItem value="nearby">Nearby (Proximity)</SelectItem>
              <SelectItem value="rate_high_low">Rate: High to Low</SelectItem>
              <SelectItem value="rate_low_high">Rate: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 justify-self-start md:justify-self-auto pt-3">
          <Checkbox 
            id="asap-only" 
            checked={showASAPOnly}
            onCheckedChange={(checked) => setShowASAPOnly(!!checked)}
          />
          <Label htmlFor="asap-only" className="text-sm font-medium cursor-pointer">
            Show ASAP/Urgent Only
          </Label>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleApplyFilters} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <ListFilter className="h-4 w-4" /> Apply Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="space-y-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[minRating]}
                  onValueChange={([value]) => setMinRating(value)}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{minRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Location Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Locations</Label>
            <div className="flex flex-wrap gap-2">
              {['Brooklyn, NY', 'Manhattan, NY', 'Queens, NY', 'Bronx, NY', 'Staten Island, NY'].map((loc) => (
                <Button
                  key={loc}
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(loc)}
                  className="text-xs"
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(location || priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {location && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <button
                      onClick={() => setLocation("")}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    <DollarSign className="h-3 w-3" />
                    ${priceRange[0]} - ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {minRating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    <Star className="h-3 w-3 fill-yellow-400" />
                    {minRating}+ stars
                    <button
                      onClick={() => setMinRating(0)}
                      className="ml-1 hover:text-yellow-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
