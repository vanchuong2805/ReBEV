export default function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-3">
      <img
        src={item.image}
        alt={item.title}
        className="object-cover w-20 h-20 rounded bg-gray-50"
      />
      <div className="flex-1">
        <p className="font-medium line-clamp-2">{item.title}</p>
        <p className="text-sm text-gray-500">
          {(item.price || 0).toLocaleString("vi-VN")}₫
        </p>
      </div>
      <input
        type="number"
        min={1}
        value={item.qty}
        onChange={(e) => onQtyChange(item.id, Number(e.target.value))}
        className="w-16 px-2 py-1 border rounded"
      />
      <button onClick={() => onRemove(item.id)} className="px-2 text-red-600">
        Xóa
      </button>
    </div>
  );
}
