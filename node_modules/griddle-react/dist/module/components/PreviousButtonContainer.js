'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _dataSelectors = require('../selectors/dataSelectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enhance = function enhance(OriginalComponent) {
  return (0, _reactRedux.connect)(function (state, props) {
    return {
      text: 'Previous', // TODO: Get this from the store
      hasPrevious: (0, _dataSelectors.hasPreviousSelector)(state, props),
      className: (0, _dataSelectors.classNamesForComponentSelector)(state, 'PreviousButton'),
      style: (0, _dataSelectors.stylesForComponentSelector)(state, 'PreviousButton')
    };
  })(function (props) {
    return _react2.default.createElement(OriginalComponent, props);
  });
};

exports.default = enhance;