const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
    config.plugins.push(new NodePolyfillPlugin({
        excludeAliases: [
            "assert",
            "buffer",
            "console",
            "constants",
            "crypto",
            "domain",
            "events",
            "http",
            "https",
            "os",
            "path",
            "punycode",
            "querystring",
            //"stream",
            "_stream_duplex",
            "_stream_passthrough",
            "_stream_transform",
            "_stream_writable",
            "string_decoder",
            "sys",
            "timers",
            "tty",
            "url",
            "util",
            "vm",
            "zlib",
        ]
    }));
    config.module.rules.push(
        {
            test: /\.ya?ml$/,
            type: 'json', // Required by Webpack v4
            use: 'yaml-loader'
        }
    )
    console.log(config)

    return config;
};