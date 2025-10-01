import wards from '../repositories/wardRepo.js';

const getWards = async () => {
    const data = await wards.findAll();
    return data;
};
const getWard = async (id) => {
    const data = await wards.findByPk(id);
    return data;
};

const getWardsByProvinceID = async (provinceID) => {
    const data = await wards.findAll({
        where: {
            province_id: provinceID,
        },
    });
    return data;
};

export default { getWards, getWard, getWardsByProvinceID };
