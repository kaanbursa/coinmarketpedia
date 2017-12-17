module.exports = function(sequelize, Sequelize){

  var Table = sequelize.define('table', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        tablename: {
          type: Sequelize.INTEGER
        },
        materials: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
  }, {
    classMethods:{
      associate: function(models) {
        Table.hasMany(models.Formula, {foreignKey: 'materialId'});
      }
    }
  })
  return Table;

}
