const common = require('./webpack.config.common');
const config = require('./config/config.json');

module.exports = {
    ...common,
    mode: 'development',
    devServer: {
        client: {
            overlay: true,
        },
        port: config.tcController.port,
        hot: false,
    }
};
