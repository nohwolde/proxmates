// === START ===  Making Youtube.js work
import { decode, encode } from 'base-64'
import 'event-target-polyfill'
import 'react-native-url-polyfill/auto'
import 'text-encoding-polyfill'
import 'web-streams-polyfill'

if (!global.btoa) {
	global.btoa = encode
}

if (!global.atob) {
	global.atob = decode
}

import { MMKV } from 'react-native-mmkv'
// @ts-expect-error to avoid typings' fuss
global.mmkvStorage = MMKV as any

// See https://github.com/nodejs/node/issues/40678#issuecomment-1126944677
class CustomEvent extends Event {
	#detail

	constructor(type: string, options?: CustomEventInit<any[]>) {
		super(type, options)
		this.#detail = options?.detail ?? null
	}

	get detail() {
		return this.#detail
	}
}

global.CustomEvent = CustomEvent as any

// === END === Making Youtube.js work

import Innertube, { UniversalCache } from 'youtubei.js'

let innertube: Innertube | null = null

const setInnertube = async () => {
	innertube = await Innertube.create({
		cache: new UniversalCache(false),
		generate_session_locally: true,
	})
}

const getHomeFeed = async (): Promise<any> => {
	// We want the youtube music feed
	if (!innertube) await setInnertube()
	const homeFeed = await innertube?.music.getHomeFeed()
	return homeFeed
}

const getDash = async (id: any): Promise<any> => {
	if (!innertube) await setInnertube()
	const video = await innertube?.getInfo(id)
	const dash = await video?.toDash()
	return { video: video, dash: dash }
}

const getInnertube = async (): Promise<Innertube | undefined> => {
	if (!innertube)
		setInnertube().then(() => {
			return innertube
		})
	else return innertube
}

const search = async (
	searchTerm: string,
	searchType: 'video' | 'all' | 'channel' | 'playlist' | 'movie',
): Promise<any> => {
	if (!innertube) await setInnertube()
	const search = await innertube?.search(searchTerm, { type: searchType })

	return search
}

const getVideo = async (id: string): Promise<any> => {
	if (!innertube) await setInnertube()
	const video = await innertube?.getInfo(id)
	console.log('Items', video)
	return video
}

const getBasicInfo = async (id: string): Promise<any> => {
	if (!innertube) await setInnertube()
	const video = await innertube?.getBasicInfo(id, 'iOS')
	return video
}

const getPlaylist = async (id: string): Promise<any> => {
	if (!innertube) await setInnertube()
	const playlist = (await innertube?.getPlaylist(id))?.videos
	return playlist
}

const getPlaylistTracks = async (id: string): Promise<any> => {
	if (!innertube) await setInnertube()
	const playlistTracks = (await innertube?.getPlaylist(id))?.videos
	const playlistInfo = await innertube?.getPlaylist(id)
	console.log('Playlist', playlistTracks)
	return { tracks: playlistTracks, ...playlistInfo }
}

const getThumbnail = async (
	id: string,
	resolution: string,
	backupThumbnail: Array<any>,
): Promise<any> => {
	if (resolution == 'max') {
		const url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
		const response = await fetch(url)
		const buffer = await response.arrayBuffer()
		const image = await Jimp.read(Buffer.from(buffer))
		if (image.bitmap.height !== 120) return url
	}
	if (backupThumbnail[backupThumbnail.length - 1])
		return backupThumbnail[backupThumbnail.length - 1].url
	else return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

const getChannel = async (id: string): Promise<any> => {
	if (!innertube) await setInnertube()
	const channel = await innertube?.getChannel(id)
	return channel
}

const getRecommended = async (): Promise<any> => {
	if (!innertube) await setInnertube()
	const recommended = await innertube?.getHomeFeed()
	return recommended
}

export {
	getBasicInfo,
	getChannel,
	getDash,
	getHomeFeed,
	getInnertube,
	getPlaylist,
	getPlaylistTracks,
	getRecommended,
	getThumbnail,
	getVideo,
	search,
}

export default innertube
