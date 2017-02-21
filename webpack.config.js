var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var StyleLintPlugin = require('stylelint-webpack-plugin')
var WebpackMd5Hash = require('webpack-md5-hash')
var ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
var InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')

module.exports = {

	stats: {
		assets: false,
		colors: true,
		version: false,
		hash: true,
		timings: true,
		chunks: true,
		chunkModules: true
	},

	entry: {
		top: './src/top/index.js',
		about: './src/about/index.js',
	},

	output: {
		path: path.resolve(__dirname, 'dist', 'assets'),
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		publicPath: '/assets/'
	},

	devtool: 'source-map',

	devServer: {
		contentBase: 'dist',
		port: 3000
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js?$/,
				loader: 'eslint-loader',
				options: {
					configFile: "./.eslintrc",
				},
				exclude: /(node_modules)/,
			},
			{
				test: /\.pug$/,
				use: ExtractTextPlugin.extract([
					'html-loader',
					'pug-loader',
				])
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						'postcss-loader'
					]
				})
			},
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				loader: 'babel-loader',
				options: {
					presets: [
						['es2015', { modules: false }]
					]
				}
			}
		]
	},

	plugins: [

		new webpack.optimize.OccurrenceOrderPlugin(),

		new StyleLintPlugin({
			configFile: './.stylelintrc',
			context: "./src",
			files: "**/*.css",
		}),

		new ExtractTextPlugin({
			filename: "[name].[contenthash].css",
		}),

		// Top page
		new HtmlWebpackPlugin({
			excludeChunks: ['about'],
			template: '!!pug-loader!./src/top/index.pug',
			filename: '../index.html',
			chunksSortMode: 'dependency',
		}),

		// About page
		new HtmlWebpackPlugin({
			excludeChunks: ['top'],
			template: '!!pug-loader!./src/about/index.pug',
			filename: '../about.html',
			chunksSortMode: 'dependency',
		}),

		new webpack.optimize.CommonsChunkPlugin({
		  name: 'vendor',
		  minChunks: ({ resource }) => /node_modules/.test(resource),
		}),

		new webpack.optimize.CommonsChunkPlugin({
			name: ['commons', 'vendor', 'bootstrap'],
		}),

		// new webpack.optimize.UglifyJsPlugin(),

		new WebpackMd5Hash(),
	]
}
