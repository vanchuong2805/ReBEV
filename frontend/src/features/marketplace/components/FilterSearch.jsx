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

  // Load filters từ URL. We support variation_value_id as repeated params
  // (e.g. ?variation_value_id=1&variation_value_id=2) and map them into the
  // per-section selected arrays using the variationData we fetched earlier.
  useEffect(() => {
    // parse categories (may be single or repeated)
    const categoriesRaw = searchParams.getAll("categories");
    const categories = categoriesRaw.length ? categoriesRaw.map(Number) : [];

    // parse variation ids from repeated params
    const variationIds = searchParams
      .getAll("variation_value_id")
      .map((v) => Number(v));

    // Helper to pick ids that belong to a group
    const pickIds = (groupItems) => {
      if (!groupItems || groupItems.length === 0) return [];
      const ids = groupItems.map((it) => it.id);
      return variationIds.filter((vid) => ids.includes(vid));
    };

    setFilters({
      categories,
      brands: pickIds(variationData.brands || []),
      powers: pickIds(variationData.powers || []),
      years: pickIds(variationData.years || []),
      origins: pickIds(variationData.origins || []),
      batteryTypes: pickIds(variationData.batteryTypes || []),
      batteryBrands: pickIds(variationData.batteryBrands || []),
      batteryConditions: pickIds(variationData.batteryConditions || []),
    });

    const minFromUrl = Number(searchParams.get("min_price")) || priceMin;
    const maxFromUrl = Number(searchParams.get("max_price")) || priceMax;
    setPriceRange([minFromUrl, maxFromUrl]);
  }, [searchParams, priceMin, priceMax, variationData]);

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

      // For other filters: enforce single-select behavior
      // If value is already selected -> clear it. Otherwise set as the only selection.
      const current = prev[filterType] || [];
      const isSelected = current.includes(value);
      return { ...prev, [filterType]: isSelected ? [] : [value] };
    });
  };

  const handleCategoryChange = (categoryId) => {
    handleCheckboxChange("categories", categoryId);
  };

  const applyFilters = () => {
    // Tạo params mới, giữ các params quan trọng như search và province_id
    const params = new URLSearchParams();

    // Giữ search query nếu có
    const searchQuery = searchParams.get("search");
    if (searchQuery) params.set("search", searchQuery);

    // Preserve province_id so it doesn't get lost
    const provinceId = searchParams.get("province_id");
    if (provinceId) params.set("province_id", provinceId);

    // Helper to set comma-separated numeric lists
    const setParam = (key, values) => {
      if (values && values.length > 0) {
        params.set(key, values.join(","));
      }
    };

    setParam("categories", filters.categories);

    // Collect all selected variation value ids into a single variation_value_id param
    const variationIds = [
      ...(filters.brands || []),
      ...(filters.powers || []),
      ...(filters.years || []),
      ...(filters.origins || []),
      ...(filters.batteryTypes || []),
      ...(filters.batteryBrands || []),
      ...(filters.batteryConditions || []),
    ].filter(Boolean);

    if (variationIds.length > 0) {
      // Keep the previous behavior: send as a single comma-separated value
      // e.g. ?variation_value_id=1,2,3 which the backend expects.
      params.set("variation_value_id", variationIds.join(","));
    }

    // Do NOT add human-readable filter params (brands, powers, ...) to URL
    // Only send numeric variation_value_id to backend for filtering. Keeping
    // those readable params in the URL caused mismatch with backend expectations.

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
    const provinceId = searchParams.get("province_id");
    if (searchQuery) params.set("search", searchQuery);
    if (provinceId) params.set("province_id", provinceId);
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
