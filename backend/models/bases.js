const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bases', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    detail: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    ward_code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ward_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    province_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'bases',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__bases__3213E83F6FF60E63",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
