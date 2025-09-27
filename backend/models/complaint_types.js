const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('complaint_types', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "UQ__complain__72E12F1B8DAB86E5"
    }
  }, {
    sequelize,
    tableName: 'complaint_types',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__complain__3213E83F0D5793AF",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__complain__72E12F1B8DAB86E5",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
