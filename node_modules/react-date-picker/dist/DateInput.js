'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Divider = require('./Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _DayInput = require('./DateInput/DayInput');

var _DayInput2 = _interopRequireDefault(_DayInput);

var _MonthInput = require('./DateInput/MonthInput');

var _MonthInput2 = _interopRequireDefault(_MonthInput);

var _YearInput = require('./DateInput/YearInput');

var _YearInput2 = _interopRequireDefault(_YearInput);

var _NativeInput = require('./DateInput/NativeInput');

var _NativeInput2 = _interopRequireDefault(_NativeInput);

var _dateFormatter = require('./shared/dateFormatter');

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

var _utils = require('./shared/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);
var className = 'react-date-picker__button__input';

var datesAreDifferent = function datesAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
};

var findPreviousInput = function findPreviousInput(element) {
  var previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

var findNextInput = function findNextInput(element) {
  var nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

var selectIfPossible = function selectIfPossible(element) {
  if (!element) {
    return;
  }
  element.focus();
  element.select();
};

var removeUnwantedCharacters = function removeUnwantedCharacters(str) {
  return str.split('').filter(function (a) {
    return (
      // We don't want spaces in dates
      a.charCodeAt(0) !== 32 &&
      // Internet Explorer specific
      a.charCodeAt(0) !== 8206
    );
  }).join('');
};

var DateInput = function (_Component) {
  _inherits(DateInput, _Component);

  function DateInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DateInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DateInput.__proto__ || Object.getPrototypeOf(DateInput)).call.apply(_ref, [this].concat(args))), _this), _this.getValueFrom = function (value) {
      if (!value) {
        return null;
      }

      var _this$props = _this.props,
          minDate = _this$props.minDate,
          maxDate = _this$props.maxDate;

      var rawValueFrom = value instanceof Array ? value[0] : value;
      var valueFromDate = new Date(rawValueFrom);

      if (Number.isNaN(valueFromDate.getTime())) {
        throw new Error('Invalid date: ' + value);
      }

      var valueFrom = (0, _dates.getBegin)(_this.valueType, valueFromDate);

      return (0, _utils.between)(valueFrom, minDate, maxDate);
    }, _this.getValueTo = function (value) {
      if (!value) {
        return null;
      }

      var _this$props2 = _this.props,
          minDate = _this$props2.minDate,
          maxDate = _this$props2.maxDate;

      var rawValueTo = value instanceof Array ? value[1] : value;
      var valueToDate = new Date(rawValueTo);

      if (Number.isNaN(valueToDate.getTime())) {
        throw new Error('Invalid date: ' + value);
      }

      var valueTo = (0, _dates.getEnd)(_this.valueType, valueToDate);

      return (0, _utils.between)(valueTo, minDate, maxDate);
    }, _this.state = {
      year: null,
      month: null,
      day: null
    }, _this.onKeyDown = function (event) {
      switch (event.key) {
        case 'ArrowLeft':
          {
            event.preventDefault();

            var input = event.target;
            var previousInput = findPreviousInput(input);
            selectIfPossible(previousInput);
            break;
          }
        case 'ArrowRight':
        case _this.divider:
          {
            event.preventDefault();

            var _input = event.target;
            var nextInput = findNextInput(_input);
            selectIfPossible(nextInput);
            break;
          }
        default:
      }
    }, _this.onChange = function (event) {
      var _event$target = event.target,
          name = _event$target.name,
          value = _event$target.value;


      _this.setState(_defineProperty({}, name, value ? parseInt(value, 10) : null), _this.onChangeExternal);
    }, _this.onChangeNative = function (event) {
      var value = event.target.value;


      if (_this.props.onChange) {
        _this.props.onChange(new Date(value));
      }
    }, _this.onChangeExternal = function () {
      if (_this.props.onChange) {
        var formElements = [_this.dayInput, _this.monthInput, _this.yearInput].filter(Boolean);

        var values = {};
        formElements.forEach(function (formElement) {
          values[formElement.name] = formElement.value;
        });

        if (formElements.every(function (formElement) {
          return formElement.value && formElement.checkValidity();
        })) {
          var proposedValue = new Date(values.year, (values.month || 1) - 1, values.day || 1);
          var processedValue = _this.getProcessedValue(proposedValue);
          _this.props.onChange(processedValue, false);
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DateInput, [{
    key: 'getProcessedValue',


    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var returnValue = this.props.returnValue;


      switch (returnValue) {
        case 'start':
          return this.getValueFrom(value);
        case 'end':
          return this.getValueTo(value);
        default:
          throw new Error('Invalid returnValue.');
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateValues();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextValue = nextProps.value;
      var value = this.props.value;


      if (
      // Toggling calendar visibility resets values
      nextProps.isCalendarOpen !== this.props.isCalendarOpen || datesAreDifferent.apply(undefined, _toConsumableArray([nextValue, value].map(this.getValueFrom))) || datesAreDifferent.apply(undefined, _toConsumableArray([nextValue, value].map(this.getValueTo)))) {
        this.updateValues(nextProps);
      }
    }

    /**
     * Returns value type that can be returned with currently applied settings.
     */

  }, {
    key: 'updateValues',
    value: function updateValues() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      var value = this.getValueFrom(props.value);

      this.setState({
        year: value ? (0, _dates.getYear)(value) : null,
        month: value ? (0, _dates.getMonth)(value) : null,
        day: value ? (0, _dates.getDay)(value) : null
      });
    }

    /**
     * Called when non-native date input is changed.
     */


    /**
     * Called when native date input is changed.
     */


    /**
     * Called after internal onChange. Checks input validity. If all fields are valid,
     * calls props.onChange.
     */

  }, {
    key: 'renderDay',
    value: function renderDay() {
      var _props = this.props,
          maxDetail = _props.maxDetail,
          showLeadingZeros = _props.showLeadingZeros;

      // Do not display if maxDetail is "year" or less

      if (allViews.indexOf(maxDetail) < 3) {
        return null;
      }

      var value = this.state.day;


      return _react2.default.createElement(_DayInput2.default, _extends({
        key: 'day',
        className: className,
        maxDetail: this.props.maxDetail,
        month: this.state.month,
        showLeadingZeros: showLeadingZeros,
        value: value,
        year: this.state.year
      }, this.commonInputProps));
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var _props2 = this.props,
          maxDetail = _props2.maxDetail,
          showLeadingZeros = _props2.showLeadingZeros;

      // Do not display if maxDetail is "decade" or less

      if (allViews.indexOf(maxDetail) < 2) {
        return null;
      }

      var value = this.state.month;


      return _react2.default.createElement(_MonthInput2.default, _extends({
        key: 'month',
        className: className,
        maxDetail: this.props.maxDetail,
        minDate: this.props.minDate,
        showLeadingZeros: showLeadingZeros,
        value: value,
        year: this.state.year
      }, this.commonInputProps));
    }
  }, {
    key: 'renderYear',
    value: function renderYear() {
      return _react2.default.createElement(_YearInput2.default, _extends({
        key: 'year',
        className: className,
        value: this.state.year,
        valueType: this.valueType
      }, this.commonInputProps));
    }
  }, {
    key: 'renderCustomInputs',
    value: function renderCustomInputs() {
      var _this2 = this;

      var divider = this.divider,
          placeholder = this.placeholder;


      return placeholder.split(divider).map(function (part) {
        switch (part) {
          case 'day':
            return _this2.renderDay();
          case 'month':
            return _this2.renderMonth();
          case 'year':
            return _this2.renderYear();
          default:
            return null;
        }
      }).filter(Boolean).reduce(function (result, element, index, array) {
        result.push(element);

        if (index + 1 < array.length) {
          result.push(
          // eslint-disable-next-line react/no-array-index-key
          _react2.default.createElement(
            _Divider2.default,
            { key: 'separator_' + index },
            divider
          ));
        }

        return result;
      }, []);
    }
  }, {
    key: 'renderNativeInput',
    value: function renderNativeInput() {
      return _react2.default.createElement(_NativeInput2.default, {
        key: 'date',
        maxDate: this.props.maxDate,
        minDate: this.props.minDate,
        name: this.props.name,
        onChange: this.onChangeNative,
        required: this.props.required,
        value: this.props.value,
        valueType: this.valueType
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: className },
        this.renderNativeInput(),
        this.renderCustomInputs()
      );
    }
  }, {
    key: 'valueType',
    get: function get() {
      var maxDetail = this.props.maxDetail;

      return allValueTypes[allViews.indexOf(maxDetail)];
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'divider',
    get: function get() {
      var locale = this.props.locale;

      var date = new Date(2017, 11, 11);

      return removeUnwantedCharacters((0, _dateFormatter.formatDate)(date, locale)).match(/[^0-9]/)[0];
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'placeholder',
    get: function get() {
      var locale = this.props.locale;

      var date = new Date(2017, 11, 11);

      return removeUnwantedCharacters((0, _dateFormatter.formatDate)(date, locale)).replace('2017', 'year').replace('12', 'month').replace('11', 'day');
    }
  }, {
    key: 'commonInputProps',
    get: function get() {
      var _this3 = this;

      return {
        maxDate: this.props.maxDate,
        minDate: this.props.minDate,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        // This is only for showing validity when editing
        required: this.props.required || this.props.isCalendarOpen,
        itemRef: function itemRef(ref) {
          if (!ref) return;

          // Save a reference to each input field
          _this3[ref.name + 'Input'] = ref;
        }
      };
    }
  }]);

  return DateInput;
}(_react.Component);

exports.default = DateInput;


DateInput.defaultProps = {
  maxDetail: 'month',
  name: 'date',
  returnValue: 'start'
};

DateInput.propTypes = {
  isCalendarOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews),
  minDate: _propTypes3.isMinDate,
  name: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  returnValue: _propTypes2.default.oneOf(['start', 'end']),
  required: _propTypes2.default.bool,
  showLeadingZeros: _propTypes2.default.bool,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date)])
};