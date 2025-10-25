export async function createOrder({ items, total, method }) {
  // giả lập network
  await new Promise((r) => setTimeout(r, 600));
  // trả về id đơn hàng giả
  return { orderId: "ORD-" + Math.floor(Math.random() * 1e6), total, method };
}
