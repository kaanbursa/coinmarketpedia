'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Row = function Row(_ref) {
  var Cell = _ref.Cell,
      griddleKey = _ref.griddleKey,
      columnIds = _ref.columnIds,
      style = _ref.style,
      className = _ref.className;
  return _react2.default.createElement(
    'tr',
    {
      key: griddleKey,
      style: style,
      className: className
    },
    columnIds && columnIds.map(function (c) {
      return _react2.default.createElement(Cell, {
        key: c + '-' + griddleKey,
        griddleKey: griddleKey,
        columnId: c,
        style: style,
        className: className
      });
    })
  );
};

exports.default = Row;