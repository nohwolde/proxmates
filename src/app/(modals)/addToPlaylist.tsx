import { screenPadding } from '@/constants/tokens'
import { supabase } from '@/helpers/supabase'
import { defaultStyles } from '@/styles'
import { useHeaderHeight } from '@react-navigation/elements'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const AddToPlaylistModal = () => {
	const router = useRouter()
	const headerHeight = useHeaderHeight()

	const [session, setSession] = useState<Session | null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	// track was not found
	return <SafeAreaView style={[styles.modalContainer, { paddingTop: headerHeight }]}></SafeAreaView>
}

const styles = StyleSheet.create({
	modalContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
	},
})

export default AddToPlaylistModal
