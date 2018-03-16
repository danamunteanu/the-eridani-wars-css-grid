const webpack = require('webpack');
const path = require('path');
const parentDir = path.join(__dirname, '../');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: [
		path.join(parentDir,'index.js')
	],
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},{
				test: /\.less$/,
				loaders: ["style-loader", "css-loader", "less-loader"]
			},
			{
				test: /\.(scss|css)$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
				  {
					loader: 'file-loader',
					options: {}  
				  }
				]
			}
		]
    },
    output: {
        path: parentDir + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true
	},
	plugins: [
		new MiniCssExtractPlugin()
	],
	performance: {
		hints: false,
	}
}