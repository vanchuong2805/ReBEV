import { Sequelize } from "sequelize";
import models from "../../models/index.js";
const { packages } = models;

const getPackages = async () => {
    const data = await packages.findAll();
    return data;
}

const getPackage = async (id) => {
    const data = await packages.findByPk(id);
    return data;
}

export default {
    getPackages,
    getPackage,
}