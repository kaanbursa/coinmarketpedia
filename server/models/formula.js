const Table = require('table')
module.exports = function(sequelize, Sequelize){

  var Formula = sequelize.define('formula', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        materialname: {
          type: Sequelize.STRING
        },
        tablename: {
          type: Sequelize.STRING
        },
        formula: {
          type: Sequelize.DECIMAL
        },
        vk: {
          type: Sequelize.INTEGER
        },
        transport: {
          type: Sequelize.INTEGER
        },
        verwerking: {
          type: Sequelize.INTEGER
        },
        marge: {
          type: Sequelize.INTEGER
        },
        afslag: {
          type: Sequelize.INTEGER
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

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
  }, {
    classMethods: {
      associate: function(models) {
        Formula.belongsTo(models.Table, {as:'material'});
      }
    }
  })

  return Formula;

}
