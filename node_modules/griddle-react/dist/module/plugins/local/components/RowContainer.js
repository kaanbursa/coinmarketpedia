'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _mapProps = require('recompose/mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _getContext = require('recompose/getContext');

var _getContext2 = _interopRequireDefault(_getContext);

var _localSelectors = require('../selectors/localSelectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComposedRowContainer = function ComposedRowContainer(OriginalComponent) {
  return (0, _compose2.default)((0, _getContext2.default)({
    components: _react.PropTypes.object
  }), (0, _reactRedux.connect)(function (state) {
    return {
      columnIds: (0, _localSelectors.columnIdsSelector)(state),
      className: (0, _localSelectors.classNamesForComponentSelector)(state, 'Row'),
      style: (0, _localSelectors.stylesForComponentSelector)(state, 'Row')
    };
  }), (0, _mapProps2.default)(function (props) {
    return _extends({
      Cell: props.components.Cell
    }, props);
  }))(function (_ref) {
    var Cell = _ref.Cell,
        columnIds = _ref.columnIds,
        griddleKey = _ref.griddleKey,
        style = _ref.style,
        className = _ref.className;
    return _react2.default.createElement(OriginalComponent, {
      griddleKey: griddleKey,
      columnIds: columnIds,
      Cell: Cell,
      className: className,
      style: style
    });
  });
};

exports.default = ComposedRowContainer;