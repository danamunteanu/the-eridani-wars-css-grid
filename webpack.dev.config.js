/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: __dirname + "/src/index.js",
	output: {
		path: __dirname + "/public",
		filename: 'assets/bundle.js',
		chunkFilename: '[name].js'
	},
	devServer: {
		contentBase: __dirname + "/public/",
		inline: true,
		historyApiFallback: true
	},
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
	plugins: [
		new MiniCssExtractPlugin()
	],
	performance: {
		hints: false,
	}
}