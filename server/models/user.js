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
        admin: {
          type: Sequelize.INTEGER
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
        }
  })
  return User;
}
