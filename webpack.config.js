const path = require('path');
const docs = path.resolve(__dirname, 'docs/');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/App.jsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'docs/',
    historyApiFallback: true,
    port: 8080,
    inline: true,
    hot: true,
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.LoaderOptionsPlugin({
    //   debug: true,
    // }),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
  ],
  output: {
    path: docs,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  devServer: { host: '0.0.0.0', contentBase: docs },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl)$/,
        use: ['raw-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
};
