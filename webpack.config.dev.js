const common = require('./webpack.config.common');
const config = require('./config/config.json');

module.exports = {
    ...common,
    mode: 'development',
    devServer: {
        overlay: true,
        port: config.tcController.port,
        hot: false,
        quiet: true
    }
};
