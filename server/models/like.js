module.exports = function(sequelize, Sequelize){
  var Like = sequelize.define('like', {
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
        commentId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'comments',
            key: 'id'
          }
        },
        replyId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'replies',
            key: 'id'
          }
        }

  })
  return Like;
}
