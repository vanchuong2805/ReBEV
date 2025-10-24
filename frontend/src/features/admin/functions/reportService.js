import { chartData } from "../../../data/data";

/**
 * Dịch vụ mô phỏng để lấy dữ liệu thống kê theo năm
 */
const reportService = {
  /**
   * Lấy dữ liệu thống kê theo năm được chọn
   * @param {string|number} year - Năm cần lấy dữ liệu
   * @returns {Array} Dữ liệu thống kê theo tháng của năm đó
   */
  getDataByYear: (year) => {
    // Đây là mô phỏng - trong thực tế sẽ gọi API với năm được chọn

    // Chuyển năm về dạng số
    const yearNum = parseInt(year);

    // Tính toán hệ số để tạo dữ liệu mô phỏng khác nhau cho mỗi năm
    const yearFactor = (yearNum - 2019) / 10;
    const randomFactor =
      yearNum % 3 === 0 ? 1.2 : yearNum % 2 === 0 ? 0.9 : 1.1;

    // Tạo dữ liệu mới dựa trên dữ liệu mẫu
    return chartData.map((item) => ({
      month: item.month,
      revenue: Math.round(item.revenue * (1 + yearFactor) * randomFactor),
      transactions: Math.round(
        item.transactions * (1 + yearFactor) * randomFactor
      ),
    }));
  },
};

export default reportService;
