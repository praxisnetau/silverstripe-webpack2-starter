/* Webpack Development Server Configuration
===================================================================================================================== */

// Load Core Modules:

const path = require('path');
const webpack = require('webpack');

// Load Webpack Configuration:

const config = require(path.resolve(__dirname, 'webpack.config.js'))({development: true});

// Load Development Server Module:

const WebpackDevServer = require('webpack-dev-server');

// Create Development Server Instance:

const server = new WebpackDevServer(
  webpack(config), {
    hot: true,
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }
);

// Obtain Host and Port:

const host = config.devServer.host;
const port = config.devServer.port;

// Begin Listening:

server.listen(port, host, (err) => {
  if (err) return console.log(err);
  console.log(`Development server listening on ${host}:${port}...`);
});
