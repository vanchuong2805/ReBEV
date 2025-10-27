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

const createPackage = async (name, description, price, highlight, top, duration) => {
    const data = await packages.create({
        name,
        description,
        price,
        highlight,
        top,
        duration,
    });
    return data;
}

const deletePackage = async (id) => {
    await packages.update({
        is_deleted: true
    }, {
        where: {
            id: id
        }
    });

    const updatedPackage = await packages.findOne({
        where: {
            id: id
        }
    });
    return updatedPackage;
}

const is_deleted = async (id) => {
    const data = await packages.findByPk(id);
    if (!data) throw new Error('Package not found');
    return data.is_deleted;

}


export default {
    getPackages,
    getPackage,
    createPackage,
    deletePackage,
    is_deleted,
}