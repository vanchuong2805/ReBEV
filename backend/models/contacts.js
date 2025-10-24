const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('contacts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'contacts',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__contacts__3213E83F8252A8C3",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
