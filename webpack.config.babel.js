import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import validate from 'webpack-validator';
import parts from './libs/parts';

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css'),
  ],
  build: path.join(__dirname, 'build'),
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
    }),
  ],
};

let config;

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,

          // Match GitHub project name
          publicPath: '/webpack-demo/',
          filename: '[name].[chunkhash].js',

          // This is used for require.ensure. The setup
          // will work without but this is useful to set
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production',
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react'],
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
      }),
    );
}

// Run validator in quiet mode to avoid output in stats
module.exports = validate(config, {
  quiet: true,
});
