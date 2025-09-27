const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('complaint_media', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    complaint_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'complaints',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'complaint_media',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__complain__3213E83F79695818",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
