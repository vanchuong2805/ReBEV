// VariationsSection.jsx - Component cho variations
import React from "react";
import { MyInput } from "./MyInput";

export default function VariationsSection({
  visibleVarIds,
  vg,
  selectedByVar,
  onUpdateSelection,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4 border-t sm:grid-cols-2">
      {visibleVarIds.map((varId) => {
        const label = vg.titlesByVariationId.get(varId);
        const meta = vg.metaByVariationId?.get(varId);
        const isRequired = meta?.is_require || false;

        if (!label) return null;

        const parentVar = vg.parentVariationOf.get(varId);
        const parentSelected = parentVar ? selectedByVar[parentVar] : null;
        const options =
          vg.filterOptionsForVariation(varId, selectedByVar) || [];

        const disabled = !!parentVar && !parentSelected;
        const parentLabel = parentVar
          ? vg.titlesByVariationId.get(parentVar) || "thuộc tính cha"
          : null;
        const placeholder = disabled
          ? `Chọn ${String(parentLabel).toLowerCase()} trước`
          : options.length === 0
          ? `Nhập ${label.toLowerCase()}`
          : `Chọn ${label.toLowerCase()}`;

        return (
          <div key={varId} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              {label}
              {isRequired && <span className="ml-1 text-red-500">*</span>}
            </span>
            <MyInput
              options={options.map((o) => ({
                id: o.id,
                value: o.id,
                label: o.value,
              }))}
              value={selectedByVar[varId] || ""}
              onChange={(v) => onUpdateSelection(varId, v)}
              placeholder={placeholder}
              allowFreeText={options.length === 0}
              disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
}
