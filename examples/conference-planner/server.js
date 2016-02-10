import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { schema } from './data/schema';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8003;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({ schema, pretty: true }));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
const compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: [
            './build/babelRelayPlugin',
            'angular2-annotations',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-flow-strip-types'],
        },
        test: /\.js$/,
      },
      {
        test: /\.less$/,
        loader: 'style!css!less-loader',
      },
    ],
  },
  output: { filename: 'app.js', path: '/' },
});
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: '/js/',
  stats: { colors: true },
  noInfo: true,
});
// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`Conference Planner is now running on http://localhost:${APP_PORT}`);
});
