const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Promise = require('es6-promise-promise');

exports.environment = function (env) {
  return new webpack.EnvironmentPlugin(env);
};

exports.loaderOptions = function (options) {
  return new webpack.LoaderOptionsPlugin(options);
};

exports.uglifyJs = function (options) {
  return new webpack.optimize.UglifyJsPlugin(options);
};

exports.genHtml = function (options) {
  return new HtmlWebpackPlugin(options);
};

exports.hotModule = function () {
  return new webpack.HotModuleReplacementPlugin({
    multistep: true,
  });
};
exports.fetchModule = function () {
  new webpack.ProvidePlugin({
    Promise: 'es6-promise-promise',
    fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',

  })
}

exports.definePlugin = function () {
  return new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  });
};

exports.globals = function (nodeEnv) {
  return new webpack.DefinePlugin({
    __DEV__ : nodeEnv === 'development',
  });
};
