import Variations from '../../repositories/variationRepo.js';

const variationResolver = {
    Query: {
        variations: Variations.getAllVariations,
        variationValues: Variations.getAllValues,
        variation: (_, { id }) => Variations.getVariationByID(id),
        variationValue: (_, { id }) => Variations.getValueByID(id),
    },
    Variation: {
        variationValues: (parent) => Variations.getValuesByVariationID(parent.id),
    },
    VariationValue: {
        variation: (parent) => Variations.getVariationByID(parent.id),
        parentValue: (parent) => Variations.getValueByID(parent.parent_id),
        childrenValues: (parent) => Variations.getChildrenValues(parent.id),
    },
};

export default variationResolver;
