import Categories from '../../services/post/categoryService.js';
import Variations from '../../services/post/variationService.js';

const categoryResolver = {
    Query: {
        categories: Categories.getCategories,
        category: (_, { id }) => Categories.getCategory(id),
    },
    Category: {
        parentCategory: (parent) => Categories.getCategory(parent.parent_category_id),
        variations: (parent) => Variations.getByCategory(parent.id),
    },
};

export default categoryResolver;
