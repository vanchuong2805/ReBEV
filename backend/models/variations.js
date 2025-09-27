const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    is_number: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_require: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'variations',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__variatio__3213E83FF60582A7",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "variations_index_0",
        unique: true,
        fields: [
          { name: "category_id" },
          { name: "name" },
        ]
      },
    ]
  });
};
