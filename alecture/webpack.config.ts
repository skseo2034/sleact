import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
/*const Dotenv = require('dotenv-webpack');*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
// dotenv.config();

const DEV = process.env.DEV;
console.log(DEV);
dotenv.config({
	path: DEV ? './env/local.env' : './env/real.env',
});

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';
// console.log(process.env.NODE_ENV);

const config: Configuration = {
	name: 'sleact',
	mode: isDevelopment ? 'development' : 'production',
	devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
		alias: {
			'@hooks': path.resolve(__dirname, 'hooks'),
			'@components': path.resolve(__dirname, 'components'),
			'@layouts': path.resolve(__dirname, 'layouts'),
			'@pages': path.resolve(__dirname, 'pages'),
			'@utils': path.resolve(__dirname, 'utils'),
			'@typings': path.resolve(__dirname, 'typings'),
		},
	},
	entry: {
		app: './client',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								targets: { browsers: ['last 2 chrome versions'] },
								debug: isDevelopment,
							},
						],
						'@babel/preset-react',
						'@babel/preset-typescript',
					],
					env: {
						development: {
							plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
						},
						production: {
							plugins: ['@emotion'],
						},
					},
				},
				exclude: path.join(__dirname, 'node_modules'),
			},
			{
				test: /\.css?$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			async: false,
			// eslint: {
			//   files: "./src/**/*",
			// },
		}),
		new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
		/*new Dotenv(),*/
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/dist/',
	},
	devServer: {
		historyApiFallback: true, // react router
		port: 3090,
		devMiddleware: { publicPath: '/dist/' },
		static: { directory: path.resolve(__dirname) },
		proxy: {
			// front 단에서 cros 해제 하는것 요청시 http://localhost:3095 제외한 url 호출 (ex. /api/users/login)
			'/api/': {
				target: 'http://localhost:3095',
				changeOrigin: true,
			},
		},
	},
};

if (isDevelopment && config.plugins) {
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.plugins.push(new ReactRefreshWebpackPlugin());
	config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
	config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
	config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
