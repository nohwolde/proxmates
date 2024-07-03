import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ChannelItemProps {
	data: any
	onClick: (id: string) => void
}

const ChannelItem: React.FC<ChannelItemProps> = ({ data, onClick }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={() => onClick(data.id)}>
			<View style={styles.imageContainer}>
				<Image
					style={styles.image}
					source={{
						uri: data.author?.thumbnails[0].url.startsWith('https:')
							? data.author?.thumbnails[0].url
							: 'https:' + data.author?.thumbnails[0].url,
					}}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.title} numberOfLines={1}>
					{data?.author?.name}
				</Text>
				<Text style={styles.subscribers} numberOfLines={1}>
					{data?.subscribers.text}
				</Text>
			</View>
		</TouchableOpacity>
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
		width: '100%',
		aspectRatio: 16 / 9,
		borderRadius: 50,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	textContainer: {
		alignItems: 'center',
		width: '100%',
		paddingTop: 10,
	},
	title: {
		fontWeight: 'bold',
		width: '100%',
		textAlign: 'center',
	},
	subscribers: {
		color: '#808080',
		fontSize: 12,
		width: '100%',
		textAlign: 'center',
	},
})

export default ChannelItem
