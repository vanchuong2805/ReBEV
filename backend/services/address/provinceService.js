import provinces from '../../repositories/provinceRepo.js';

const getProvinces = async () => {
    const data = await provinces.findAll();
    return data;
};

const getProvince = async (id) => {
    const data = await provinces.findByPk(id);
    return data;
};

export default { getProvinces, getProvince };
