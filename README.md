# SilverStripe Webpack2 Starter

#### SilverStripe 4 + Webpack 2 + Bootstrap 4 = awesome! 😎

This starter kit expands upon
[silverstripe-webpack-starter](https://github.com/unclecheese/silverstripe-webpack-starter) and has been
revised to work with [SilverStripe 4](https://github.com/silverstripe/silverstripe-framework),
[Webpack 2](https://github.com/webpack/webpack) and [Bootstrap 4](https://github.com/twbs/bootstrap).
[Modernizr](https://github.com/modernizr/modernizr) is also included for easy browser feature detection.

## Installation

Installation is via [Composer](https://getcomposer.org).

Create a new project based on this repo by running:

```shell
$ composer create-project praxisnetau/silverstripe-webpack2-starter /path/to/project dev-master
```

Alternatively, clone the repo, and then run:

```shell
$ composer install
```

Once Composer has finished downloading packages, you'll need to create a `.env` file either in the project root, or the
parent directory. An example file `.env.example` is included in the repo to give you a head start. The `.env` file
configures the environment and database settings for SilverStripe 4. Make sure you don't commit any `.env` files with
sensitive information (such as passwords) to version control!

You'll also need to install the frontend dependencies in the `themes/app` folder. You can either use Yarn or NPM to
install:

### Yarn

```shell
$ cd themes/app $ yarn install
```

### NPM

```shell
$ cd themes/app $ npm install
```

## Development

Once the frontend dependencies are installed in `node_modules`, you'll need to start the Webpack development server:

### Yarn

```shell
$ yarn run start
```

### NPM

```shell
$ npm run start
```

If everything goes according to plan, the Webpack development server should start running on `http://localhost:8080` and
Webpack will compile the theme source files.

You can now access your app host in your browser. SilverStripe will build it's database, and CSS changes will be hot
loaded by Webpack.

## Configuration

The theme uses `bootstrap-loader` and `modernizr-loader` for easy customation of your theme via configuration files:

* `themes/app/.bootstraprc` - YAML configuration for Bootstrap
* `themes/app/.modernizrrc` - YAML configuration for Modernizr

Using these files, you can selectively enable or disable features of both Bootstrap and Modernizr for your custom app
build.

## Production

To prepare files for distribution to production servers, you can run Webpack in production mode by using:

### Yarn

```shell
$ yarn run build
```

### NPM

```shell
$ npm run build
```

Webpack will clear your `themes/app/production` folder and output optimised and minified CSS and JavaScript.

## Deployment

When deploying your project to a live server, you do not need to deploy the `themes/app/source` folder. Only deploy
`themes/app/production`.

## Attribution

* Thanks to [Aaron Carlino](https://github.com/unclecheese) and [Stevie Mayhew](https://github.com/stevie-mayhew) for
laying the groundwork for this repo to be built.

