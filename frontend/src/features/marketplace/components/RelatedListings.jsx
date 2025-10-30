export default function RelatedListings({
  seller,
  otherPosts,
  similarPosts,
  formatPrice,
  hasMoreOther,
  hasMoreSimilar,
  handleLoadMore,
  navigate
}) {
  // helper chung
  function getThumbnailUrl(post) {
    try {
      const media = typeof post.media === "string" ? JSON.parse(post.media) : post.media;
      const thumb = media.find((m) => m.is_thumbnail) || media[0];
      return thumb?.url?.replace(/^image\s+|^video\s+/i, "") || "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  }

  // component con dùng chung
  const Section = ({ title, posts, loadMore, hasMore }) => (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(posts ?? []).map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/marketplace/listing/${p.id}`)}
            className="overflow-hidden bg-white shadow-sm hover:shadow-lg rounded-xl cursor-pointer transition-transform hover:-translate-y-1"
          >
            <img
              src={getThumbnailUrl(p)}
              alt={p.title}
              className="object-cover w-full h-40 transition-transform duration-700 hover:scale-105"
            />
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.title}</h3>
              <p className="mt-1 text-sm font-semibold text-blue-700">
                {formatPrice(p.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="px-5 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            Xem thêm bài đăng
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {otherPosts?.length > 0 && (
        <Section
          title={`Tin khác từ ${seller?.display_name || "người bán"}`}
          posts={otherPosts}
          loadMore={() => handleLoadMore("other")}
          hasMore={hasMoreOther}
        />
      )}
      {similarPosts?.length > 0 && (
        <Section
          title="Tin tương tự"
          posts={similarPosts}
          loadMore={() => handleLoadMore("similar")}
          hasMore={hasMoreSimilar}
        />
      )}
    </div>
  );
}
