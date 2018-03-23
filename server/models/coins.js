module.exports = function(sequelize, Sequelize){

  var Coin = sequelize.define('coin', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
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
        videoId: {
          type: Sequelize.STRING
        },
        homeImage: {
          type: Sequelize.STRING
        },
        htmlcode: {
          type: Sequelize.JSON
        },
        category: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          defaultValue: []
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
        github: {
          type: Sequelize.STRING
        },
        icoPrice: {
          type: Sequelize.INTEGER
        },
        paper: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        suggested: {
          type: Sequelize.ARRAY(Sequelize.STRING)
        },
        icon: {
          type: Sequelize.STRING,
        }

  })
  return Coin;
}
