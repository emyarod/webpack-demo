import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import PurifyCSSPlugin from 'purifycss-webpack-plugin';

exports.devServer = options => ({
  devServer: {
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,

    // Unlike the cli flag, this doesn't set
    // HotModuleReplacementPlugin!
    hot: true,
    inline: true,

    // Display only errors to reduce the amount of output.
    stats: 'errors-only',

    // Parse host and port from env to allow customization.
    //
    // If you use Vagrant or Cloud9, set
    // host: options.host || '0.0.0.0';
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host: options.host, // Defaults to `localhost`
    port: options.port, // Defaults to 8080
  },
  plugins: [
    // Enable multi-pass compilation for enhanced performance
    // in larger projects. Good default.
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
});

exports.setupCSS = paths => ({
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: paths,
      },
    ],
  },
});

exports.minify = () => ({
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.extractBundle = (options) => {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],
      }),
    ],
  };
};

exports.clean = path => ({
  plugins: [
    new CleanWebpackPlugin([path], {
      // Without `root` CleanWebpackPlugin won't point to our
      // project and will fail to work.
      root: process.cwd(),
    }),
  ],
});

exports.extractCSS = paths => ({
  module: {
    loaders: [
      // Extract CSS during build
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: paths,
      },
    ],
  },
  plugins: [
    // Output extracted CSS to a file
    new ExtractTextPlugin('[name].[chunkhash].css'),
  ],
});

exports.purifyCSS = paths => ({
  plugins: [
    new PurifyCSSPlugin({
      basePath: process.cwd(),
      // `paths` is used to point PurifyCSS to files not
      // visible to Webpack. You can pass glob patterns
      // to it.
      paths,
    }),
  ],
});
