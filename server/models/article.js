module.exports = function(sequelize, Sequelize){

  var Article = sequelize.define('article', {
    id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        advisorId: {
            type: Sequelize.INTEGER
        },
        header: {
          type: Sequelize.TEXT
        },
        post: {
          type: Sequelize.JSON
        },
        views: {
          type: Sequelize.INTEGER
        },
        likes: {
          type: Sequelize.INTEGER
        },
        comments: {
          type: Sequelize.TEXT
        },
        videoId: {
          type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        review: {
          type: Sequelize.STRING
        }
  })
  return Article;
}
