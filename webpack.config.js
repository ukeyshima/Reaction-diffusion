const path = require('path');
const dist = path.resolve(__dirname, 'dist/');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/App.jsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist/',
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
    path: dist,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  devServer: { host: '0.0.0.0', contentBase: dist },
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
