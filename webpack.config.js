/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const { global, entry } = env;
  const ASSETS_PATH = path.join(__dirname, env.path);
  const ENTRY_PATH = path.join(ASSETS_PATH, 'src/index.tsx');
  const DIST_PATH = path.join(ASSETS_PATH, 'dist/');
  let ASSETS_UMD = env.path.replace('/packages/', '').split('-').join('_').toUpperCase();

  console.log(ASSETS_UMD, global, entry, env);

  const plugins = env.analysis
    ? [
        new MiniCssExtractPlugin(),
        new BundleAnalyzerPlugin({
          analyzerPort: Math.round(Math.random() * 100 + 8000),
        }),
        new MonacoWebpackPlugin({
          languages: ['json', 'cypher', 'typescript'],
        }),
      ]
    : [
        new MiniCssExtractPlugin(),
        new MonacoWebpackPlugin({
          languages: ['json', 'cypher', 'typescript'],
        }),
      ];
  return {
    entry: {
      index: entry ? path.join(__dirname, entry) : ENTRY_PATH,
    },
    mode: 'development', //argv.mode,
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: /node_modules/, //不包含 node_modules 中的JS文件
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
            ],
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            compilerOptions: {
              declaration: false,
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
      fallback: {
        fs: false, //https://webpack.js.org/migrate/5/#clean-up-configuration
        // crypto: require.resolve('crypto-browserify'),
        // constants: require.resolve('constants-browserify'),
        // // // crypto: false,
        // // // constants: false,
        // stream: require.resolve('stream-browserify'),
        // buffer: require.resolve('buffer'),
        // buffer: require.resolve('buffer-browserify'),
      },
    },
    // devtool: 'cheap-module-source-map',
    output: {
      library: global || ASSETS_UMD,
      libraryTarget: 'umd',
      path: DIST_PATH,
      publicPath: './',
      filename: 'index.min.js',
    },
    plugins: plugins,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'node:os': 'commonjs2 node:os',
    },
    watch: Boolean(env.watch),
  };
};
