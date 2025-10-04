import Wards from '../../services/address/wardService.js';
import Provinces from '../../services/address/provinceService.js';
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
