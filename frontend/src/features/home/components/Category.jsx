import React from "react";
import { Link } from "react-router-dom";
import batteryIcon from "@/assets/image/icon_pin_dien.jpg";
import bikeIcon from "@/assets/image/icon_xe_may.png";

const categories = [
  {
    id: 1,
    name: "Pin xe máy",
    icon: batteryIcon,
    href: "/marketplace/pin",
  },
  {
    id: 2,
    name: "Xe máy điện cũ",
    icon: bikeIcon,
    href: "/marketplace/xe",
  },
];

export default function Category() {
  return (
    <section className="py-6 mx-auto bg-white shadow-lg w-6xl mt-7 rounded-xl">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 gap-8 justify-items-center">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={c.href}
              className="flex flex-col items-center justify-center no-underline transition-all duration-200 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-center shadow-sm bg-blue-50 hover:shadow-md">
                <img
                  src={c.icon}
                  alt={c.name}
                  className="object-contain w-20 h-20"
                />
              </div>

              {/* Label */}
              <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
