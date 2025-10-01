import initWard from '../models/wards.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const wards = initWard(sequelize, DataTypes);

export default wards;
