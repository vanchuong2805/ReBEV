import { Card } from "../../../../components/ui/card";

export default function CategorySelect({ value, onChange, options, disabled }) {
  return (
    <Card className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Danh mục:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Card>
  );
}
