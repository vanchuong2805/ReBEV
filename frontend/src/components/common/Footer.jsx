import React from 'react';
import {
  Car,
  Battery,
  Users,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-900">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-1">
                <span className="bg-[#007BFF] text-white px-3 py-1.5 rounded font-bold text-xl">
                  Re
                </span>
                <span className="text-gray-900 font-bold text-xl">BEV</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Nền tảng giao dịch xe điện và pin cũ an toàn, minh bạch
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-[#007BFF] mr-2" />
                <span className="text-gray-700">1900-9999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-[#007BFF] mr-2" />
                <span className="text-gray-700">support@rebev.vn</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-[#007BFF] mr-2" />
                <span className="text-gray-700">TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-300 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-2 md:mb-0">
              © {currentYear} ReBEV Platform.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Chính sách</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Điều khoản</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;