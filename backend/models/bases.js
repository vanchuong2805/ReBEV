const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wards',
        key: 'id'
      }
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
        name: "PK__bases__3213E83FC2BB6337",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
