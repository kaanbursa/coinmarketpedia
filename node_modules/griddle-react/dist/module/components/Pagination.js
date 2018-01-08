'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pagination = function Pagination(_ref) {
  var getPrevious = _ref.getPrevious,
      getNext = _ref.getNext,
      setPage = _ref.setPage,
      maxPages = _ref.maxPages,
      currentPage = _ref.currentPage,
      hasNext = _ref.hasNext,
      hasPrevious = _ref.hasPrevious,
      _ref$Next = _ref.Next,
      Next = _ref$Next === undefined ? null : _ref$Next,
      _ref$Previous = _ref.Previous,
      Previous = _ref$Previous === undefined ? null : _ref$Previous,
      _ref$PageDropdown = _ref.PageDropdown,
      PageDropdown = _ref$PageDropdown === undefined ? null : _ref$PageDropdown,
      style = _ref.style,
      className = _ref.className;
  return _react2.default.createElement(
    'div',
    { style: style, className: className },
    Previous && _react2.default.createElement(Previous, null),
    PageDropdown && _react2.default.createElement(PageDropdown, {
      maxPages: maxPages,
      currentPage: currentPage,
      setPage: setPage
    }),
    Next && _react2.default.createElement(Next, null)
  );
};

exports.default = Pagination;