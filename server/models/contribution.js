const model = require('../models');
module.exports = function(sequelize, Sequelize){
  var Contribution = sequelize.define('contribution', {

      id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        coinname:{
          type: Sequelize.TEXT,
          allowNull: false
        },
        text: {
          type: Sequelize.JSON,
          allowNull: false
        },
        validated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        validations: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          allowNull: false
        },
        coinId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'coins',
            key: 'id'
          },
          allowNull: false
        }

  })
  return Contribution;
}
