const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_status', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_by: { type: DataTypes.INTEGER, allowNull: true },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'order_status',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__order_st__3213E83F77EF2F94",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
