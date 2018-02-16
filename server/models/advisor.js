module.exports = function(sequelize, Sequelize){

  var Advisor = sequelize.define('advisor', {
    id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        username: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        quote: {
          type: Sequelize.TEXT
        },
        biography: {
          type: Sequelize.TEXT
        },
        social: {
          type: Sequelize.JSON
        },
        fee: {
          type: Sequelize.INTEGER
        },
        info: {
          type: Sequelize.JSON
        },
        articleId: {
          autoIncrement: false,
          type: Sequelize.INTEGER
        },
        subsriptions: {
          type: Sequelize.INTEGER
        },
        videoId: {
          type: Sequelize.STRING
        },
        adviseStatus: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        resetPasswordToken:{
          type: Sequelize.STRING
        },
        resetPasswordExpires: {
          type: Sequelize.DATE
        },
        last_login: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        review: {
          type: Sequelize.STRING
        }
  })
  return Advisor;
}
