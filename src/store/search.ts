'use client'
import { create } from 'zustand'

interface SearchState {
	artistData: { name: string; id: string }
	setArtistData: (artistData: { name: string; id: string }) => void
}

const useSearchStore = create<SearchState>((set, get) => ({
	artistData: { name: '', id: '' },
	setArtistData: (artistData) => set({ artistData }),
}))

export default useSearchStore
