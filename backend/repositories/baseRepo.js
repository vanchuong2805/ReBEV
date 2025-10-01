import initBase from '../models/bases.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const bases = initBase(sequelize, DataTypes);

export default bases;
