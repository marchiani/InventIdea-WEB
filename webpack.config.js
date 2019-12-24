const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, argv) => {
	const PATH = {
		src: path.join(__dirname, 'src'),
		dist: path.join(__dirname, 'dist, argv.sub'),
		assets: 'assets/',
	};

	const PATH_RESOLVE = path.resolve(PATH.src, 'apps', argv.sub);

	return {

		resolve: {
			modules: [PATH_RESOLVE, PATH.src, 'node_modules'],
			extensions: ['.js', '.jsx', '.css', '.sass'],
			symlinks: false,
			alias: {
				'react-dom': '@hot-loader/react-dom',
			},
		},
		// BASE config
		externals: {
			paths: PATH,
		},
		entry: [
			path.resolve(PATH_RESOLVE, 'index.jsx'),
		],
		devServer: {
			contentBase: PATH.dist,
			publicPath: '/',
			port: 8081,
			overlay: {
				warnings: true,
				errors: true,
			},
		},
		output: {
			filename: 'index.[hash].js',
			path: PATH.dist,
			publicPath: '/',
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						name: 'vendors',
						test: /node_modules/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.jsx$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(png|jpg|gif|svg)$/,
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
					},
				}, {
					test: /\.scss$/,
					use: [
						'style-loader',
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: { sourceMap: true },
						}, {
							loader: 'postcss-loader',
							options: { sourceMap: true, config: { path: './postcss.config.js' } },
						}, {
							loader: 'sass-loader',
							options: { sourceMap: true },
						},
					],
				}, {
					test: /\.css$/,
					use: [
						'style-loader',
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: { sourceMap: true },
						}, {
							loader: 'postcss-loader',
							options: { sourceMap: true, config: { path: './postcss.config.js' } },
						},
					],
				}],
		},
		plugins: [
			new webpack.DefinePlugin({
				__ENVIRONMENT__: JSON.stringify(argv.environment),
				__IS_DEV__: argv.mode === 'development',
				__BUILD_TIME__: JSON.stringify((new Date()).toISOString()),
			}),
			new MiniCssExtractPlugin({
				filename: 'index.[hash].css',
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(PATH_RESOLVE, 'index.html'),
			}),
			new webpack.NamedModulesPlugin(),
		],
		mode: argv.mode,
		devtool: (argv.mode === 'development') ? 'cheap-module-eval-source-map' : false,
	};
};
