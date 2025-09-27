const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('provinces', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "UQ__province__72E12F1B63E08FB9"
    }
  }, {
    sequelize,
    tableName: 'provinces',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__province__3213E83F2F6F80A7",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__province__72E12F1B63E08FB9",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
