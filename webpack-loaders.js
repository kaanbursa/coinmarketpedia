const path = require('path');

exports.babel = {
  test: /\.jsx?$/,
  include: [
    path.resolve(__dirname, './src'),
  ],
  use: 'babel-loader',
};




exports.style = {
  test: /\.css$/,
  include: /node_modules/,
  use: [
    'style-loader',
    'css-loader',
  ],
};

exports.file = {
  test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
  loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
}

exports.eslint = (path) => {
  return {
    test: /\.jsx?$/,
    use: 'eslint-loader',
    enforce: 'pre',
    include: path,
  };
};
