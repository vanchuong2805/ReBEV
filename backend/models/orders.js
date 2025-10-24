const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    order_type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    from_contact: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    to_contact: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    delivery_price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    delivery_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    total_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'orders',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__orders__3213E83FC40A9373",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
