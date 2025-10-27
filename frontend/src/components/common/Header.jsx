import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronRight,
  Battery,
  Zap,
  MapPin,
  Factory,
  Calendar,
  Globe,
  Gauge,
  Power,
  Clock,
  Route,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Link } from "react-router";
import { useUser } from "@/contexts/UserContext";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../features/profile/service";
import { getVariationValues } from "@/features/posts/service";
// ========== GHN CONFIG ==========

// ===== Header Component =====
const Header = () => {
  const { openLogin, openRegister } = useAuthDialog();
  const { user, logout } = useUser();
  // ====== LOCATION STATES ======
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [provLoading, setProvLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [wardLoading, setWardLoading] = useState(false);
  const [provError, setProvError] = useState(null);
  const [wardError, setWardError] = useState(null);

  const { items } = useCart();
  const itemCount = items.length;
  // ======= FETCH PROVINCES =======
  useEffect(() => {
    (async () => {
      try {
        setProvLoading(true);
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (err) {
        console.error("❌ Error loading provinces:", err);
        setProvError(err);
      } finally {
        setProvLoading(false);
      }
    })();
  }, []);

  // ======= FETCH DISTRICTS =======
  const handleProvinceChange = async (e) => {
    const id = e.target.value;
    setSelectedProvince(id);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);

    if (!id) return;
    try {
      setDistrictLoading(true);
      const res = await fetchDistricts(id);
      setDistricts(res);
    } catch (err) {
      console.error("❌ Error loading districts:", err);
    } finally {
      setDistrictLoading(false);
    }
  };

  // ======= FETCH WARDS =======
  const handleDistrictChange = async (e) => {
    const id = e.target.value;
    setSelectedDistrict(id);
    setSelectedWard("");
    setWards([]);

    if (!id) return;
    try {
      setWardLoading(true);
      const res = await fetchWards(id);
      setWards(res);
    } catch (err) {
      console.error("❌ Error loading wards:", err);
      setWardError(err);
    } finally {
      setWardLoading(false);
    }
  };

  // ===== VARIATIONS =====
  const [groups, setGroups] = useState({});
  const [loadingVariations, setLoadingVariations] = useState(true);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const res = await getVariationValues();
        const roots = res.filter((item) => item.parent_id === null);

        const grouped = roots.reduce((acc, item) => {
          if (!acc[item.variation_id]) acc[item.variation_id] = [];
          acc[item.variation_id].push(item);
          return acc;
        }, {});

        setGroups({
          xe: {
            "Thương hiệu": { icon: <Factory size={14} />, data: grouped[1] },
            "Công suất (W)": { icon: <Power size={14} />, data: grouped[3] },

            "Xuất xứ": { icon: <Globe size={14} />, data: grouped[6] },
          },
          pin: {
            "Loại pin": { icon: <Battery size={14} />, data: grouped[8] },
            "Dung lượng (Ah)": { icon: <Gauge size={14} />, data: grouped[9] },
            "Điện áp (V)": { icon: <Zap size={14} />, data: grouped[10] },
            "Thời gian sạc": { icon: <Clock size={14} />, data: grouped[11] },
            "Quãng đường (km)": {
              icon: <Route size={14} />,
              data: grouped[12],
            },
            "Tình trạng pin (%)": {
              icon: <Battery size={14} />,
              data: grouped[14],
            },
            "Hãng pin": { icon: <Factory size={14} />, data: grouped[15] },
          },
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải variationValues:", err);
      } finally {
        setLoadingVariations(false);
      }
    };
    fetchVariations();
  }, []);

  // ======== UI ========
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#007BFF]">
      <div className="container px-4 mx-auto lg:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* ===== Logo + Danh mục ===== */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-1.5" to="/">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-md">
                <span className="text-[#007BFF] font-bold text-xl">Re</span>
              </div>
              <span className="text-xl font-bold text-white">BEV</span>
            </Link>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-12 px-5 flex items-center bg-[#339CFF] text-white rounded-md hover:bg-[#68b1ff] transition-all shadow-sm"
                >
                  <Menu className="w-6 h-6" />
                  <span className="hidden ml-2 font-medium lg:inline">
                    Danh mục
                  </span>
                  <ChevronDown className="w-5 h-5 ml-1" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                alignOffset={-102}
                sideOffset={15}
                className="relative w-72 p-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-[9999]"
              >
                {/* === Xe điện cũ === */}
                <HoverCard openDelay={80} closeDelay={120}>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50">
                      <span className="flex items-center gap-2 font-medium text-gray-800">
                        <Zap size={18} className="text-[#007BFF]" />
                        <Link to={"/marketplace/xe"}>Xe máy điện cũ</Link>
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="start"
                    sideOffset={15}
                    alignOffset={-9}
                    className="w-[850px] max-h-[500px] bg-white border border-gray-200 shadow-2xl rounded-xl p-6 overflow-y-auto transition-all duration-200 ease-out"
                  >
                    <h3 className="mb-5 text-lg font-semibold text-gray-700">
                      Bộ lọc xe điện
                    </h3>

                    {loadingVariations ? (
                      <p className="text-sm text-gray-400">Đang tải...</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-8 max-h-[400px] overflow-y-auto pr-2">
                        {Object.entries(groups.xe ?? {}).map(([name, group]) => (
                          group.data ? (
                            <div key={name}>
                              <p className="font-semibold text-gray-800 mb-3 text-[15px] flex items-center gap-2">
                                {group.icon} {name}
                              </p>
                              <div className="flex flex-col gap-1">
                                {group.data.map((item) => (
                                  <Link
                                    key={item.id}
                                    to={`/marketplace/xe?${name.toLowerCase()}=${encodeURIComponent(item.value)}`}
                                    className="text-gray-600 hover:text-[#007BFF] text-sm px-1 py-0.5 hover:underline transition"
                                  >
                                    {item.value}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : null
                        ))}
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>

                {/* === Pin EV cũ === */}
                <HoverCard openDelay={80} closeDelay={120}>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50">
                      <span className="flex items-center gap-2 font-medium text-gray-800">
                        <Battery size={18} className="text-[#007BFF]" />
                        <Link to={"/marketplace/pin"}>Pin EV cũ</Link>
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="start"
                    sideOffset={15}
                    alignOffset={-49}
                    className="w-[850px] max-h-[500px] bg-white border border-gray-200 shadow-2xl rounded-xl p-6 overflow-y-auto transition-all duration-200 ease-out"
                  >
                    <h3 className="mb-5 text-lg font-semibold text-gray-700">
                      Bộ lọc pin điện
                    </h3>

                    {loadingVariations ? (
                      <p className="text-sm text-gray-400">Đang tải...</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-8 max-h-[400px] overflow-y-auto pr-2">
                        {Object.entries(groups.pin).map(([name, group]) =>
                          group.data ? (
                            <div key={name}>
                              <p className="font-semibold text-gray-800 mb-3 text-[15px] flex items-center gap-2">
                                {group.icon} {name}
                              </p>
                              <div className="flex flex-col gap-1">
                                {group.data.map((item) => (
                                  <Link
                                    key={item.id}
                                    to={`/marketplace/pin?${name.toLowerCase()}=${encodeURIComponent(
                                      item.value
                                    )}`}
                                    className="text-gray-600 hover:text-[#007BFF] text-sm px-1 py-0.5 hover:underline transition"
                                  >
                                    {item.value}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ===== Search + Location (phần này giữ nguyên, chỉ đổi lấy GHN API) ===== */}
          <div className="flex-1 max-w-3xl mx-4">
            <div className="flex items-center w-full gap-2 px-2 py-1 bg-white shadow-md rounded-xl">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <Input
                  type="search"
                  placeholder="Tìm xe điện, pin..."
                  className="h-12 pl-10 pr-4 text-gray-700 border-0 rounded-md focus-visible:ring-0 placeholder:text-gray-400"
                />
              </div>

              {/* Dropdown chọn tỉnh / quận / xã */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center h-10 gap-2 px-4 border rounded-md shadow-sm hover:bg-gray-50"
                    disabled={provLoading}
                  >
                    <MapPin className="h-4 w-4 text-[#007BFF]" />
                    <span className="font-medium text-gray-700">
                      {selectedProvince
                        ? provinces.find(
                          (p) => p.ProvinceID === Number(selectedProvince)
                        )?.ProvinceName
                        : provLoading
                          ? "Đang tải khu vực..."
                          : "Chọn khu vực"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="p-4 space-y-4 rounded-lg shadow-xl w-80"
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    Chọn khu vực
                  </h3>

                  {provError && (
                    <div className="p-2 text-sm text-red-600 rounded bg-red-50">
                      Lỗi tải tỉnh: {provError.message}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Tỉnh */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Tỉnh/Thành *
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        disabled={provLoading}
                        className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 focus:ring-2 focus:ring-[#007BFF]"
                      >
                        <option value="">
                          {provLoading ? "Đang tải..." : "-- Chọn tỉnh --"}
                        </option>
                        {provinces.map((p) => (
                          <option key={p.ProvinceID} value={p.ProvinceID}>
                            {p.ProvinceName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quận/Huyện */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Quận/Huyện *
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        disabled={!selectedProvince || districtLoading}
                        className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 focus:ring-2 focus:ring-[#007BFF]"
                      >
                        <option value="">
                          {!selectedProvince
                            ? "Chọn tỉnh trước"
                            : districtLoading
                              ? "Đang tải..."
                              : "-- Chọn quận --"}
                        </option>
                        {districts.map((d) => (
                          <option key={d.DistrictID} value={d.DistrictID}>
                            {d.DistrictName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Xã/Phường */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Xã/Phường *
                      </label>
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        disabled={!selectedDistrict || wardLoading}
                        className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 focus:ring-2 focus:ring-[#007BFF]"
                      >
                        <option value="">
                          {!selectedDistrict
                            ? "Chọn quận trước"
                            : wardLoading
                              ? "Đang tải..."
                              : "-- Chọn xã --"}
                        </option>
                        {wards.map((w) => (
                          <option key={w.WardCode} value={w.WardCode}>
                            {w.WardName}
                          </option>
                        ))}
                      </select>

                      {wardError && (
                        <p className="mt-1 text-sm text-red-500">
                          Không thể tải danh sách xã.
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold h-10 rounded-md"
                    disabled={provLoading}
                  >
                    Áp dụng
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="h-10 px-5 bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold rounded-lg shadow-sm">
                Tìm kiếm
              </Button>
            </div>
          </div>
          {/* User actions */}
          {user ? (
            <nav className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white rounded-full hover:bg-white/20"
              >
                <Link
                  to="/cart"
                  className="relative inline-flex items-center justify-center w-10 h-10 text-white rounded-full hover:bg-white/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span
                      aria-label={`Có ${itemCount} mặt hàng trong giỏ`}
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1.5
                 rounded-full bg-red-600 text-white text-[10px] font-semibold
                 flex items-center justify-center leading-none shadow"
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center h-10 gap-2 px-3 text-white transition-colors rounded-full hover:bg-white/20"
                  >
                    <div className="w-8 h-8 bg-white text-[#007BFF] rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      {
                        user.display_name
                          .toUpperCase()
                          .split(" ")
                          .slice(-1)[0][0]
                      }
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl">
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="/profile">Tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="/profile/posts">Tin đăng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="/upgrade">Nâng cấp tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer py-2.5"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                asChild
                className="bg-white text-[#007BFF] hover:bg-gray-100 font-semibold shadow-lg"
              >
                <Link to="/posts">Đăng tin</Link>
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center gap-2">
              <Button
                onClick={openLogin}
                variant="ghost"
                className="bg-[#339CFF] text-white hover:bg-[#68b1ff] h-10 px-4 shadow-sm"
              >
                Đăng nhập
              </Button>
              <Button
                onClick={openRegister}
                className="bg-white text-[#007BFF] hover:bg-gray-100 font-semibold h-10 px-5 shadow-sm"
              >
                Đăng ký
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
