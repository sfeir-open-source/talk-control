const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const layouts =  [
    {
        folder: 'on-stage',
        filename:  'on-stage.html'
    },
    {
        folder: 'presenter',
        filename:  'presenter.html'
    },
    {
        folder: 'presenter',
        filename:  'presenter-mobile.html'
    }
];

module.exports = {
    mode: 'development',
    entry: {
        'tc-controller': './src/client/tc-controller/index.js',
        'on-stage': './src/client/layouts/on-stage/index.js',
        presenter: './src/client/layouts/presenter/index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|eot|svg|woff|woff2|ttf)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets',
                            limit: 1024
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist-webpack')
    },
    resolve: {
        alias: {
            '@config': path.resolve(__dirname, './config/'),
            '@client': path.resolve(__dirname, './src/client/'),
            '@event-bus': path.resolve(__dirname, './src/common/event-bus/'),
            '@services': path.resolve(__dirname, './src/common/services/'),
            '@plugins': path.resolve(__dirname, './src/plugins/')
        },
        extensions: ['.js', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/client/tc-controller/index.html',
            chunks: ['tc-controller']
        }),
        ...layouts.map(
            layout =>
                new HtmlWebpackPlugin({
                    filename: `${layout.filename}`,
                    template: `./src/client/layouts/${layout.folder}/${layout.filename}`,
                    chunks: [layout.folder]
                })
        )
    ]
};
