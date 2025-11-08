// FilterSearch - Simplified version
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVariationValues } from "../service";
import CategoryFilter from "./CategoryFilter";
import FilterSection from "./FilterSection";
import PriceRangeFilter from "./PriceRangeFilter";

export default function FilterSearch({ priceMin = 0, priceMax = 0 }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [variationData, setVariationData] = useState({});
  const [loading, setLoading] = useState(true);

  // State cho sections mở/đóng
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    power: false,
    year: false,
    origin: false,
    batteryType: false,
    batteryBrand: false,
    batteryCondition: false,
    price: true,
  });

  // Filters từ URL
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    powers: [],
    years: [],
    origins: [],
    batteryTypes: [],
    batteryBrands: [],
    batteryConditions: [],
  });

  const [priceRange, setPriceRange] = useState([priceMin, priceMax]);

  // Fetch variation values
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        setLoading(true);
        const data = await getVariationValues();

        const grouped = {
          brands: data.filter(
            (item) => item.variation_id === 1 && item.parent_id === null
          ),
          powers: data.filter((item) => item.variation_id === 3),
          years: data.filter((item) => item.variation_id === 4),
          origins: data.filter((item) => item.variation_id === 6),
          batteryTypes: data.filter((item) => item.variation_id === 8),
          batteryBrands: data.filter((item) => item.variation_id === 15),
          batteryConditions: data.filter((item) => item.variation_id === 14),
        };

        setVariationData(grouped);
      } catch (error) {
        console.error("❌ Error fetching variations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariations();
  }, []);

  // Load filters từ URL
  useEffect(() => {
    const parseParam = (key) =>
      searchParams.get(key)?.split(",").filter(Boolean) || [];

    setFilters({
      categories: parseParam("categories").map(Number),
      brands: parseParam("brands"),
      powers: parseParam("powers"),
      years: parseParam("years"),
      origins: parseParam("origins"),
      batteryTypes: parseParam("batteryTypes"),
      batteryBrands: parseParam("batteryBrands"),
      batteryConditions: parseParam("batteryConditions"),
    });

    const minFromUrl = Number(searchParams.get("minPrice")) || priceMin;
    const maxFromUrl = Number(searchParams.get("maxPrice")) || priceMax;
    setPriceRange([minFromUrl, maxFromUrl]);
  }, [searchParams, priceMin, priceMax]);

  // Update price range when props change
  useEffect(() => {
    if (priceMin !== priceMax && priceRange[0] === 0 && priceRange[1] === 0) {
      setPriceRange([priceMin, priceMax]);
    }
  }, [priceMin, priceMax, priceRange]);

  const selectedCategory = filters.categories[0];
  const isVehicleCategory = selectedCategory === 1;
  const isBatteryCategory = selectedCategory === 2;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prev) => {
      // Category: chỉ cho chọn 1
      if (filterType === "categories") {
        const isSelected = prev.categories.includes(value);
        if (isSelected) return { ...prev, categories: [] };

        const newFilters = { ...prev, categories: [value] };
        // Clear irrelevant filters
        if (value === 1) {
          // Xe -> clear battery filters
          newFilters.batteryTypes = [];
          newFilters.batteryBrands = [];
          newFilters.batteryConditions = [];
        } else if (value === 2) {
          // Pin -> clear vehicle filters
          newFilters.brands = [];
          newFilters.powers = [];
        }
        return newFilters;
      }

      // Normal toggle
      const current = prev[filterType];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterType]: updated };
    });
  };

  const handleCategoryChange = (categoryId) => {
    handleCheckboxChange("categories", categoryId);
  };

  const applyFilters = () => {
    // Tạo params mới, chỉ giữ search query nếu có
    const params = new URLSearchParams();

    // Giữ search query nếu có
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    const setParam = (key, values) => {
      if (values && values.length > 0) {
        params.set(key, values.join(","));
      }
    };

    setParam("categories", filters.categories);
    setParam("brands", filters.brands);
    setParam("powers", filters.powers);
    setParam("years", filters.years);
    setParam("origins", filters.origins);
    setParam("batteryTypes", filters.batteryTypes);
    setParam("batteryBrands", filters.batteryBrands);
    setParam("batteryConditions", filters.batteryConditions);

    if (priceRange[0] !== priceMin || priceRange[1] !== priceMax) {
      params.set("min_price", priceRange[0]);
      params.set("max_price", priceRange[1]);
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      powers: [],
      years: [],
      origins: [],
      batteryTypes: [],
      batteryBrands: [],
      batteryConditions: [],
    });
    setPriceRange([priceMin, priceMax]);

    // Tạo params mới, chỉ giữ search query
    const params = new URLSearchParams();
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="hidden w-64 p-4 space-y-4 bg-white border rounded-lg lg:block">
        <div className="text-sm text-gray-500">Đang tải bộ lọc...</div>
      </div>
    );
  }

  return (
    <div className="hidden w-64 space-y-4 lg:block">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Category */}
        <CategoryFilter
          selectedCategories={filters.categories}
          onCategoryChange={handleCategoryChange}
          isOpen={openSections.category}
          onToggleSection={() => toggleSection("category")}
        />

        {/* Vehicle Filters */}
        {(isVehicleCategory || !selectedCategory) && (
          <>
            <FilterSection
              title="Hãng xe"
              items={variationData.brands || []}
              selectedValues={filters.brands}
              onToggle={handleCheckboxChange}
              filterKey="brands"
              isOpen={openSections.brand}
              onToggleSection={() => toggleSection("brand")}
            />
            <FilterSection
              title="Công suất"
              items={variationData.powers || []}
              selectedValues={filters.powers}
              onToggle={handleCheckboxChange}
              filterKey="powers"
              isOpen={openSections.power}
              onToggleSection={() => toggleSection("power")}
            />
          </>
        )}

        {/* Battery Filters */}
        {(isBatteryCategory || !selectedCategory) && (
          <>
            <FilterSection
              title="Loại pin"
              items={variationData.batteryTypes || []}
              selectedValues={filters.batteryTypes}
              onToggle={handleCheckboxChange}
              filterKey="batteryTypes"
              isOpen={openSections.batteryType}
              onToggleSection={() => toggleSection("batteryType")}
            />
            <FilterSection
              title="Hãng pin"
              items={variationData.batteryBrands || []}
              selectedValues={filters.batteryBrands}
              onToggle={handleCheckboxChange}
              filterKey="batteryBrands"
              isOpen={openSections.batteryBrand}
              onToggleSection={() => toggleSection("batteryBrand")}
            />
            <FilterSection
              title="Tình trạng pin"
              items={variationData.batteryConditions || []}
              selectedValues={filters.batteryConditions}
              onToggle={handleCheckboxChange}
              filterKey="batteryConditions"
              isOpen={openSections.batteryCondition}
              onToggleSection={() => toggleSection("batteryCondition")}
            />
          </>
        )}

        {/* Common Filters */}
        <FilterSection
          title="Năm sản xuất"
          items={variationData.years || []}
          selectedValues={filters.years}
          onToggle={handleCheckboxChange}
          filterKey="years"
          isOpen={openSections.year}
          onToggleSection={() => toggleSection("year")}
        />
        <FilterSection
          title="Xuất xứ"
          items={variationData.origins || []}
          selectedValues={filters.origins}
          onToggle={handleCheckboxChange}
          filterKey="origins"
          isOpen={openSections.origin}
          onToggleSection={() => toggleSection("origin")}
        />

        {/* Price Range */}
        <PriceRangeFilter
          priceMin={priceMin}
          priceMax={priceMax}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          isOpen={openSections.price}
          onToggleSection={() => toggleSection("price")}
        />
      </div>

      {/* Apply Button */}
      <Button onClick={applyFilters} className="w-full">
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}
