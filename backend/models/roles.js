const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "UQ__roles__72E12F1BDB8F1F81"
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__roles__3213E83F222564FB",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__roles__72E12F1BDB8F1F81",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
