var webpack = require('webpack'),
    path = require('path'),
    commonConfig = require('./webpack.common.config.js'),
    _ = require('underscore');

module.exports = _.extend({}, commonConfig, {
    cache: true,
    debug: false,
    console: false,
    entry: [
        './src/Hercules.js'
    ],
    output: {
        path: './build/',
        filename: "HerculesControl.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ]
});
