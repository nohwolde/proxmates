import type { ExpoConfig } from '@expo/config'

// if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
// 	throw new Error('Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file')
// }

const defineConfig = (): ExpoConfig => ({
	name: 'audyos',
	slug: 'audyos',
	scheme: 'expo',
	version: '1.0.0',
	orientation: 'portrait',
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
		bundleIdentifier: 'com.music.player',
		supportsTablet: true,
		usesAppleSignIn: true,
	},
	experiments: {
		tsconfigPaths: true,
		typedRoutes: true,
	},
	extra: {
		eas: {
			projectId: '7dc3c550-2e3f-4fcf-ae2d-898f84f0f1cc',
		},
	},
	plugins: ['expo-apple-authentication', 'expo-video', 'expo-router'],
	owner: 'nohwolde',
})

export default defineConfig
