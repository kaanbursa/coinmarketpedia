module.exports = function(sequelize, Sequelize){

  var Term = sequelize.define('term', {
    id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        term: {
            type: Sequelize.STRING
        },
        description: {
          type: Sequelize.JSON
        },
        videoId: {
          type: Sequelize.STRING
        },

        last_login: {
            type: Sequelize.DATE
        },
        userId: {
          type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        suggestion: {
          type: Sequelize.JSON
        }
  })
  return Term;
}
