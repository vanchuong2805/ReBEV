import Bases from '../../services/address/baseService.js';
import Wards from '../../services/address/wardService.js';
const baseResolver = {
    Query: {
        bases: Bases.getBases,
        base: (_, { id }) => Bases.getBase(id),
    },
    Base: {
        ward: (parent) => Wards.getWard(parent.ward_id),
    },
};

export default baseResolver;
