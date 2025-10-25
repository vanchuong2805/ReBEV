// components/system-fees/EditableNumberField.jsx
import { Input } from "../../../../components/ui/input";

export default function EditableNumberField({
  label,
  value,
  suffix,
  disabled,
  editing,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {editing ? (
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>
      ) : (
        <p className="text-xl font-bold text-blue-600">
          {value} {suffix || ""}
        </p>
      )}
    </div>
  );
}
