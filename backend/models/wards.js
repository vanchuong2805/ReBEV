const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wards', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provinces',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'wards',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__wards__3213E83F157F5C6B",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
