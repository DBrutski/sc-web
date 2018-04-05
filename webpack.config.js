var path = require("path");
module.exports = {
    entry: {
        SCWeb: ["./client/js/index.js"],
        ui: ["./client/js/Ui/index.js"],
        core: ["./client/js/Core/index.js"],
        utils: ["./client/js/Utils/index.js"],
        startup: ["./client/js/startup.js"],
    },
    output: {
        library: "[name]",
        path: path.resolve(__dirname, "client/dist"),
        publicPath: "/assets/",
        filename: "[name].js",
        sourceMapFilename: "[name].map.js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: [
        'ui', 'core', 'utils'
    ],
    devServer: {
        proxy: [
            {
                context: ["/sctp", "/api", "/client", "/static"],
                target: "http://localhost:8000",
                secure: false,
                ws: true
            }
        ],
        contentBase: "./dist",
        inline: true,
        hot: true
    },
    module: {
        rules: [
            {test: /\.css$/, use: 'css-loader'},
            {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/}
        ]
    },
    devtool: "eval-source-map"
};
