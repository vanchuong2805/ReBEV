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
    customer_contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_contacts',
        key: 'id'
      }
    },
    seller_contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_contacts',
        key: 'id'
      }
    },
    base_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bases',
        key: 'id'
      }
    },
    order_type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    shipping_price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    paid_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false,
      defaultValue: 0
    },
    unpaid_amount: {
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
        name: "PK__orders__3213E83F6C613714",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
