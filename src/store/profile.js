'use client'
import { create } from 'zustand'
// import { persist, createJSONStorage } from "zustand/middleware";

const useProfileStore = create((set, get) => ({
	scProfile: null,
	setScProfile: (profile) => set({ scProfile: profile }),
	spotProfile: null,
	setSpotProfile: (profile) => set({ spotProfile: profile }),
	ytProfile: null,
	setYtProfile: (profile) => set({ ytProfile: profile }),
	scPlaylists: [],
	setScPlaylists: (playlists) => set({ scPlaylists: playlists }),
	addScPlaylist: (playlist) => set({ scPlaylists: [...get().scPlaylists, playlist] }),
	getScPlaylist: (id) => get().scPlaylists.find((playlist) => playlist.id === id),
	updateScPlaylist: (playlistId, songs) => {
		const playlist = get().scPlaylists.find((playlist) => playlist.id === playlistId)
		const index = get().scPlaylists.indexOf(playlist)
		const updatedPlaylist = { ...playlist, songs: songs }
		const updatedPlaylists = get().scPlaylists
		updatedPlaylists[index] = updatedPlaylist
		set({ scPlaylists: updatedPlaylists })
	},
	spotPlaylists: [],
	setSpotPlaylists: (playlists) => set({ spotPlaylists: playlists }),
	addSpotPlaylist: (playlist) => set({ spotPlaylists: [...get().spotPlaylists, playlist] }),
	getSpotPlaylist: (id) => get().spotPlaylists.find((playlist) => playlist.id === id),
	updateSpotPlaylist: (playlistId, songs) => {
		const playlist = get().spotPlaylists.find((playlist) => playlist.id === playlistId)
		const index = get().spotPlaylists.indexOf(playlist)
		const updatedPlaylist = { ...playlist, songs: songs }
		const updatedPlaylists = get().spotPlaylists
		updatedPlaylists[index] = updatedPlaylist
		set({ spotPlaylists: updatedPlaylists })
	},
	ytPlaylists: [],
	setYtPlaylists: (playlists) => set({ ytPlaylists: playlists }),
	addYtPlaylist: (playlist) => set({ ytPlaylists: [...get().ytPlaylists, playlist] }),
	getYtPlaylist: (id) => get().ytPlaylists.find((playlist) => playlist.id === id),
	updateYtPlaylist: (playlistId, songs) => {
		const playlist = get().ytPlaylists.find((playlist) => playlist.id === playlistId)
		const index = get().ytPlaylists.indexOf(playlist)
		const updatedPlaylist = { ...playlist, songs: songs }
		const updatedPlaylists = get().ytPlaylists
		updatedPlaylists[index] = updatedPlaylist
		set({ ytPlaylists: updatedPlaylists })
	},
}))

export default useProfileStore
