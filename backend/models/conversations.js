const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conversations', {
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
    }
  }, {
    sequelize,
    tableName: 'conversations',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "conversations_index_2",
        unique: true,
        fields: [
          { name: "seller_id" },
          { name: "customer_id" },
        ]
      },
      {
        name: "PK__conversa__3213E83F8D7C4F00",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
