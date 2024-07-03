import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'

import { YoutubeTracksList } from '@/components/YoutubeTracksList'
import { getBasicInfo, getPlaylistTracks, search as searchYoutube } from '@/hooks/useInnertube'

const SearchScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const [topTracks, setTopTracks] = useState({ tracks: [] })

	const [searchResults, setSearchResults] = useState([])
	const [searchObject, setSearchObject] = useState({})

	useEffect(() => {
		const fetchData = async () => {
			const ytList = await getPlaylistTracks('PL4fGSI1pDJn6O1LS0XSdF3RyO0Rq_LDeI')
			console.log(ytList)
			setTopTracks(ytList)
		}
		fetchData()
	}, [])

	useEffect(() => {
		const youtubeSearch = async () => {
			await searchYoutube(search, 'video').then(async (res) => {
				console.log(res?.results)
				setSearchResults(res?.results.filter((track) => track?.type === 'Video'))
				// await getBasicInfo(res?.results[0]?.id).then((res) => {
				// 	console.log(res?.streaming_data?.hls_manifest_url)
				// })
				// setSearchObject(res)
			})
		}

		if (search !== '') {
			youtubeSearch()
		}
	}, [search])

	const tracks = useTracks()

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	const getHLS = async (id: string) => {
		const hls = await getBasicInfo(id).then((res) => res?.streaming_data?.hls_manifest_url)
		console.log(hls)

		return hls
	}

	const getTracksWithHLS = async () => {
		const tracksWithHLS = await Promise.all(
			searchResults.map(async (track) => {
				const hls = await getHLS(track?.id)
				return { ...track, hls }
			}),
		)
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				{searchResults.length == 0 && (
					<View>
						{/* <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
							Top 10 Tracks
						</Text>

						{topTracks.tracks.map((track) => (
							<VideoItem key={track?.id} data={track} />
						))} */}

						<YoutubeTracksList
							id={generateTracksListId('search', search)}
							tracks={topTracks.tracks.map((track) => ({
								title: track?.title?.text,
								artist: track?.author?.name || 'Unknown',
								artwork: 'https://i.ytimg.com/vi/' + track?.id + '/hqdefault.jpg',
								url: track?.id,
							}))}
							scrollEnabled={false}
						/>
					</View>
				)}
				{searchResults.length > 0 && (
					<YoutubeTracksList
						id={generateTracksListId('search', search)}
						tracks={searchResults.map((track) => ({
							title: track?.title?.text,
							artist: track?.author?.name || 'Unknown',
							artwork: 'https://i.ytimg.com/vi/' + track?.id + '/hqdefault.jpg',
							url: track?.id,
						}))}
						scrollEnabled={false}
					/>
				)}
				{/* <TracksList
					id={generateTracksListId('search', search)}
					tracks={filteredTracks}
					scrollEnabled={false}
				/> */}
			</ScrollView>
		</View>
	)
}

export default SearchScreen
