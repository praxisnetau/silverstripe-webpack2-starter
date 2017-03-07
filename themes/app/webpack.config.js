/* Webpack Configuration
===================================================================================================================== */

// Load Core Modules:

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

// Load Plugin Modules:

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Configure Paths:

const PATHS = {
  SRC: path.resolve(__dirname, 'source'),
  DIST: path.resolve(__dirname, 'production'),
  BUNDLES: path.resolve(__dirname, 'source/bundles'),
  MODULES: path.resolve(__dirname, 'node_modules'),
  PUBLIC: '/themes/app/production/'
};

// Configure Development Server:

const DEV_SERVER = {
  HOST: 'localhost',
  PORT: 8080
};

// Configure Development Server URL:

const DEV_SERVER_URL = `http://${DEV_SERVER.HOST}:${DEV_SERVER.PORT}`;

// Configure Entry:

const entry = (env, file) => {
  return (env === 'production') ? [
    file
  ] : [
    'webpack-dev-server/client?' + DEV_SERVER_URL,
    'webpack/hot/dev-server',
    file
  ];
};

// Configure Style Loader:

const style = (env, loaders) => {
  return (env === 'production') ? ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: loaders
  }) : [{ loader: 'style-loader' }].concat(loaders);
};

// Configure Script Loader:

const script = (env, loaders) => {
  return (env === 'production') ? loaders : loaders.concat({ loader: 'webpack-module-hot-accept' });
};

// Configure Rules:

const rules = (env) => {
  return [
    {
      test: /\.js$/,
      use: script(env, [
        {
          loader: 'babel-loader'
        }
      ]),
      exclude: [ PATHS.MODULES ]
    },
    {
      test: /\.css$/,
      use: style(env, [
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        }
      ])
    },
    {
      test: /\.scss$/,
      use: style(env, [
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader'
        }
      ])
    },
    {
      test: /\.(gif|jpg|png)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]',
            limit: 10000
          }
        }
      ]
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'svg/[name].[ext]'
          }
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeTitle: true },
              { convertColors: { shorthex: false } },
              { convertPathData: false }
            ]
          }
        }
      ]
    },
    {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/font-woff',
            limit: 10000
          }
        }
      ]
    },
    {
      test: /\.modernizrrc$/,
      use: [
        {
          loader: 'modernizr-loader'
        },
        {
          loader: 'json-loader'
        },
        {
          loader: 'yaml-loader'
        }
      ]
    }
  ];
};

// Configure Devtool:

const devtool = (env) => {
  return (env === 'production') ? false : 'source-map';
};

// Configure Plugins:

const plugins = (env, src, dist) => {
  
  // Define Common Plugins:
  
  var common = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Tether: 'tether',
      Modernizr: 'modernizr',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      ScrollSpy: 'exports-loader?ScrollSpy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Util: 'exports-loader?Util!bootstrap/js/dist/util'
    })
  ];
  
  // Answer Common + Environment-Specific Plugins:
  
  return common.concat((env === 'production') ? [
    new CleanWebpackPlugin([ dist ], {
      verbose: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        output: {
          path: PATHS.DIST
        },
        context: PATHS.DIST,
        postcss: [ autoprefixer ] // see "browserslist" in package.json
      }
    }),
    new ExtractTextPlugin({
      filename: 'styles/[name].css',
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        beautify: false,
        comments: false,
        semicolons: false
      },
      compress: {
        unused: false,
        warnings: false
      }
    })
  ] : [
    new webpack.HotModuleReplacementPlugin()
  ]);
  
};

// Define Configuration:

const config = (env) => {
  return {
    entry: {
      'bundle': entry(env, path.resolve(PATHS.BUNDLES, 'bundle.js')) // injects WDS/HMR stuff in dev mode
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
      publicPath: (env === 'production' ? PATHS.PUBLIC : `${DEV_SERVER_URL}/production/`)
    },
    module: {
      rules: rules(env)
    },
    devtool: devtool(env),
    plugins: plugins(env, PATHS.SRC, PATHS.DIST),
    resolve: {
      alias: {
        'jquery$': path.resolve(PATHS.MODULES, 'jquery/src/jquery'),
        'modernizr$': path.resolve(__dirname, '.modernizrrc')
      },
      modules: [
        PATHS.SRC,
        PATHS.MODULES
      ]
    },
    devServer: {
      host: DEV_SERVER.HOST,
      port: DEV_SERVER.PORT
    }
  };
};

// Define Module Exports:

module.exports = (env = {development: true}) => {
  process.env.NODE_ENV = (env.production ? 'production' : 'development');
  console.log(`Running in ${process.env.NODE_ENV} mode...`);
  return config(process.env.NODE_ENV);
};
