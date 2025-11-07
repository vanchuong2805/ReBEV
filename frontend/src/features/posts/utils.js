// features/posts/utils.js - Post form utilities

/**
 * Parse weight input from kg/g to grams
 */
export function parseWeightToGrams(input) {
  if (input == null) return null;
  let s = String(input).trim().toLowerCase();
  s = s.replace(/,/g, "."); // 1,5 -> 1.5

  const m = s.match(/([\d.]+)/); // bắt số
  if (!m) return null;
  const num = parseFloat(m[1]);
  if (!Number.isFinite(num)) return null;

  // mặc định coi là kg nếu không ghi đơn vị
  let unit = "kg";
  if (/\bg\b/.test(s)) unit = "g";
  if (/\bkg\b/.test(s)) unit = "kg";

  return unit === "kg" ? Math.round(num * 1000) : Math.round(num);
}

/**
 * Build post details from selected variations
 */
export function buildPostDetails(selectedByVar, vg) {
  return Object.entries(selectedByVar)
    .filter(([, v]) => v != null && String(v).trim().length > 0)
    .map(([variationIdStr, raw]) => {
      const variation_id = Number(variationIdStr);
      const rawStr = String(raw).trim();

      // 1) tập option-id hợp lệ cho variation này
      const options = vg.byVariationId.get(variation_id) || [];
      const optionIdSet = new Set(options.map((o) => String(o.id)));

      // 2) meta + label
      const meta = vg.metaByVariationId?.get(variation_id);
      const isNum = !!meta?.is_number;
      const label = (
        vg.titlesByVariationId.get(variation_id) || ""
      ).toLowerCase();

      // 3) nếu người dùng chọn đúng 1 option trong list
      if (optionIdSet.has(rawStr)) {
        return {
          variation_id,
          variation_value_id: Number(rawStr),
          custom_value: null,
        };
      }

      // 4) custom_value - nếu là "Trọng lượng" -> đổi sang gram
      const isWeight = variation_id === 13 || label.includes("trọng lượng");
      if (isWeight) {
        const grams = parseWeightToGrams(rawStr);
        return {
          variation_id,
          variation_value_id: null,
          custom_value: grams,
        };
      }

      // 5) field số khác -> parse số
      if (isNum) {
        const numeric = Number(rawStr.replace(/[,_\s]/g, "").replace(",", "."));
        return {
          variation_id,
          variation_value_id: null,
          custom_value: Number.isFinite(numeric) ? numeric : rawStr,
        };
      }

      // 6) field text
      return {
        variation_id,
        variation_value_id: null,
        custom_value: rawStr,
      };
    })
    .filter(
      (d) =>
        d.variation_value_id != null ||
        (d.custom_value !== null && String(d.custom_value).length > 0)
    );
}
