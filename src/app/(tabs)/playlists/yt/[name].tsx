import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { screenPadding } from '@/constants/tokens'
import { usePlaylists } from '@/store/library'
import useProfileStore from '@/store/profile'
import { defaultStyles } from '@/styles'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

const PlaylistScreen = () => {
	const { name: playlistName } = useLocalSearchParams<{ name: string }>()

	const [playlistData, setPlaylistData] = useState<any>(null)

	const {
		spotPlaylists,
		ytPlaylists,
		scPlaylists,
		spotProfile,
		scProfile,
		ytProfile,
		getYtPlaylist,
	} = useProfileStore()

	const { playlists } = usePlaylists()

	const playlist = playlists.find((playlist) => playlist.name === playlistName)

	useEffect(() => {
		const pData = getYtPlaylist(playlistName as string)
		console.log(pData)
		setPlaylistData(pData)
	}, [playlistName])

	const returnSongMetadata = (song: any) => {
		if (song.platform === 'Spotify') {
			return {
				title: song.yt?.name,
				artist: song.yt?.author.name,
				artwork: song.yt?.image,
				url: song.yt?.id,
				id: song.yt?.id,
				// author: song.yt?.author,
				// thumbnails: [{ url: song.yt?.image }],
				// platform: 'Youtube',
			}
		} else if (song.platform === 'Youtube') {
			return {
				title: song?.name,
				artist: song?.author.name,
				artwork: song?.image,
				url: song?.id,
				id: song?.id,
				// author: song?.author,
				// thumbnails: [{ url: song?.image }],
				// platform: 'Youtube',
			}
		} else if (song.platform === 'Soundcloud') {
			return {
				title: song.name,
				artist: song.author.name,
				artwork: song.image,
				url: song.id,
				id: song.id,
				// user: [song.author],
				// href: song.id,
				// artwork_url: song.image,
				// isExplicit: song.isExplicit || false,
				// platform: 'Soundcloud',
				// track_authorization: song.media?.track_authorization,
				// media: song.media,
			}
		}
	}

	if (!playlistData) {
		console.warn(`Playlist ${playlistName} was not found!`)

		return <Redirect href={'/(tabs)/playlists'} />
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				<PlaylistTracksList
					playlist={{
						artworkPreview: playlistData?.image,
						name: playlistData?.name,
						// tracks: [],
						tracks: playlistData?.songs.map((song: any) => {
							return song.platform === 'Spotify'
								? {
										title: song?.name,
										artist: song?.author.name,
										artwork: song?.image,
										url: song?.id,
										id: song?.id,
									}
								: song.platform === 'Youtube'
									? {
											title: song?.name,
											artist: song?.author.name,
											artwork: song?.image,
											url: song?.id,
											id: song?.id,
										}
									: {
											title: song.name,
											artist: song.author.name,
											artwork: song.image,
											url: song.id,
											id: song.id,
										}
						}),
						// tracks: [playlistData?.songs.map((song: any) => returnSongMetadata(song))],
					}}
					platform="Mixed"
				/>
			</ScrollView>
		</View>
	)
}

export default PlaylistScreen
