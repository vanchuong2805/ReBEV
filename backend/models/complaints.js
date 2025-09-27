const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('complaints', {
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
    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_detail',
        key: 'id'
      }
    },
    conplaint_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'complaint_types',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    complaint_status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'complaints',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__complain__3213E83F36F0758E",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
