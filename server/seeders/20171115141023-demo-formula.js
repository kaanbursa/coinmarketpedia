'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('formulas', [{
      materialname: 'CUL',
      createdAt: '2017-12-01 00:00:01',
      updatedAt: '2018-01-01 00:00:01'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('formulas', null, {});
  }
};
