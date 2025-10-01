import initVariation from '../models/variations.js';
import initVariationValue from '../models/variation_values.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const variations = initVariation(sequelize, DataTypes);
const variationValues = initVariationValue(sequelize, DataTypes);

export { variations, variationValues };
