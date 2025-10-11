const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    highlight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    top: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'packages',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__packages__3213E83FC8372D59",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
