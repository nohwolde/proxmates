import { colors, fontSize } from '@/constants/tokens'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

const TabsNavigation = () => {
	const router = useRouter()
	return (
		<>
			<Tabs
				backBehavior="initialRoute"
				screenOptions={{
					tabBarActiveTintColor: colors.primary,
					tabBarLabelStyle: {
						fontSize: fontSize.xs,
						fontWeight: '500',
					},
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 8,
					},
					tabBarBackground: () => (
						<BlurView
							intensity={95}
							style={{
								...StyleSheet.absoluteFillObject,
								overflow: 'hidden',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								backgroundColor: 'black',
							}}
						/>
					),
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
					}}
				/>

				<Tabs.Screen
					name="account"
					options={{
						title: 'Account',
						tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
					}}
				/>
			</Tabs>
		</>
	)
}

export default TabsNavigation
