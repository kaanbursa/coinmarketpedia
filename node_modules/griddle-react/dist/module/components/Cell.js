'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cell = function Cell(_ref) {
  var value = _ref.value,
      onMouseEnter = _ref.onMouseEnter,
      onClick = _ref.onClick,
      className = _ref.className,
      style = _ref.style,
      onMouseLeave = _ref.onMouseLeave;
  return _react2.default.createElement(
    'td',
    {
      style: style,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      className: className
    },
    value
  );
};

exports.default = Cell;