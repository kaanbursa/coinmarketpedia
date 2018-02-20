'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMonthYear = exports.formatDate = undefined;

var _locales = require('./locales');

var formatterCache = {};

/**
 * Gets Intl-based date formatter from formatter cache. If it doesn't exist in cache
 * just yet, it will be created on the fly.
 */
var getFormatter = function getFormatter(options, locale) {
  if (!locale) {
    // Default parameter is not enough as it does not protect us from null values
    // eslint-disable-next-line no-param-reassign
    locale = (0, _locales.getDefaultLocale)();
  }

  var stringifiedOptions = JSON.stringify(options);

  if (!formatterCache[locale]) {
    formatterCache[locale] = {};
  }

  if (!formatterCache[locale][stringifiedOptions]) {
    formatterCache[locale][stringifiedOptions] = new Intl.DateTimeFormat(locale, options).format;
  }

  return formatterCache[locale][stringifiedOptions];
};

var formatDate = exports.formatDate = function formatDate(date, locale) {
  return getFormatter({ day: 'numeric', month: 'numeric', year: 'numeric' }, locale)(date);
};

var formatMonthYear = exports.formatMonthYear = function formatMonthYear(date, locale) {
  return getFormatter({ month: 'long', year: 'numeric' }, locale)(date);
};