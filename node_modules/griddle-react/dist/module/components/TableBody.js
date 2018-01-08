'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableBody = function TableBody(_ref) {
  var rowIds = _ref.rowIds,
      Row = _ref.Row,
      style = _ref.style,
      className = _ref.className;
  return _react2.default.createElement(
    'tbody',
    { style: style, className: className },
    rowIds && rowIds.map(function (r) {
      return _react2.default.createElement(Row, { key: r, griddleKey: r });
    })
  );
};

exports.default = TableBody;