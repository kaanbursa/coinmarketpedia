module.exports = function(sequelize, Sequelize){
  var Reply = sequelize.define('reply', {

      id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
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
        commentId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'coins',
            key: 'id'
          }
        },
        replyId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'reply',
            key: 'id'
          }
        }

  })
  return Reply;
}
