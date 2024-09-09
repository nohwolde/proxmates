import { defaultStyles } from '@/styles'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import LoaderKit from 'react-native-loader-kit'

const HomeScreen = () => {
	const [loading, setLoading] = useState(true)

	if (loading) {
		return (
			<View style={defaultStyles.container}>
				<LoaderKit style={{ width: 50, height: 50 }} name={'Pacman'} color={'#1CAFF6'} />
			</View>
		)
	}

	return (
		<View style={{ ...defaultStyles.container }}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={
					{
						// paddingHorizontal: screenPadding.horizontal,
						// paddingBottom: 128,
					}
				}
			></ScrollView>
		</View>
	)
}

export default HomeScreen
