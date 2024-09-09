import { screenPadding } from '@/constants/tokens'
import { initiateAppleSignIn } from '@/helpers/auth'
import { supabase } from '@/helpers/supabase'
import { defaultStyles } from '@/styles'
import { AntDesign } from '@expo/vector-icons'
import { Session, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import {
	Alert,
	Linking,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import appleImage from '@/constants/logos/apple.png'
import googleImage from '@/constants/logos/google.png'

const Login = () => {
	const user = useUser()

	const [session, setSession] = useState<Session | null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				style={{ paddingHorizontal: screenPadding.horizontal }}
				contentInsetAdjustmentBehavior="automatic"
			>
				{user ? <SignedInView /> : <SignedOutView />}
			</ScrollView>
		</View>
	)
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

	const [signUpStatus, setSignUpStatus] = useState(false)

	const signInWithApple = async () => {
		try {
			const { token, nonce } = await initiateAppleSignIn()
			const { error } = await supabase.auth.signInWithIdToken({
				provider: 'apple',
				token,
				nonce,
			})
			if (error) return Alert.alert('Error', error.message)
		} catch (e) {
			if (typeof e === 'object' && !!e && 'code' in e) {
				if (e.code === 'ERR_REQUEST_CANCELED') {
					// handle that the user canceled the sign-in flow
				} else {
					// handle other errors
				}
			} else {
				console.error('Unexpected error from Apple SignIn: ', e)
			}
		}
	}

	const signInWithGoogle = async () => {
		const redirectTo = 'http://10.0.0.100:8081'
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectTo,
			},
		})

		if (error !== null) {
			console.log(error?.message)
			return 'error'
		} else {
			console.log(data)
			Linking.openURL(data.url)
			return 'success'
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.albumGrid}>{/* Add album cover components here */}</View>
			<View style={styles.contentContainer}>
				<Text style={styles.subheading}>Over 100 million songs and music videos!</Text>
				<Text style={styles.heading}>Unleash your music library on Beatbytes.</Text>
				<TouchableOpacity style={styles.googleButton}>
					<FastImage source={googleImage} style={{ ...styles.buttonIcon }} />
					<Text style={styles.buttonText}>Continue with Google</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.appleButton}>
					<FastImage source={appleImage} style={styles.appleIcon} />
					<Text style={styles.appleText}>Continue with Apple</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text style={styles.createAccount}>
						New to Beatbytes? <Text style={styles.link}>Create account</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

function EmailForm(props: { setSignUpStatus: React.Dispatch<React.SetStateAction<boolean>> }) {
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
			props.setSignUpStatus(false)
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

			<Pressable
				style={styles.toggleSignUp}
				onPress={() => {
					setIsSignUp((prev) => !prev)
					props.setSignUpStatus((prev: any) => !prev)
				}}
			>
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

export default Login

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		// padding: 16,
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
		fontSize: 30,
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
		backgroundColor: '#343EC7',
		padding: 8,
	},
	signInButtonText: {
		marginLeft: 4,
		fontSize: 16,
		fontWeight: '400',
		color: '#f5f5f7',
	},

	// container: {
	//   flex: 1,
	//   backgroundColor: '#000',
	// },
	albumGrid: {
		// Style for the album cover grid
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	subheading: {
		color: '#888',
		fontSize: 12,
		marginBottom: 10,
	},
	heading: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 30,
	},
	googleButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 20,
		paddingVertical: 12,
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	appleButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#000',
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 20,
		paddingVertical: 12,
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	appleIcon: {
		width: 20,
		height: 24,
		marginRight: 10,
	},
	buttonIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
	appleText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	createAccount: {
		color: '#fff',
		fontSize: 14,
	},
	link: {
		textDecorationLine: 'underline',
	},
})
