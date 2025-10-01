import Wards from '../../services/wardService.js';
import Provinces from '../../services/provinceService.js';
const provinceResolver = {
    Query: {
        provinces: Provinces.getProvinces,
        province: (_, { id }) => Provinces.getProvince(id),
    },
    Province: {
        wards: (parent) => Wards.getWardsByProvinceID(parent.id),
    },
};

export default provinceResolver;
