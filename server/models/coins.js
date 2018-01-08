const Table = require('table')
module.exports = function(sequelize, Sequelize){

  var Coin = sequelize.define('coin', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        coinname: {
          type: Sequelize.STRING
        },
        ticker: {
          type: Sequelize.STRING
        },
        summary: {
          type: Sequelize.STRING
        },
        history: {
          type: Sequelize.STRING
        },
        technology: {
          type: Sequelize.STRING
        },
        link: {
          type: Sequelize.STRING
        },
        importantDates: {
          type: Sequelize.STRING
        },
        htmlcode: {
          type: Sequelize.JSON
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Date.now()
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Date.now(),
          timestamps: false,
          allowNull: true,
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
  })
  return Coin;
}
