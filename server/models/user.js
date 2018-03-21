module.exports = function(sequelize, Sequelize){

  var User = sequelize.define('user', {
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
        rank: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        coinId: {
          autoIncrement: false,
          type: Sequelize.INTEGER
        },
        admin: {
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
        submission: {
          type: Sequelize.JSON
        },
        suggestion: {
          type: Sequelize.JSON
        },
        about: {
          type: Sequelize.STRING
        }
  })
  return User;
}
