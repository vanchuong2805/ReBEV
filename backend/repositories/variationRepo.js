import initVariation from '../models/variations.js';
import initVariationValue from '../models/variation_values.js';
import sequelize from '../config/db.js';
import { DataTypes, where } from 'sequelize';

const variations = initVariation(sequelize, DataTypes);
const variationValues = initVariationValue(sequelize, DataTypes);

const getAllVariations = async () => {
    const data = await variations.findAll();
    return data;
};
const getVariationByID = async (id) => {
    const data = await variations.findByPk(id);
    return data;
};
const getAllValues = async () => {
    const data = await variationValues.findAll();
    return data;
};
const getValueByID = async (id) => {
    const data = await variationValues.findByPk(id);
    return data;
};
const getChildrenValues = async (id) => {
    const data = await variationValues.findAll({
        where: {
            parent_id: id,
        },
    });
    return data;
};
const getValuesByVariationID = async (v_id) => {
    const data = await variationValues.findAll({
        where: {
            variation_id: v_id,
        },
    });
    return data;
};

export default {
    getAllVariations,
    getAllValues,
    getVariationByID,
    getValueByID,
    getValuesByVariationID,
    getChildrenValues,
};
