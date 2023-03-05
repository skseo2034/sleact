// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

// entry 에 module 적용하고, 추가적으로 plugins 적용해서 output 으로 결과를 내 보낸다.
module.exports = {
	name: 'sleact',
	mode: isDevelopment ? 'development' : 'production', // 개발시 none 또는 development 운영시 production, e-hrd 개발: development, 운영:production
	stats: {
		colors: true,
	},

	devtool: !isDevelopment ? 'hidden-source-map' : 'source-map', // 개발시 eval 또는 eval-source-map 운영시 source-map 또는 hidden-source-map 사용 e-hrd 개발: source-map, 운영:hidden-source-map
	resolve: {
		// 모듈을 해석할 때 검색할 디렉터리를 webpack에 알려줍니다.
		// 기본적으로 node_modules 이다. node_modules 만 있을때는 생략 가능!!
		//modules: [path.resolve(__dirname, 'myTypes'), 'node_modules'],
		// 확장자를 배열로 넣어둠
		extensions: ['.ts', '.tsx'],
	},

	entry: {
		app: ['./client.tsx'],
		//	resourceCost: ['./src/main/webapp/resources/ts/webPage/resourceCost/resourceCostList.ts'],
		//	company: ['./src/main/webapp/resources/ts/webPage/company/companyList.ts'],
		//	building: ['./src/main/webapp/resources/ts/webPage/building/buildingList.ts'],
		//  ... 나머지는 생략 추후에 필요시 추가 하면 됨.
	},
	module: {
		// entry -> output 으로 변환 할때 중간에 개입하는 것이 module 임.
		rules: [
			{
				test: /\.tsx$/,
				use: 'ts-loader',
				exclude: /(node_modules|@myTypes)/,
			},
			{
				test: /\.css?$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [],
	output: {
		// build 결과물 정의
		path: path.resolve(__dirname, './dist'),
		//filename: 'main.bundle.js',
		filename: '[name].js',
	},
};
