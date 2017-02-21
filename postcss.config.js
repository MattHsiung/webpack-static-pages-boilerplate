var webpack = require('webpack')
var PostCssSmartImport = require('postcss-smart-import')
var PreCss = require('precss')
var Autoprefixer = require('autoprefixer')

module.exports = {
	plugins: [
		PostCssSmartImport({
			addDependencyTo: webpack,
		}),
		PreCss(),
		Autoprefixer({
			browsers: ['last 2 versions', 'IE >= 9']
		})
	]
}
