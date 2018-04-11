const model = require('../models');
module.exports = function(sequelize, Sequelize){
  var Validation = sequelize.define('validation', {
      id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },

        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          allowNull: false
        },
        contributionId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'contributions',
            key: 'id'
          },
          allowNull: false
        }

  })
  return Validation;
}
