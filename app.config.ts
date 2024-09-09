import type { ExpoConfig } from '@expo/config'

// if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
// 	throw new Error('Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file')
// }

const defineConfig = (): ExpoConfig => ({
	name: 'proxmate',
	slug: 'proxmate',
	scheme: 'expo',
	version: '1.0.0',
	orientation: 'default',
	icon: './assets/icon.png',
	userInterfaceStyle: 'dark',
	splash: {
		image: './assets/icon.png',
		resizeMode: 'contain',
		backgroundColor: '#18181A',
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		bundleIdentifier: 'com.proxmate.app',
		supportsTablet: true,
		usesAppleSignIn: true,
	},
	experiments: {
		tsconfigPaths: true,
		typedRoutes: true,
	},
	extra: {
		eas: {
			projectId: 'dc912c96-9df5-4bfc-9b7b-bb131f79a4bd',
		},
	},
	plugins: [
		'expo-apple-authentication',
		'expo-router',
		'expo-sensors',
		[
			'@react-native-google-signin/google-signin',
			{
				iosUrlScheme: 'com.googleusercontent.apps.1074973696209-b83j1358l1rkpn9b82jiak0a5q366emb',
			},
		],
		[
			'expo-screen-orientation',
			{
				initialOrientation: 'ALL',
			},
		],
	],
	owner: 'nohwolde',
})

export default defineConfig
