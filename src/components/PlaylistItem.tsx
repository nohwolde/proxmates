import { fontSize } from '@/constants/tokens'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'

interface PlaylistItemProps {
	data: any
	image: string
	onClick: (id: string) => void
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ data, image, onClick }) => {
	return (
		<View>
			<TouchableOpacity style={styles.container} onPress={() => onClick(data.id)}>
				<View style={styles.imageContainer}>
					{/* <Image source={{ uri: image }} style={styles.image} /> */}
					<FastImage source={{ uri: image }} style={styles.image} />
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
					}}
				>
					<View style={{ ...styles.textContainer }}>
						<Text style={styles.title} numberOfLines={1}>
							{data.title}
						</Text>
						<Text style={styles.artist} numberOfLines={1}>
							{data.artist}
						</Text>
					</View>
				</View>
				{/* <View style={styles.playButtonContainer}>
					<PlayButton />
				</View> */}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		overflow: 'hidden',
		padding: 10,
	},
	imageContainer: {
		aspectRatio: 1,
		width: 150,
		borderRadius: 10,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	textContainer: {
		alignItems: 'flex-start',
		width: 150,
		paddingBottom: 20,
		paddingTop: 10,
		color: '#FFFFFF',
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	title: {
		fontWeight: 'bold',
		// width: '100%',
		color: '#FFFFFF',
	},
	artist: {
		color: '#808080',
		fontSize: 12,
		width: '100%',
	},
	playButtonContainer: {
		position: 'absolute',
		bottom: 24,
		right: 5,
	},
})

export default PlaylistItem
