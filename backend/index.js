import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { DataTypes } from 'sequelize';
import InitProvinces from './models/provinces.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req, res) => {
    const Provinces = InitProvinces(sequelize, DataTypes);
    const provinces = await Provinces.findAll();
    res.status(200).json(provinces);
});

app.listen(PORT, () => {
    console.log(`App is running.`);
});
