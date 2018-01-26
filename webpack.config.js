var webpack = require('webpack');

module.exports = {
    context: __dirname + '/static/',
    entry: {
        app: './js/app.js',
        adminapp: './js/admin/app.js',
        darkfair: './js/darkfair.js',
    },
    output: { path: __dirname + '/static/dist/js/', filename: '[name].js'},
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: 'inline'
                        }
                    }
                ]
            }
        ]
    }
};