import { supabase } from '@/helpers/supabase'
import { Session } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import useProfileStore from '@/store/profile'

// const AccountScreen = () => {
// 	const router = useRouter()
// 	const [user, setUser] = useState(null)

// 	const {
// 		spotProfile,
// 		setSpotProfile,
// 		spotPlaylists,
// 		setSpotPlaylists,
// 		addSpotPlaylist,
// 		updateSpotPlaylist,
// 		setYtPlaylists,
// 		updateYtPlaylist,
// 		setYtProfile,
// 		updateScPlaylist,
// 		setScPlaylists,
// 		setScProfile,
// 	} = useProfileStore()

// 	const [session, setSession] = useState<Session | null>(null)

// 	useEffect(() => {
// 		supabase.auth.getSession().then(({ data: { session } }) => {
// 			setSession(session)
// 		})

// 		supabase.auth.onAuthStateChange((_event, session) => {
// 			setSession(session)
// 		})
// 	}, [])

// 	useEffect(() => {
// 		if (session) {
// 			// get all profiles for this user

// 			const fetchProfiles = async () => {
// 				const { data: profiles, error } = await supabase
// 					.from('profiles')
// 					.select('*')
// 					.eq('user_id', session?.user?.id)

// 				if (error) {
// 					console.error('Error getting profiles:', error)
// 					return
// 				} else {
// 					console.log('Profiles', profiles)
// 					// set all profiles based on platform

// 					profiles.map((prof: any) => {
// 						if (prof.platform === 'Soundcloud') {
// 							setScProfile(prof)
// 						} else if (prof.platform === 'Youtube') {
// 							setYtProfile(prof)
// 						} else if (prof.platform === 'Spotify') {
// 							setSpotProfile(prof)
// 						}
// 					})
// 				}

// 				console.log('Profiles', profiles)
// 			}

// 			fetchProfiles()
// 		}
// 	}, [session])

// 	useEffect(() => {
// 		console.log(session)

// 		const fetchPlaylists = async () => {
// 			if (session) {
// 				// const { data: playlists, error } = await getSongsInUserPlaylists(
// 				//   session?.user?.id
// 				// );
// 				// console.log(playlists);
// 				// if (error) {
// 				//   console.error("Error fetching user playlists:", error);
// 				//   return;
// 				// }

// 				// Fetch all playlists for the user
// 				const { data: playlists, error: playlistsError } = await supabase
// 					.from('playlists')
// 					.select('*')
// 					.eq('user_id', session?.user?.id)

// 				if (playlistsError) {
// 					console.error('Error fetching user playlists:', playlistsError)
// 					return
// 				}

// 				setSpotPlaylists(playlists.filter((playlist) => playlist.platform === 'Spotify'))

// 				setYtPlaylists(playlists.filter((playlist) => playlist.platform === 'Youtube'))

// 				setScPlaylists(playlists.filter((playlist) => playlist.platform === 'Soundcloud'))

// 				const songs = []

// 				for (const playlist of playlists) {
// 					const playlistSongs = await getSongsInPlaylist(playlist.id)
// 					songs.push(playlistSongs)
// 					if (playlist.platform === 'Spotify') {
// 						updateSpotPlaylist(playlist.id, playlistSongs)
// 					} else if (playlist.platform === 'Youtube') {
// 						updateYtPlaylist(playlist.id, playlistSongs)
// 					} else if (playlist.platform === 'Soundcloud') {
// 						updateScPlaylist(playlist.id, playlistSongs)
// 					}
// 				}
// 			}
// 		}

// 		fetchPlaylists()
// 	}, [session])

// 	async function getSongsInPlaylist(playlistId: string) {
// 		try {
// 			const { data: playlistSongs, error: playlistSongsError } = await supabase
// 				.from('playlists_songs')
// 				.select('song_id, song_order, yt') // Include 'yt' in the select
// 				.eq('playlistId', playlistId)
// 				.order('song_order', { ascending: true })

// 			if (playlistSongsError) {
// 				console.error('Error fetching songs in playlist:', playlistSongsError)
// 				return
// 			}

// 			const songIds = playlistSongs.map((song) => song.song_id)

// 			const { data: songs, error: songsError } = await supabase
// 				.from('songs')
// 				.select('*')
// 				.in('id', songIds)

// 			if (songsError) {
// 				console.error('Error fetching song details:', songsError)
// 				return
// 			}

// 			// Add 'yt' to each song
// 			for (const song of songs) {
// 				const playlistSong = playlistSongs.find((ps) => ps.song_id === song.id)
// 				song.yt = playlistSong?.yt
// 			}

// 			songs.sort((a, b) => {
// 				const orderA = playlistSongs.find((song) => song.song_id === a.id)?.song_order
// 				const orderB = playlistSongs.find((song) => song.song_id === b.id)?.song_order
// 				return (orderA ?? 0) - (orderB ?? 0)
// 			})

// 			return songs
// 		} catch (error) {
// 			console.error('Error fetching songs in playlist:', error)
// 		}
// 	}

// 	// useEffect(() => {
// 	// 	fetchUser()
// 	// }, [])

// 	// const fetchUser = async () => {
// 	// 	const session = supabase.auth.getSession()

// 	// 	if (user) {
// 	// 		const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

// 	// 		if (error) {
// 	// 			console.error('Error fetching user', error)
// 	// 		} else {
// 	// 			setUser(data)
// 	// 		}
// 	// 	}
// 	// }

// 	if (!user) {
// 		return (
// 			<>
// 				<Auth />
// 				{session && session.user && <Text>{session.user.id}</Text>}
// 			</>
// 		)
// 	}

// 	return (
// 		<View style={styles.container}>
// 			<Text style={styles.title}>Account Information</Text>
// 			<Text style={styles.info}>Name: {user.name}</Text>
// 			<Text style={styles.info}>Email: {user.email}</Text>
// 			{/* Display more information as needed */}
// 		</View>
// 	)
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 16,
// 		backgroundColor: '#fff',
// 	},
// 	title: {
// 		fontSize: 24,
// 		fontWeight: 'bold',
// 		marginBottom: 16,
// 	},
// 	info: {
// 		fontSize: 18,
// 		marginBottom: 8,
// 	},
// })

// export default AccountScreen;

import { AntDesign } from '@expo/vector-icons'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Alert, Pressable, TextInput } from 'react-native'

export default function Profile() {
	const user = useUser()

	const {
		spotProfile,
		setSpotProfile,
		spotPlaylists,
		setSpotPlaylists,
		addSpotPlaylist,
		updateSpotPlaylist,
		setYtPlaylists,
		updateYtPlaylist,
		setYtProfile,
		updateScPlaylist,
		setScPlaylists,
		setScProfile,
	} = useProfileStore()

	const [session, setSession] = useState<Session | null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	useEffect(() => {
		if (session) {
			// get all profiles for this user

			const fetchProfiles = async () => {
				const { data: profiles, error } = await supabase
					.from('profiles')
					.select('*')
					.eq('user_id', session?.user?.id)

				if (error) {
					console.error('Error getting profiles:', error)
					return
				} else {
					console.log('Profiles', profiles)
					// set all profiles based on platform

					profiles.map((prof: any) => {
						if (prof.platform === 'Soundcloud') {
							setScProfile(prof)
						} else if (prof.platform === 'Youtube') {
							setYtProfile(prof)
						} else if (prof.platform === 'Spotify') {
							setSpotProfile(prof)
						}
					})
				}

				console.log('Profiles', profiles)
			}

			fetchProfiles()
		}
	}, [session])

	useEffect(() => {
		console.log(session)

		const fetchPlaylists = async () => {
			if (session) {
				// const { data: playlists, error } = await getSongsInUserPlaylists(
				//   session?.user?.id
				// );
				// console.log(playlists);
				// if (error) {
				//   console.error("Error fetching user playlists:", error);
				//   return;
				// }

				// Fetch all playlists for the user
				const { data: playlists, error: playlistsError } = await supabase
					.from('playlists')
					.select('*')
					.eq('user_id', session?.user?.id)

				if (playlistsError) {
					console.error('Error fetching user playlists:', playlistsError)
					return
				}

				setSpotPlaylists(playlists.filter((playlist) => playlist.platform === 'Spotify'))

				setYtPlaylists(playlists.filter((playlist) => playlist.platform === 'Youtube'))

				setScPlaylists(playlists.filter((playlist) => playlist.platform === 'Soundcloud'))

				const songs = []

				for (const playlist of playlists) {
					const playlistSongs = await getSongsInPlaylist(playlist.id)
					songs.push(playlistSongs)
					if (playlist.platform === 'Spotify') {
						updateSpotPlaylist(playlist.id, playlistSongs)
					} else if (playlist.platform === 'Youtube') {
						updateYtPlaylist(playlist.id, playlistSongs)
					} else if (playlist.platform === 'Soundcloud') {
						updateScPlaylist(playlist.id, playlistSongs)
					}
				}
			}
		}

		fetchPlaylists()
	}, [session])

	async function getSongsInPlaylist(playlistId: string) {
		try {
			const { data: playlistSongs, error: playlistSongsError } = await supabase
				.from('playlists_songs')
				.select('song_id, song_order, yt') // Include 'yt' in the select
				.eq('playlistId', playlistId)
				.order('song_order', { ascending: true })

			if (playlistSongsError) {
				console.error('Error fetching songs in playlist:', playlistSongsError)
				return
			}

			const songIds = playlistSongs.map((song) => song.song_id)

			const { data: songs, error: songsError } = await supabase
				.from('songs')
				.select('*')
				.in('id', songIds)

			if (songsError) {
				console.error('Error fetching song details:', songsError)
				return
			}

			// Add 'yt' to each song
			for (const song of songs) {
				const playlistSong = playlistSongs.find((ps) => ps.song_id === song.id)
				song.yt = playlistSong?.yt
			}

			songs.sort((a, b) => {
				const orderA = playlistSongs.find((song) => song.song_id === a.id)?.song_order
				const orderB = playlistSongs.find((song) => song.song_id === b.id)?.song_order
				return (orderA ?? 0) - (orderB ?? 0)
			})

			return songs
		} catch (error) {
			console.error('Error fetching songs in playlist:', error)
		}
	}

	return <View style={styles.container}>{user ? <SignedInView /> : <SignedOutView />}</View>
}

function SignedInView() {
	const supabase = useSupabaseClient()
	const user = useUser()

	return (
		<View style={styles.signedInContainer}>
			<Text style={styles.signedInText}>Signed in as {user?.email}</Text>
			<Pressable onPress={() => supabase.auth.signOut()} style={styles.signOutButton}>
				<Text style={styles.signOutButtonText}>Sign out</Text>
			</Pressable>
		</View>
	)
}

function SignedOutView() {
	const supabase = useSupabaseClient()

	// const signInWithApple = async () => {
	// 	try {
	// 		const { token, nonce } = await initiateAppleSignIn()
	// 		const { error } = await supabase.auth.signInWithIdToken({
	// 			provider: 'apple',
	// 			token,
	// 			nonce,
	// 		})
	// 		if (error) return Alert.alert('Error', error.message)
	// 	} catch (e) {
	// 		if (typeof e === 'object' && !!e && 'code' in e) {
	// 			if (e.code === 'ERR_REQUEST_CANCELED') {
	// 				// handle that the user canceled the sign-in flow
	// 			} else {
	// 				// handle other errors
	// 			}
	// 		} else {
	// 			console.error('Unexpected error from Apple SignIn: ', e)
	// 		}
	// 	}
	// }

	return (
		<View style={styles.signedOutContainer}>
			<Text style={styles.signInTitle}>Sign In</Text>

			{/* Email Sign In */}
			<EmailForm />

			<View style={styles.dividerContainer}>
				<Text style={styles.dividerText}>or</Text>
			</View>

			{/* Sign in with Apple */}

			{/* 
			<AppleAuthentication.AppleAuthenticationButton
				buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
				buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
				cornerRadius={8}
				onPress={signInWithApple}
				style={styles.appleAuthButton}
			/>
			*/}
		</View>
	)
}

function EmailForm() {
	const supabase = useSupabaseClient()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isSignUp, setIsSignUp] = useState(false)

	const signInWithPassword = async () => {
		const { error, data } = isSignUp
			? await supabase.auth.signUp({
					email,
					password,
				})
			: await supabase.auth.signInWithPassword({
					email,
					password,
				})
		if (error) Alert.alert('Error', error.message)
		else if (isSignUp && data.user) {
			Alert.alert('Check your email for a confirmation link.')
			setIsSignUp(false)
		}
	}

	return (
		<View style={styles.emailFormContainer}>
			<TextInput
				style={styles.input}
				placeholderTextColor="#A1A1A9" // zinc-400
				value={email}
				autoCapitalize="none"
				onChangeText={setEmail}
				placeholder="Email"
			/>
			<View style={styles.passwordContainer}>
				<TextInput
					style={styles.input}
					placeholderTextColor="#A1A1A9" // zinc-400
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					placeholder="Password"
				/>
				<Pressable style={styles.eyeIcon} onPress={() => setShowPassword((prev) => !prev)}>
					{showPassword ? (
						<AntDesign name="eye" size={24} color="#A1A1A9" />
					) : (
						<AntDesign name="eyeo" size={24} color="#A1A1A9" />
					)}
				</Pressable>
			</View>

			<Pressable style={styles.toggleSignUp} onPress={() => setIsSignUp((prev) => !prev)}>
				<Text style={styles.toggleSignUpText}>
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}
				</Text>
			</Pressable>

			<Pressable onPress={signInWithPassword} style={styles.signInButton}>
				<Text style={styles.signInButtonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1c1c1e',
		padding: 16,
	},
	signedInContainer: {
		flex: 1,
		gap: 16,
	},
	signedInText: {
		color: '#f5f5f7',
	},
	signOutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		borderRadius: 8,
		backgroundColor: '#f5f5f7',
		padding: 8,
	},
	signOutButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1c1c1e',
	},
	signedOutContainer: {
		spaceY: 16,
	},
	signInTitle: {
		marginBottom: 16,
		fontSize: 24,
		fontWeight: 'bold',
		color: '#f5f5f7',
	},
	dividerContainer: {
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f7',
		paddingVertical: 8,
	},
	dividerText: {
		position: 'absolute',
		top: '50%',
		backgroundColor: '#1c1c1e',
		paddingHorizontal: 8,
		fontSize: 16,
		color: '#f5f5f7',
	},
	appleAuthButton: {
		height: 40,
	},
	emailFormContainer: {
		flexDirection: 'column',
		gap: 16,
	},
	input: {
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.1)',
		padding: 8,
		color: '#f5f5f7',
	},
	passwordContainer: {
		position: 'relative',
		marginBottom: 8,
	},
	eyeIcon: {
		position: 'absolute',
		right: 8,
	},
	toggleSignUp: {
		height: 16,
	},
	toggleSignUpText: {
		flex: 1,
		color: '#f5f5f7',
	},
	signInButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		backgroundColor: '#34c759',
		padding: 8,
	},
	signInButtonText: {
		marginLeft: 4,
		fontSize: 16,
		fontWeight: '400',
	},
})
