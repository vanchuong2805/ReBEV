const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_detail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    commission_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    appointment_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    contract_file: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'order_detail',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__order_de__3213E83F455ADA13",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
