import { utilsStyles } from '@/styles'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import ChannelItem from './ChannelItem'
import PlaylistItem from './PlaylistItem'
import VideoItem from './VideoItem'

interface ChannelContentProps {
	contents: any[]
}

const ChannelContent: React.FC<ChannelContentProps> = ({ contents }) => {
	const navigation = useNavigation()

	const router = useRouter()

	const shelf = (shelf: any) => (
		<View style={{ marginBottom: 10 }}>
			<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{shelf.title?.text}</Text>
			<View style={{ flexDirection: 'row', marginTop: 10 }}>
				<ScrollView
					horizontal={true}
					contentInsetAdjustmentBehavior="automatic"
					style={{ scaleX: -1 }}
					showsHorizontalScrollIndicator={false}
				>
					{shelf.content.items.map((item: any) => {
						if (item.type === 'GridVideo') {
							return (
								<View style={{ scaleX: -1 }}>
									<TouchableOpacity
										key={item.author.id}
										// onPress={() => navigation.navigate(`/watch/${item.id}`)}
									>
										<VideoItem key={item.id} data={item} />
									</TouchableOpacity>
								</View>
							)
						} else if (item.type === 'GridChannel') {
							return (
								<View style={{ scaleX: -1 }}>
									<TouchableOpacity
										key={item.author.id}
										// 	onPress={() => navigation.navigate(`/channel/${item.author.id}`)
										// }
									>
										<ChannelItem data={item} onClick={() => {}} />
									</TouchableOpacity>
								</View>
							)
						} else if (item.type === 'CompactStation') {
							return (
								<View style={{ scaleX: -1 }}>
									<TouchableOpacity
										key={item.endpoint.payload.playlistId}
										onPress={() => router.push(`/(tabs)/home/${item.endpoint.payload.playlistId}`)}
									>
										<PlaylistItem
											data={{ title: item.title.text, artist: 'Youtube Music' }}
											image={item.thumbnail[item.thumbnail.length - 1].url}
											onClick={() =>
												router.push(`/(tabs)/home/${item.endpoint.payload.playlistId}`)
											}
										/>
									</TouchableOpacity>
								</View>
							)
						}
					})}
				</ScrollView>
			</View>
			<View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
		</View>
	)

	return (
		<View style={{ marginTop: 10, marginBottom: 20, paddingHorizontal: 15 }}>
			{contents.map((content) => {
				if (
					content.contents[0]?.type === 'Shelf' &&
					content.contents[0]?.content?.items.length > 0
				) {
					return shelf(content.contents[0])
				}
			})}
		</View>
	)
}

export default ChannelContent
