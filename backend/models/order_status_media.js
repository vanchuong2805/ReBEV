const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_status_media', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_status',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(1024),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order_status_media',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__order_st__3213E83F14C3F18B",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
