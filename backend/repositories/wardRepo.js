import initWard from '../models/wards.js';
import sequelize from '../config/db.js';
import { DataTypes, where } from 'sequelize';
const wards = initWard(sequelize, DataTypes);

const getAllWards = async () => {
    const data = await wards.findAll();
    return data;
};
const getWardByID = async (id) => {
    const data = await wards.findByPk(id);
    return data;
};

const getWardsByProvinceID = async (p_id) => {
    const data = await wards.findAll({
        where : {
            province_id : p_id
        }
    });
    return data;
}

export default { getAllWards , getWardByID, getWardsByProvinceID};
