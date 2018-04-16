const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: {
        SCWeb: ["./client/js/index.js"],
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
    externals: {'SCWeb': 'SCWeb', 'jquery': 'jQuery'},
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
            {test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/},
            {test: /\.(ts|tsx)$/, use: 'ts-loader', exclude: /node_modules/},
        ]
    },
    devtool: "eval-source-map",
    plugins: [new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })]
};
