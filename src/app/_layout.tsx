import { colors } from '@/constants/tokens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { supabase } from '@/helpers/supabase'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import OnboardingScreen from './(tabs)/onboarding/index'

SplashScreen.preventAutoHideAsync()

import '../../global.css'

const App = () => {
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<Boolean | null>(null)

	// AsyncStorage.setItem('hasCompletedOnboarding', 'false', () => {})

	useEffect(() => {
		const checkOnboardingStatus = async () => {
			// await AsyncStorage.setItem('hasCompletedOnboarding', 'false', () => {})
			const status = await AsyncStorage.getItem('hasCompletedOnboarding')
			setHasCompletedOnboarding('true' === status)
		}

		checkOnboardingStatus()
	}, [AsyncStorage.getItem('hasCompletedOnboarding')])

	SplashScreen.hideAsync()

	return (
		<SessionContextProvider supabaseClient={supabase}>
			<SafeAreaProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					{hasCompletedOnboarding ? <RootNavigation /> : <OnboardingScreen />}
					<StatusBar style="auto" />
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</SessionContextProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="(modals)/addToPlaylist"
				options={{
					presentation: 'modal',
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTitle: 'Add to playlist',
					headerTitleStyle: {
						color: colors.text,
					},
				}}
			/>
		</Stack>
	)
}

export default App
