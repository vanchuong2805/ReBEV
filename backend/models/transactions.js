const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    transaction_type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    related_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    related_order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'order_detail',
        key: 'id'
      }
    },
    related_package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'packages',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'transactions',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__transact__3213E83F57EEBE64",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
