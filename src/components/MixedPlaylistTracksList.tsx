import { TracksListItem } from '@/components/TracksListItem'
import { unknownTrackImageUri } from '@/constants/images'
import { getBasicInfo } from '@/hooks/useInnertube'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useRef, useState } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track } from 'react-native-track-player'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const MixedPlaylistTracksList = ({
	id,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const { activeQueueId, setActiveQueueId } = useQueue()

	const [remainingTracks, setRemainingTracks] = useState<any>({ before: [], after: [] })

	const getHLS = async (id: string) => {
		const hls = await getBasicInfo(id).then((res) => res?.streaming_data?.hls_manifest_url)
		// console.log(hls)

		return hls
	}

	const handleTrackSelect = async (selectedTrack: Track) => {
		const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

		if (trackIndex === -1) return

		const isChangingQueue = id !== activeQueueId

		if (isChangingQueue) {
			await TrackPlayer.reset()

			const hls = await getHLS(selectedTrack?.url)

			// we construct the new queue
			await TrackPlayer.add({ ...selectedTrack, url: hls, hlsGrabbed: true })
			// await TrackPlayer.play()

			const beforeTracks = tracks.slice(0, trackIndex)

			const afterTracks = tracks.slice(trackIndex + 1)

			const afterTracksWithHLS = await Promise.all(
				afterTracks.map(async (track) => {
					const hls = await getHLS(track?.url)
					return { ...track, url: hls }
				}),
			)

			const beforeTracksWithHLS = await Promise.all(
				beforeTracks.map(async (track) => {
					const hls = await getHLS(track?.url)
					return { ...track, url: hls }
				}),
			)

			// const nextTrack = tracks[trackIndex + 1]
			// if (nextTrack) {
			// 	const nextHls = await getHLS(nextTrack?.url)
			// 	await TrackPlayer.add({ ...nextTrack, url: nextHls })
			// }

			// // add remaining tracks to the player
			// addRemainingTracksToPlayer(afterTracks)

			// // do the same with the before tracks
			// addRemainingTracksToPlayer(beforeTra cks)

			// setRemainingTracks({ before: beforeTracks, after: afterTracks })

			await TrackPlayer.add(afterTracksWithHLS)

			await TrackPlayer.add(beforeTracksWithHLS)

			await TrackPlayer.play()

			queueOffset.current = trackIndex
			setActiveQueueId(id)
		} else {
			const nextTrackIndex =
				trackIndex - queueOffset.current < 0
					? tracks.length + trackIndex - queueOffset.current
					: trackIndex - queueOffset.current

			await TrackPlayer.skip(nextTrackIndex)
			TrackPlayer.play()
		}
	}

	const addRemainingTracksToPlayer = async (tracks: Track[]) => {
		for (const track of tracks) {
			const hls = await getHLS(track?.url)
			await TrackPlayer.add({ ...track, url: hls, hlsGrabbed: true })
		}
	}

	// TrackPlayer.addEventListener('playback-track-changed', async (data: { nextTrack: string }) => {
	// 	const { nextTrack } = data

	// 	// Check if the next track's HLS URL is already fetched
	// 	const nextTrackDetails = remainingTracks.after[0]

	// 	console.log('updating hls for next track', nextTrack)

	// 	if (nextTrackDetails && nextTrackDetails.id === nextTrack) {
	// 		// Fetch the HLS URL and add it to the player
	// 		const hls = await getHLS(nextTrackDetails?.url)
	// 		await TrackPlayer.add({ ...nextTrackDetails, url: hls })

	// 		// Remove the track from the remaining tracks
	// 		setRemainingTracks({
	// 			before: [...remainingTracks.before, nextTrackDetails],
	// 			after: remainingTracks.after.slice(1),
	// 		})
	// 	}
	// })

	return (
		<FlatList
			data={tracks}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No songs found</Text>

					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			renderItem={({ item: track }) => (
				<TracksListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
			{...flatlistProps}
		/>
	)
}
