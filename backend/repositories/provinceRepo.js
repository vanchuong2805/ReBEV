import initProvince from '../models/provinces.js';
import sequelize from '../config/db.js';
import { DataTypes, where } from 'sequelize';

const provinces = initProvince(sequelize, DataTypes);

const getAllProvinces = async () => {
    const data = await provinces.findAll();
    return data;
};

const getProvinceByID = async (id) => {
    const data = await provinces.findByPk(id);
    return data;
};

export default { getAllProvinces, getProvinceByID };
