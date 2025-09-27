const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message_media', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'message_media',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__message___3213E83FE74234BA",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
