// module.exports = function (api) {
// 	api.cache(true)
// 	return {
// 		presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
// 		plugins: [
// 			// Required for expo-router
// 			// 'expo-router/babel',
// 			'react-native-reanimated/plugin',
// 		],
// 	}
// }
module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		// plugins: ['nativewind/babel'],
	}
}
// module.exports = {
// 	plugins: [
// 		['@babel/plugin-syntax-import-attributes', { deprecatedAssertSyntax: true }],
// 		'@babel/plugin-transform-export-namespace-from',
// 	],
// 	presets: ['module:@react-native/babel-preset'],
// }
// module.exports = function (api) {
// 	api.cache(true)
// 	return {
// 		plugins: [
// 			['@babel/plugin-syntax-import-attributes', { deprecatedAssertSyntax: true }],
// 			'@babel/plugin-transform-export-namespace-from',
// 		],
// 		presets: ['module:metro-react-native-babel-preset'],
// 	}
// }
