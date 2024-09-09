import { supabase } from '@/helpers/supabase'
import { Session } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { initiateAppleSignIn } from '@/helpers/auth'
import { AntDesign } from '@expo/vector-icons'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Alert, Pressable, TextInput } from 'react-native'

import GoogleAuth from '@/components/GoogleAuth'
import { screenPadding } from '@/constants/tokens'
import { Icon } from '@rneui/themed'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useRouter } from 'expo-router'

export default function Profile() {
	const user = useUser()

	const [session, setSession] = useState<Session | null>(null)

	const router = useRouter()

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	return (
		<View style={styles.container}>
			<ScrollView
				// style={{ paddingHorizontal: screenPadding.horizontal }}
				contentInsetAdjustmentBehavior="automatic"
			>
				{user ? <SignedInView /> : <LoginView />}
				{/* <View
					style={{
						...styles.accountContainer,
						backgroundColor: 'green',
					}}
				> */}
				<TouchableOpacity onPress={() => router.navigate('/(tabs)/account/spotifyLogin')}>
					<Text style={{ ...styles.input, fontWeight: 'bold' }}>Link Spotify Account</Text>
				</TouchableOpacity>
				{/* </View> */}
			</ScrollView>
		</View>
	)
}

function LoginView() {
	const router = useRouter()
	return (
		<View style={styles.container}>
			<ScrollView
				style={{ paddingHorizontal: screenPadding.horizontal }}
				contentInsetAdjustmentBehavior="automatic"
			>
				{/* just put a big Sign In/Sign Up button here */}

				<Pressable onPress={() => router.navigate('/account/login')} style={styles.signInButton}>
					<Text style={styles.signInButtonText}>Sign In or Sign Up</Text>
				</Pressable>
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
		<View style={styles.signedOutContainer}>
			<Text style={styles.signInTitle}>{signUpStatus ? 'Sign Up' : 'Sign In'}</Text>

			{/* Email Sign In */}
			<EmailForm setSignUpStatus={setSignUpStatus} />

			<View style={styles.dividerContainer}>
				<Text style={styles.dividerText}>or</Text>
			</View>

			{/* Sign in with Apple */}

			<AppleAuthentication.AppleAuthenticationButton
				buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
				buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
				cornerRadius={8}
				onPress={signInWithApple}
				style={styles.appleAuthButton}
			/>

			{/* Sign in with Google */}
			<GoogleAuth />

			<TouchableOpacity style={styles.appleAuthButton} onPress={() => signInWithGoogle()}>
				<Icon style={styles.signInButtonText} name="google" />
			</TouchableOpacity>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
		padding: 16,
	},
	signedInContainer: {
		flex: 1,
		gap: 16,
	},
	accountContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 10,
		padding: 8,
		borderRadius: 8,
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
})
