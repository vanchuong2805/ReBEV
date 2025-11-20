import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  getPostById,
  getVariations,
  getVariationValues,
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

  // Toggle collapse section
  const toggleSection = (sectionName) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
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
      <div className="bg-white border-b">
        <div className="container px-4 py-4 mx-auto">
          <Link
            to="/marketplace/all"
            className="inline-flex items-center gap-2 mb-3 text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">So sánh</h1>
            <span className="text-xl text-gray-500">
              {products.length} sản phẩm
            </span>
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4 rounded" />
            Chỉ hiển thị điểm khác biệt
          </label>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        {/* Product Cards Header */}
        <div
          className="grid gap-6 mb-6"
          style={{
            gridTemplateColumns: `200px repeat(${
              products.length
            }, 1fr) repeat(${4 - products.length}, 1fr)`,
          }}
        >
          {/* Empty space for labels */}
          <div></div>

          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className="relative p-4 bg-white rounded-lg shadow-md"
            >
              <Link to={`/marketplace/listing/${product.id}`} className="block">
                <img
                  src={getThumb(product.media)}
                  alt={product.title}
                  className="object-contain w-full h-48 mb-3 rounded-lg"
                />
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px]">
                  {product.title}
                </h3>
              </Link>

              <div className="mb-3 text-xl font-bold text-red-600">
                {currency(product.price)}
              </div>

              <div className="mb-2 text-xs text-gray-600">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded">
                  Màu {product.color || "Đen"}
                </span>
              </div>

              <Link
                to={`/marketplace/listing/${product.id}`}
                className="block w-full py-2 mb-2 text-center text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
              >
                Xem ngay
              </Link>

              <button
                onClick={() => removeProduct(product.id)}
                className="flex items-center justify-center w-full gap-1 py-2 text-center text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Xóa
              </button>
            </div>
          ))}

          {/* Add Product Placeholders */}
          {Array.from({ length: 4 - products.length }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300"
            >
              <Plus className="w-12 h-12 mb-3 text-blue-500" />
              <p className="font-medium text-blue-500">Thêm sản phẩm khác</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="space-y-6">
          {Object.entries(groupedVariations).map(([category, varIds]) => (
            <div
              key={category}
              className="overflow-hidden bg-white rounded-lg shadow-md"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(category)}
                className="flex items-center justify-between w-full p-4 transition-colors bg-gray-50 hover:bg-gray-100"
              >
                <h2 className="text-lg font-bold text-gray-900">{category}</h2>
                {collapsedSections[category] ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Section Content */}
              {!collapsedSections[category] && (
                <div className="divide-y divide-gray-200">
                  {varIds.map((varId) => {
                    const variationName = getVariationName(varId);

                    return (
                      <div
                        key={varId}
                        className="grid gap-6 p-4"
                        style={{
                          gridTemplateColumns: `200px repeat(${
                            products.length
                          }, 1fr) repeat(${4 - products.length}, 1fr)`,
                        }}
                      >
                        <div className="text-sm font-medium text-gray-700">
                          {variationName}
                        </div>

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
                                <span className="text-gray-400">Không</span>
                              )}
                            </div>
                          );
                        })}

                        {/* Empty cells for placeholders */}
                        {Array.from({ length: 4 - products.length }).map(
                          (_, idx) => (
                            <div
                              key={`empty-${idx}`}
                              className="text-sm text-gray-400"
                            ></div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
