
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'



const OnboardingScreenLayout = () => {
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: '',
						headerBackVisible: false,
						headerTransparent: true,
						statusBarColor: 'transparent',
						
						// statusBarHidden: true,
						// tabBarStyle: {
						// 	display: "none",
						// },
						// tabBarButton: () => null,
					}}
				/>
			</Stack>
			
			{/* <OnboardingScreen /> */}
		</View>
	)
}

export default OnboardingScreenLayout
