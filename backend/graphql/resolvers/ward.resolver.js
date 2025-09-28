import Provinces from '../../repositories/provinceRepo.js';
import Wards from '../../repositories/wardRepo.js';
const wardResolver = {
    Query: {
        wards: Wards.getAllWards,
        ward: (_, { id }) => Wards.getWardByID(id),
    },
    Ward: {
        province: (parent) => Provinces.getProvinceByID(parent.province_id),
    },
};

export default wardResolver;
