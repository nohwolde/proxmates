import { fontSize } from '@/constants/tokens'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface VideoItemProps {
	data: any
}

const VideoItem: React.FC<VideoItemProps> = ({ data }) => {
	const navigation = useNavigation()
	// const { setCurrentTrack } = usePlayerStore();

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => {
				console.log('Playing Now')
				// setCurrentTrack({ ...data, platform: 'Youtube' });
				// navigation.navigate(`/watch/${data.id}`);
			}}
		>
			<View style={styles.imageContainer}>
				<Image
					style={styles.image}
					source={{
						uri: `https://img.youtube.com/vi/${data.id}/hqdefault.jpg`,
					}}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.title} numberOfLines={1}>
					{data?.title?.text}
				</Text>
				<Text
					style={styles.author}
					numberOfLines={1}
					onPress={(e) => {
						e.stopPropagation()
						// navigation.navigate(`/channel/${data?.author?.id}`);
					}}
				>
					{data?.author?.name}
				</Text>
				<Text style={styles.details} numberOfLines={1}>
					{data?.short_view_count?.text} • {data?.published?.text}
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
		width: 250,
		aspectRatio: 4 / 3,
		// borderRadius: 10,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	textContainer: {
		alignItems: 'flex-start',
		width: 250,
		paddingBottom: 20,
		color: '#FFFFFF',
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	title: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		width: '100%',
	},
	author: {
		color: '#808080',
		fontSize: 12,
		width: '100%',
	},
	details: {
		color: '#808080',
		fontSize: 12,
		width: '100%',
	},
})

export default VideoItem
