import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { screenPadding } from '@/constants/tokens'
import { getPlaylistTracks } from '@/hooks/useInnertube'
import { usePlaylists } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

const PlaylistScreen = () => {
	const { id } = useLocalSearchParams<{ id: string }>()

	const { playlists } = usePlaylists()

	const [playlistData, setPlaylistData] = useState<any>()

	// const playlist = playlists.find((playlist) => playlist.name === playlistName)

	// if (!playlist) {
	// 	console.warn(`Playlist ${playlistName} was not found!`)

	// 	return <Redirect href={'/(tabs)/playlists'} />
	// }

	useEffect(() => {
		const fetchData = async () => {
			const ytList = await getPlaylistTracks(id as string)
			console.log(ytList)
			if (ytList) {
				setPlaylistData(ytList)
				console.log(ytList)
			}
		}
		fetchData()
	}, [id])

	// if (!playlistData) {
	// 	console.warn(`Playlist ${name} was not found!`)

	// 	return <Redirect href={'/(tabs)/home'} />
	// }

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				<PlaylistTracksList
					playlist={{
						...playlistData,
						name: playlistData?.info?.title,
						artworkPreview: playlistData?.info?.thumbnails?.[0]?.url,
						tracks:
							playlistData?.tracks?.map((track: any) => ({
								title: track?.title?.text,
								artist: track?.author?.name || 'Unknown',
								artwork: 'https://i.ytimg.com/vi/' + track?.id + '/hqdefault.jpg',
								url: track?.id,
							})) || [],
					}}
					platform="Youtube"
				/>
				{/* <YoutubeTracksList id={id as string} 
					tracks={playlistData.tracks?.map((track: any) =>({
						title: track?.title?.text,
						artist: track?.author?.name || 'Unknown',
						artwork: 'https://i.ytimg.com/vi/' + track?.id + '/hqdefault.jpg',
						url: track?.id,
					}))}
				/> */}
			</ScrollView>
		</View>
	)
}

export default PlaylistScreen
