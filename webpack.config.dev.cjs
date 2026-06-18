const common = require('./webpack.config.common');
const config = require('./config/config.json');

module.exports = {
    ...common,
    mode: 'development',
    devServer: {
        client: {
            overlay: true
        },
        port: config.tcController.port,
        hot: false,
        allowedHosts: 'all',
        // output.publicPath est '' (vide) pour MiniCssExtractPlugin ; wds5 a besoin de '/' pour servir les assets
        devMiddleware: {
            publicPath: '/'
        },
        // tc-component.bundle.js est chargé cross-origin depuis les présentations patchées
        headers: {
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Access-Control-Allow-Origin': '*'
        }
    }
};
