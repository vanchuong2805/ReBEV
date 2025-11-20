import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  getPostById,
  getVariations,
  getVariationValues,
  getPosts,
} from "../../marketplace/service";
import { ArrowLeft, X, Plus, ChevronUp, ChevronDown } from "lucide-react";

function currency(v) {
  return typeof v === "number" ? v.toLocaleString("vi-VN") + " ₫" : v;
}

// Helper để parse media và lấy thumbnail
function getThumb(media) {
  try {
    const arr = typeof media === "string" ? JSON.parse(media) : media || [];
    const pick = arr.find((m) => m.is_thumbnail) || arr[0];
    if (!pick?.url) return "/placeholder.webp";
    // Cắt bỏ "image " hoặc "video " ở đầu
    return pick.url.replace(/^(image|video)\s+/, "");
  } catch {
    return "/placeholder.webp";
  }
}

export default function CompareListing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variationValues, setVariationValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Toggle collapse section
  const toggleSection = (sectionName) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Open modal and fetch products from same category
  const openAddProductModal = async () => {
    setShowModal(true);
    setLoadingProducts(true);
    try {
      // Get category from first product
      const categoryId = products[0]?.category_id;
      const filters = categoryId ? { category_id: categoryId } : {};
      const allProducts = await getPosts(filters);

      // Filter out products already in compare list
      const currentIds = products.map((p) => p.id);
      const filtered = allProducts.filter((p) => !currentIds.includes(p.id));
      setAvailableProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add product to compare
  const addProductToCompare = (productId) => {
    const currentIds = products.map((p) => p.id);
    const newIds = [...currentIds, productId].join(",");
    navigate(`/marketplace/compare?ids=${newIds}`, { replace: true });
    setShowModal(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Lấy danh sách IDs từ URL: ?ids=1,2,3
        const idsParam = searchParams.get("ids");
        if (!idsParam) {
          setError("Không có sản phẩm để so sánh");
          setLoading(false);
          return;
        }

        const ids = idsParam.split(",").filter(Boolean);
        if (ids.length === 0) {
          setError("Không có sản phẩm để so sánh");
          setLoading(false);
          return;
        }

        // Fetch variations, variation values và products song song
        const [variationsData, variationValuesData, ...productsData] =
          await Promise.all([
            getVariations(),
            getVariationValues(),
            ...ids.map((id) => getPostById(id)),
          ]);

        console.log("Variations data:", variationsData);
        console.log("Variation values data:", variationValuesData);
        console.log("Products data:", productsData);

        setVariations(variationsData);
        setVariationValues(variationValuesData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải sản phẩm để so sánh");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Lấy tất cả variation_ids từ các sản phẩm
  const allVariationIds = Array.from(
    new Set(
      products.flatMap((p) => (p.post_details || []).map((d) => d.variation_id))
    )
  ).filter(Boolean);

  // Nhóm variations theo category/section
  const groupedVariations = {};
  allVariationIds.forEach((varId) => {
    const variation = variations.find((v) => v.id === varId);
    if (variation) {
      const category = variation.category || "Thông số khác";
      if (!groupedVariations[category]) {
        groupedVariations[category] = [];
      }
      groupedVariations[category].push(varId);
    }
  });

  // Map variation_id sang tên variation
  const getVariationName = (variationId) => {
    const v = variations.find((variation) => variation.id === variationId);
    return v?.name || "Không rõ";
  };

  // Remove product
  const removeProduct = (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    if (updatedProducts.length === 0) {
      navigate("/marketplace/all");
      return;
    }
    const ids = updatedProducts.map((p) => p.id).join(",");
    navigate(`/marketplace/compare?ids=${ids}`, { replace: true });
  };

  // Check if a variation has differences across products
  const hasDifferences = (varId) => {
    const values = products.map((product) => {
      const detail = (product.post_details || []).find(
        (d) => d.variation_id === varId
      );
      if (!detail) return null;
      if (detail.custom_value && detail.custom_value !== "null") {
        return detail.custom_value;
      }
      if (detail.variation_value_id) {
        const varValue = variationValues.find(
          (vv) => vv.id === detail.variation_value_id
        );
        return varValue?.value || null;
      }
      return null;
    });

    // Check if all values are the same
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length > 1;
  };

  if (loading) {
    return (
      <>
        <div className="container px-4 py-8 mx-auto">
          <div className="py-20 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container px-4 py-8 mx-auto">
          <div className="py-20 text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <Link
              to="/marketplace/all"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại marketplace
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto max-w-7xl">
          <Link
            to="/marketplace/all"
            className="inline-flex items-center gap-2 mb-3 text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại marketplace
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                So sánh sản phẩm
              </h1>
              <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                {products.length} sản phẩm
              </span>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showDifferencesOnly}
                onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Chỉ hiển thị điểm khác biệt
            </label>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Product Cards Header */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className="relative flex flex-col h-full p-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-lg"
            >
              <Link
                to={`/marketplace/listing/${product.id}`}
                className="block mb-4"
              >
                <img
                  src={getThumb(product.media)}
                  alt={product.title}
                  className="object-cover w-full h-48 mb-3 transition-transform border border-gray-100 rounded-lg hover:scale-105"
                />
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px]">
                  {product.title}
                </h3>
              </Link>

              <div className="flex flex-col gap-3 mt-auto">
                <div className="text-2xl font-bold text-red-600">
                  {currency(product.price)}
                </div>

                {product.color && (
                  <div className="text-xs text-gray-600">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full">
                      {product.color}
                    </span>
                  </div>
                )}

                <Link
                  to={`/marketplace/listing/${product.id}`}
                  className="block w-full py-2.5 text-sm font-medium text-center text-white transition-colors bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800"
                >
                  Xem chi tiết
                </Link>

                <button
                  onClick={() => removeProduct(product.id)}
                  className="flex items-center justify-center w-full gap-1 py-2 text-sm font-medium text-center text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {/* Add Product Placeholders */}
          {Array.from({ length: 4 - products.length }).map((_, idx) => (
            <button
              key={`placeholder-${idx}`}
              onClick={openAddProductModal}
              className="flex flex-col items-center justify-center h-full p-6 transition-all bg-white border-2 border-gray-200 border-dashed rounded-xl min-h-[400px] hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
            >
              <div className="p-4 mb-3 bg-blue-100 rounded-full">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Thêm sản phẩm để so sánh
              </p>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="space-y-4">
          {Object.entries(groupedVariations).map(([category, varIds]) => {
            // Filter variations if showDifferencesOnly is true
            const filteredVarIds = showDifferencesOnly
              ? varIds.filter((varId) => hasDifferences(varId))
              : varIds;

            if (filteredVarIds.length === 0) return null;

            return (
              <div
                key={category}
                className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(category)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left transition-colors bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                >
                  <h2 className="text-lg font-bold text-gray-900">
                    {category}
                  </h2>
                  {collapsedSections[category] ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Section Content */}
                {!collapsedSections[category] && (
                  <div className="divide-y divide-gray-100">
                    {filteredVarIds.map((varId) => {
                      const variationName = getVariationName(varId);
                      const isDifferent = hasDifferences(varId);

                      return (
                        <div
                          key={varId}
                          className={`grid grid-cols-5 gap-4 p-4 ${
                            isDifferent ? "bg-yellow-50" : "bg-white"
                          }`}
                        >
                          {/* Variation Name */}
                          <div className="flex items-center text-sm font-semibold text-gray-700">
                            {variationName}
                          </div>

                          {/* Product Values */}
                          {products.map((product) => {
                            const detail = (product.post_details || []).find(
                              (d) => d.variation_id === varId
                            );

                            let displayValue;
                            if (detail) {
                              if (
                                detail.custom_value &&
                                detail.custom_value !== "null"
                              ) {
                                displayValue = detail.custom_value;
                              } else if (detail.variation_value_id) {
                                const varValue = variationValues.find(
                                  (vv) => vv.id === detail.variation_value_id
                                );
                                displayValue = varValue?.value || "—";
                              }
                            }

                            return (
                              <div
                                key={product.id}
                                className="text-sm text-gray-900"
                              >
                                {displayValue || (
                                  <span className="text-gray-400">
                                    Không có
                                  </span>
                                )}
                              </div>
                            );
                          })}

                          {/* Empty cells for placeholders */}
                          {Array.from({ length: 4 - products.length }).map(
                            (_, idx) => (
                              <div
                                key={`empty-${idx}`}
                                className="text-sm text-gray-300"
                              >
                                —
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal thêm sản phẩm */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Chọn sản phẩm để so sánh
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {loadingProducts ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  Không tìm thấy sản phẩm nào
                </div>
              ) : (
                <div className="space-y-3">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 transition-all bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-400"
                      onClick={() => addProductToCompare(product.id)}
                    >
                      <img
                        src={getThumb(product.media)}
                        alt={product.title}
                        className="flex-shrink-0 object-cover w-32 h-32 border border-gray-100 rounded-lg"
                      />
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">
                            {product.title}
                          </h3>
                          {product.color && (
                            <span className="inline-block px-2 py-1 mb-2 text-xs text-gray-600 bg-gray-100 rounded">
                              {product.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-red-600">
                            {currency(product.price)}
                          </div>
                          <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                            Thêm vào so sánh
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
