'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('formulas', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      materialname: {
        type: Sequelize.STRING
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
      category: {
        type: Sequelize.STRING
      },
      tableId: {
        type: Sequelize.INTEGER
      },
      status: {
          type: Sequelize.ENUM('active', 'inactive'),
          defaultValue: 'active'
      }
}, {
  classMethods: {
    associate: function(models) {
      Formula.belongsTo(models.Table, {as:'materialsort', foreignKey: 'materials'});
    }
  }
});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('formulas');
  }
};
