import bases from '../repositories/baseRepo.js';
const getBases = async () => {
    const data = await bases.findAll();
    return data;
};
const getBase = async (id) => {
    const data = await bases.findByPk(id);
    return data;
};
export default { getBases, getBase };
