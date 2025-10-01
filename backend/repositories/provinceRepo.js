import initProvince from '../models/provinces.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const provinces = initProvince(sequelize, DataTypes);

export default provinces;
