import Provinces from '../../services/address/provinceService.js';
import Wards from '../../services/address/wardService.js';
const wardResolver = {
    Query: {
        wards: Wards.getWards,
        ward: (_, { id }) => Wards.getWard(id),
    },
    Ward: {
        province: (parent) => Provinces.getProvinceByID(parent.province_id),
    },
};

export default wardResolver;
