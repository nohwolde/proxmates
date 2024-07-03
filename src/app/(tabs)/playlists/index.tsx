import { PlaylistsList } from '@/components/PlaylistsList'
import { screenPadding } from '@/constants/tokens'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { usePlaylists } from '@/store/library'
import useProfileStore from '@/store/profile'
import { defaultStyles } from '@/styles'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, View } from 'react-native'

const PlaylistsScreen = () => {
	const router = useRouter()

	const { spotPlaylists, ytPlaylists, scPlaylists, spotProfile, scProfile, ytProfile } =
		useProfileStore()

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in playlists',
		},
	})

	const { playlists } = usePlaylists()

	const filteredPlaylists = useMemo(() => {
		return playlists.filter(playlistNameFilter(search))
	}, [playlists, search])

	const handlePlaylistPress = (playlist: Playlist) => {
		if (playlist.platform === 'Spotify') router.push(`/(tabs)/playlists/spot/${playlist.id}`)
		if (playlist.platform === 'Youtube') router.push(`/(tabs)/playlists/yt/${playlist.id}`)
		if (playlist.platform === 'Soundcloud') router.push(`/(tabs)/playlists/sc/${playlist.id}`)
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{
					paddingHorizontal: screenPadding.horizontal,
				}}
			>
				{/* <PlaylistsList
					scrollEnabled={false}
					playlists={filteredPlaylists}
					onPlaylistPress={handlePlaylistPress}
				/> */}
				<PlaylistsList
					scrollEnabled={false}
					playlists={[
						...spotPlaylists.map((playlist: any) => ({
							...playlist,
							id: playlist.id,
							artworkPreview: playlist.image,
						})),
						...ytPlaylists.map((playlist: any) => ({
							...playlist,
							id: playlist.id,
							artworkPreview: playlist.image,
						})),
						...scPlaylists.map((playlist: any) => ({
							...playlist,
							id: playlist.id,
							artworkPreview: playlist.image,
						})),
					]}
					onPlaylistPress={handlePlaylistPress}
				/>
			</ScrollView>
		</View>
	)
}

export default PlaylistsScreen
