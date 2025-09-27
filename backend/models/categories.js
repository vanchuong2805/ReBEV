const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "UQ__categori__72E12F1B9BD9789A"
    },
    is_deposit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deposit_rate: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    commission_rate: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'categories',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__categori__3213E83F8229A0AB",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__categori__72E12F1B9BD9789A",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
