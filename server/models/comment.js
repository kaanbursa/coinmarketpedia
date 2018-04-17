module.exports = function(sequelize, Sequelize){
  var Comment = sequelize.define('comment', {

      id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        text: {
          type: Sequelize.TEXT,
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
        coinId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'coins',
            key: 'id'
          },
          allowNull: false
        }

  })
  return Comment;
}
