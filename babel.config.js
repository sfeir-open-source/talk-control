module.exports = {
    /*
    query-selector-shadow-dom is an es6 module intended to be used in client side only (through webpack).
    however the design of talk control that allows for shared modules between front and backend code causes node
    to report errors while loading this module (not a commonjs module)
    babel normally ignores all node_modules while transpiling. but for the above case, an ignore exception has been added
     */
    ignore: [filename => /node_modules\/(?!query-selector-shadow-dom)/.test(filename)],
    presets: ['@babel/preset-env'],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@event-bus': './src/common/event-bus',
                    '@services': './src/common/services',
                    '@client': './src/client',
                    '@server': './src/server',
                    '@config': './config',
                    '@plugins': './src/plugins'
                }
            }
        ]
    ]
};
