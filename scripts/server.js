import express from "express";
import { join } from "path";
import open from "open";

import webpack from "webpack";
import config from "../webpack.config.js";
import webpackDevMiddleware from "webpack-dev-middleware";


const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(
    webpackDevMiddleware(compiler, {
publicPath: config.output.publicPath,
})
);


app.use(express.static('src'));

app.get("/", function(req,res){
    res.sendFile(join(__dirname, "../src/main.html"));
})

app.listen(port, function(err) {
    if(err){
        console.log(err);
    } else {
        open("http://localhost:"  + port)
    }
})