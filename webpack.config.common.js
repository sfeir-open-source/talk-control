// webpack 5.0.0 uses MD4 internally (FileSystemInfo snapshots + output hash).
// MD4 is unsupported by OpenSSL 3 (Node 22+). Patch crypto before webpack loads.
const crypto = require('crypto');
const _origCreateHash = crypto.createHash;
crypto.createHash = algo => _origCreateHash(algo === 'md4' ? 'sha256' : algo);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const layouts = [
    {
        folder: 'on-stage',
        filename: 'on-stage.html'
    },
    {
        folder: 'presenter',
        filename: 'presenter.html'
    },
    {
        folder: 'presenter',
        filename: 'presenter-mobile.html'
    }
];

module.exports = {
    entry: {
        'tc-component': './src/client/tc-component/index.js',
        'tc-controller': './src/client/tc-controller/index.js',
        'on-stage': './src/client/layouts/on-stage/index.js',
        presenter: './src/client/layouts/presenter/index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
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
    target: 'web',
    output: {
        publicPath: '', // Required by MiniCssExtractPlugin, but can be overridden dynamically (see tc-component/index.js)
        filename: '[name].bundle.js',
        hashFunction: 'sha256' // md4 (webpack default) is unsupported by OpenSSL 3 (Node 22+)
    },
    resolve: {
        alias: {
            // socket.io-client 4.x exports field resolves to ESM build for browser targets;
            // force CJS to avoid "import may only appear with sourceType: module" parse error.
            'socket.io-client': path.resolve(__dirname, 'node_modules/socket.io-client/build/cjs/index.js'),
            '@event-bus': path.resolve(__dirname, './src/common/event-bus/'),
            '@services': path.resolve(__dirname, './src/common/services/'),
            '@client': path.resolve(__dirname, './src/client/'),
            '@plugins': path.resolve(__dirname, './src/plugins/'),
            '@config': path.resolve(__dirname, './config/')
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
