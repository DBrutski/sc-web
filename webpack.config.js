var path = require("path");
module.exports = {
    entry: {
        SCWeb: ["./client/js/index.js"],
    },
    output: {
        library: "SCWeb",
        path: path.resolve(__dirname, "client/dist"),
        publicPath: "/assets/",
        filename: "[name].js",
        sourceMapFilename: "[name].map.js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
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
    devtool: "eval"
};
