import categories from '../../repositories/categoryRepo.js';

const getCategories = async () => {
    const data = await categories.findAll();
    return data;
};
const getCategory = async (id) => {
    const data = await categories.findByPk(id);
    return data;
};
export default { getCategories, getCategory };
