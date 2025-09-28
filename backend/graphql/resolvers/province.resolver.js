import Wards from '../../repositories/wardRepo.js';
import Provinces from '../../repositories/provinceRepo.js';
const provinceResolver = {
    Query: {
        provinces: Provinces.getAllProvinces,
        province: (_, { id }) => Provinces.getProvinceByID(id),
    },
    Province: {
        wards: (parent) => Wards.getWardsByProvinceID(parent.id),
    },
};

export default provinceResolver;
