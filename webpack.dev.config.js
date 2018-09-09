const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');

const appBase = process.cwd();
const appSrc = path.resolve(appBase, 'src/');
const appDist = path.resolve(appBase, 'build/');
const appIndexJs = path.resolve(appSrc, 'index.ts');

module.exports = {
    entry: appIndexJs,
    output: {
        path: appDist,
        publicPath: '/',
        filename: 'index.js',
        library: 'looper',
        libraryTarget: 'umd',
    },

    mode: 'development',
    performance: {
        hints: 'warning',
    },
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },

    devtool: 'cheap-module-eval-source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: appSrc,
                use: [
                    'awesome-typescript-loader',
                ],
            },
        ],
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: false,
            allowAsyncCycles: false,
            cwd: appBase,
        }),
    ],
};
