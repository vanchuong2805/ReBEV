import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Scale,
  CreditCard,
} from "lucide-react";
import Header from "@/components/common/Header";

export default function Terms() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Điều Khoản Sử Dụng
          </h1>
          <p className="mt-2 text-gray-600">Cập nhật lần cuối: 15/10/2025</p>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden bg-white shadow-sm rounded-xl">
          <div className="p-6 space-y-8 md:p-8">
            {/* Section 1: Giới thiệu */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    1. Giới Thiệu
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <p>
                  Chào mừng bạn đến với{" "}
                  <span className="font-semibold text-blue-600">ReBEV</span> -
                  nền tảng mua bán xe điện và phụ kiện pin uy tín tại Việt Nam.
                </p>
                <p>
                  Khi truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân
                  thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây.
                  Vui lòng đọc kỹ trước khi sử dụng.
                </p>
              </div>
            </section>

            {/* Section 2: Tài khoản người dùng */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    2. Tài Khoản Người Dùng
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    2.1. Đăng Ký Tài Khoản
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật
                      khi đăng ký.
                    </li>
                    <li>
                      Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu
                      của mình.
                    </li>
                    <li>Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    2.2. Quyền và Nghĩa Vụ
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      Không sử dụng tài khoản cho mục đích bất hợp pháp hoặc vi
                      phạm quy định.
                    </li>
                    <li>Không chia sẻ tài khoản với người khác.</li>
                    <li>
                      Thông báo ngay cho ReBEV nếu phát hiện tài khoản bị sử
                      dụng trái phép.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Giao dịch và thanh toán */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    3. Giao Dịch và Thanh Toán
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    3.1. Đặt Hàng
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      Khi đặt hàng, bạn cam kết mua sản phẩm với giá và điều
                      kiện đã hiển thị.
                    </li>
                    <li>
                      ReBEV có quyền từ chối hoặc hủy đơn hàng nếu phát hiện
                      gian lận.
                    </li>
                    <li>
                      Thông tin đơn hàng sẽ được gửi qua email hoặc số điện
                      thoại đã đăng ký.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    3.2. Thanh Toán
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      Chúng tôi chấp nhận thanh toán qua MoMo, chuyển khoản ngân
                      hàng.
                    </li>
                    <li>Thanh toán phải được hoàn tất trước khi giao hàng.</li>
                    <li>
                      Người mua có thể thanh toán cọc trước và thanh toán phần
                      còn lại khi nhận hàng.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    3.3. Hủy Đơn Hàng
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      Người mua có thể hủy đơn hàng trước khi người bán xác
                      nhận.
                    </li>
                    <li>
                      Sau khi người bán xác nhận, việc hủy đơn phải được thỏa
                      thuận giữa hai bên.
                    </li>
                    <li>
                      Tiền cọc sẽ được hoàn lại theo chính sách hoàn tiền.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Vận chuyển và giao nhận */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg">
                  <Scale className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    4. Vận Chuyển và Giao Nhận
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <ul className="ml-5 space-y-2 list-disc">
                  <li>
                    Thời gian giao hàng tùy thuộc vào địa điểm và đơn vị vận
                    chuyển.
                  </li>
                  <li>
                    Người mua có trách nhiệm kiểm tra sản phẩm khi nhận hàng.
                  </li>
                  <li>
                    Nếu sản phẩm bị hư hỏng trong quá trình vận chuyển, vui lòng
                    thông báo ngay.
                  </li>
                  <li>
                    Chi phí vận chuyển sẽ được hiển thị rõ ràng trước khi thanh
                    toán.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Chính sách đăng tin */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    5. Chính Sách Đăng Tin
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <p className="font-semibold">Người bán có trách nhiệm:</p>
                <ul className="ml-5 space-y-2 list-disc">
                  <li>Cung cấp thông tin sản phẩm chính xác, trung thực.</li>
                  <li>
                    Đăng ảnh thực tế của sản phẩm, không sao chép từ nguồn khác.
                  </li>
                  <li>
                    Không đăng sản phẩm vi phạm pháp luật hoặc hàng giả, hàng
                    nhái.
                  </li>
                  <li>Tuân thủ quy định về giá cả và phí dịch vụ của ReBEV.</li>
                  <li>
                    ReBEV có quyền gỡ bỏ tin đăng vi phạm mà không cần thông báo
                    trước.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Giới hạn trách nhiệm */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    6. Giới Hạn Trách Nhiệm
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <ul className="ml-5 space-y-2 list-disc">
                  <li>
                    ReBEV là nền tảng trung gian, không chịu trách nhiệm về chất
                    lượng sản phẩm.
                  </li>
                  <li>
                    Mọi tranh chấp giữa người mua và người bán cần được giải
                    quyết trực tiếp.
                  </li>
                  <li>
                    ReBEV không chịu trách nhiệm về thiệt hại gián tiếp phát
                    sinh từ việc sử dụng dịch vụ.
                  </li>
                  <li>
                    Chúng tôi sẽ hỗ trợ tối đa trong khả năng để giải quyết
                    tranh chấp.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7: Thay đổi điều khoản */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    7. Thay Đổi Điều Khoản
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 pl-13">
                <p>
                  ReBEV có quyền thay đổi, cập nhật các điều khoản này bất kỳ
                  lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải
                  trên website.
                </p>
                <p>
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng
                  nghĩa với việc bạn chấp nhận các điều khoản mới.
                </p>
              </div>
            </section>

            {/* Section 8: Liên hệ */}
            <section className="p-6 bg-blue-50 rounded-xl">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                8. Liên Hệ
              </h2>
              <p className="mb-3 text-gray-700">
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Sử dụng này, vui
                lòng liên hệ với chúng tôi:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Email:</span> support@rebev.vn
                </p>
                <p>
                  <span className="font-semibold">Hotline:</span> 1900 xxxx
                </p>
                <p>
                  <span className="font-semibold">Địa chỉ:</span> Đại học Tôn
                  Đức Thắng, TP. Hồ Chí Minh
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Bằng việc sử dụng ReBEV, bạn đã đồng ý với{" "}
            <span className="font-semibold text-blue-600">
              Điều khoản Sử dụng
            </span>{" "}
            này.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 mt-4 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
