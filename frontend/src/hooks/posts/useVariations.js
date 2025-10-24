import { useEffect, useMemo, useState } from "react";
import { getVariationNameByCategoryId } from "@/features/posts/service";

/**
 * useVariationGraph(rows, categoryId)
 * ----------------------------------
 * Dùng để:
 *  - Xây đồ thị phụ thuộc parent/child giữa các variation (dựa theo rows = variationValues).
 *  - Lấy tên và metadata (is_number, is_require) cho từng variation_id từ API definitions.
 *
 * rows: mảng các value-level, ví dụ:
 *   { id: value_id, variation_id, parent_id (value_id cha), value: "Yamaha" }
 * categoryId: id danh mục (1 = xe, 2 = pin, ...)
 */
export function useVariationGraph(rows, categoryId) {
  // ====== 1. Lấy definitions từ API ======
  const [titlesByVariationId, setTitlesByVariationId] = useState(new Map());
  const [metaByVariationId, setMetaByVariationId] = useState(new Map());
  const [definitionIds, setDefinitionIds] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      setTitlesByVariationId(new Map());
      setMetaByVariationId(new Map());
      setDefinitionIds([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await getVariationNameByCategoryId(categoryId);
        const nameMap = new Map();
        const metaMap = new Map();
        const idList = [];

        if (Array.isArray(data)) {
          data.forEach((v) => {
            const id = Number(v?.id);
            const name = v?.name;
            if (id && name) {
              nameMap.set(id, String(name));
              metaMap.set(id, {
                is_number: !!v?.is_number,
                is_require: !!v?.is_require,
              });
              idList.push(id);
            }
          });
        }

        if (!cancelled) {
          setTitlesByVariationId(nameMap);
          setMetaByVariationId(metaMap);
          setDefinitionIds(idList);
        }
      } catch (err) {
        console.debug("[useVariationGraph] API error:", err?.message || err);
        if (!cancelled) {
          setTitlesByVariationId(new Map());
          setMetaByVariationId(new Map());
          setDefinitionIds([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  // ====== 2. Tạo đồ thị từ variationValues ======
  const byVariationId = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.variation_id)) map.set(r.variation_id, []);
      map.get(r.variation_id).push(r);
    });
    return map;
  }, [rows]);

  const variationOfValue = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => map.set(r.id, r.variation_id));
    return map;
  }, [rows]);

  const parentVariationOf = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      if (r.parent_id != null) {
        const parentVarId = variationOfValue.get(r.parent_id);
        if (parentVarId != null) map.set(r.variation_id, parentVarId);
      }
    });
    return map;
  }, [rows, variationOfValue]);

  const childVariationsOf = useMemo(() => {
    const map = new Map();
    for (const [childVar, parentVar] of parentVariationOf) {
      if (!map.has(parentVar)) map.set(parentVar, new Set());
      map.get(parentVar).add(childVar);
    }
    return map;
  }, [parentVariationOf]);

  // ====== 3. Thứ tự ưu tiên: theo API definitions, fallback topo ======
  const orderedVariationIds = useMemo(() => {
    if (definitionIds.length > 0) return definitionIds.slice();

    const all = Array.from(byVariationId.keys());
    const indeg = new Map();
    all.forEach((v) => indeg.set(v, 0));
    for (const [childVar] of parentVariationOf) {
      indeg.set(childVar, (indeg.get(childVar) || 0) + 1);
    }

    const q = [];
    for (const [v, d] of indeg) if (d === 0) q.push(v);

    const order = [];
    while (q.length) {
      const v = q.shift();
      order.push(v);
      const kids = childVariationsOf.get(v);
      if (kids) {
        for (const c of kids) {
          indeg.set(c, indeg.get(c) - 1);
          if (indeg.get(c) === 0) q.push(c);
        }
      }
    }
    for (const v of all) if (!order.includes(v)) order.push(v);
    return order;
  }, [definitionIds, byVariationId, parentVariationOf, childVariationsOf]);

  // ====== 4. Lọc options theo parent ======
  const filterOptionsForVariation = (variationId, selectionMap) => {
    const all = byVariationId.get(variationId) || [];
    const parentVar = parentVariationOf.get(variationId);
    if (parentVar == null) return all;

    const parentSelectedValueId = selectionMap[parentVar] || null;
    if (parentSelectedValueId == null) return [];
    return all.filter(
      (r) =>
        r.parent_id == null || r.parent_id === Number(parentSelectedValueId)
    );
  };

  return {
    byVariationId,
    orderedVariationIds,
    parentVariationOf,
    childVariationsOf,
    filterOptionsForVariation,
    titlesByVariationId,
    metaByVariationId,
    definitionIds,
  };
}
