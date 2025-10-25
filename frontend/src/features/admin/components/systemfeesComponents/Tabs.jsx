// components/system-fees/Tabs.jsx
import { cn } from "@/lib/utils"; // nếu có

export default function Tabs({ tabs, activeId, onChange }) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center py-2 px-1 border-b-2 font-medium text-sm",
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {Icon && <Icon size={16} className="mr-2" />}
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
