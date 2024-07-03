import ChannelContent from '@/components/ChannelContent'
import { Playlist } from '@/helpers/types'
import { getChannel } from '@/hooks/useInnertube'
import { usePlaylists } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

import LoaderKit from 'react-native-loader-kit'

const HomeScreen = () => {
	const router = useRouter()

	const [channelData, setChannelData] = useState<any>()

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getFeed = async () => {
			setLoading(true)
			// const homeFeed = await getHomeFeed()
			// console.log(homeFeed)
			const id = 'UC-9-kyTW8ZkZNDHQJ6FgpwQ'
			const channel = await getChannel(id as string)
			console.log(channel)
			setChannelData(channel)
			console.log(
				channel?.current_tab.content.contents.filter(
					(shelf: any) =>
						shelf.contents[0].type === 'Shelf' || shelf.contents[0].type === 'ChannelVideoPlayer',
				),
			)
		}
		getFeed()
		setLoading(false)
	}, [])

	// const search = useNavigationSearch({
	// 	searchBarOptions: {
	// 		placeholder: 'Find in playlists',
	// 	},
	// })

	const { playlists } = usePlaylists()

	// const filteredPlaylists = useMemo(() => {
	// 	return playlists.filter(playlistNameFilter(search))
	// }, [playlists, search])

	const handlePlaylistPress = (playlist: Playlist) => {
		router.push(`/(tabs)/playlists/${playlist.name}`)
	}

	if (loading) {
		return (
			<View style={defaultStyles.container}>
				<LoaderKit style={{ width: 50, height: 50 }} name={'Pacman'} color={'#1CAFF6'} />
			</View>
		)
	}

	return (
		<View style={{ ...defaultStyles.container, paddingBottom: 128 }}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				// style={{
				// 	paddingHorizontal: screenPadding.horizontal,
				// }}
			>
				{/* <PlaylistsList
					scrollEnabled={false}
					playlists={playlists}
					onPlaylistPress={handlePlaylistPress}
				/> */}
				<>
					{channelData && (
						<ChannelContent
							contents={channelData?.current_tab.content.contents.filter(
								(shelf: any) =>
									shelf.contents[0].type === 'Shelf' ||
									shelf.contents[0].type === 'ChannelVideoPlayer',
							)}
						/>
					)}
				</>
			</ScrollView>
		</View>
	)
}

export default HomeScreen
