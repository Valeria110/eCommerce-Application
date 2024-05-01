/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // historyApiFallback: true,
    static: path.resolve(__dirname, './dist'),
  },
};
