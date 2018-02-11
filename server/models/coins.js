module.exports = function(sequelize, Sequelize){

  var Coin = sequelize.define('coin', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId:{
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.STRING
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
        website: {
          type: Sequelize.STRING
        },
        tweeter:{
          type: Sequelize.STRING
        },
        image: {
          type: Sequelize.STRING
        },
        homeImage: {
          type: Sequelize.STRING
        },
        videoId: {
          type: Sequelize.STRING
        },
        htmlcode: {
          type: Sequelize.JSON
        },
        category: {
          type: Sequelize.ARRAY(Sequelize.STRING)
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
        },
        suggested: {
          type: Sequelize.ARRAY(Sequelize.STRING)
        }
  })
  return Coin;
}
