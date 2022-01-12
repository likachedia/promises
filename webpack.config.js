
// var path = require('path');
// var htmlWebpackPlugin = require("html-webpack-plugin");
import { fileURLToPath } from "url";
import path, { dirname,  } from "path";
import htmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
entry: path.resolve(__dirname, 'src', 'index.js'), // src/index.js is the path of our js file from Step 3
mode: 'development',
output: {
    path: path.resolve(__dirname, './dist'), // you can name this however you want
filename: 'bundle.js', // this as well
},
plugins: [
    new htmlWebpackPlugin({
        template: "./src/index.html",
        inject: true,
        }),
],
module: {
rules: [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
    }
],
}
}

export default config;