import Variations from '../../services/post/variationService.js';
import Categories from '../../services/post/categoryService.js';

const variationResolver = {
    Query: {
        variations: Variations.getVariations,
        variationValues: Variations.getVariationValues,
        variation: (_, { id }) => Variations.getVariation(id),
        variationValue: (_, { id }) => Variations.getVariationValue(id),
    },
    Variation: {
        variationValues: (parent) => Variations.getValuesByVariationID(parent.id),
        category: (parent) => Categories.getCategory(parent.category_id),
    },
    VariationValue: {
        variation: (parent) => Variations.getVariation(parent.id),
        parentValue: (parent) => Variations.getVariationValue(parent.parent_id),
        childrenValues: (parent) => Variations.getChildrenValues(parent.id),
    },
};

export default variationResolver;
