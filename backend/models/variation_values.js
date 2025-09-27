const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variation_values', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    variation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'variations',
        key: 'id'
      }
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'variation_values',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'variation_values',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__variatio__3213E83F3396F731",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "variation_values_index_1",
        unique: true,
        fields: [
          { name: "variation_id" },
          { name: "value" },
        ]
      },
    ]
  });
};
