import { User as AuthUser, Session, SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { Subscription, UserDetails } from 'types'

type UserContextType = {
	session: Session | null
	user: AuthUser | null
	userDetails: UserDetails | null
	isLoading: boolean
	subscription: Subscription | null
	supabase: SupabaseClient
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
	supabase: SupabaseClient
	[propName: string]: any
}

export const MyUserContextProvider = ({ supabase, ...props }: Props) => {
	const [session, setSession] = useState<Session | null>(null)
	const [user, setUser] = useState<AuthUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
	const [subscription, setSubscription] = useState<Subscription | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			const session = (await supabase.auth.getSession()).data.session
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		}

		fetchUser()

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		})

		return () => {
			authListener.subscription?.unsubscribe()
		}
	}, [supabase])

	useEffect(() => {
		if (user && !userDetails && !subscription) {
			setIsLoading(true)
			Promise.allSettled([
				supabase.from('users').select('*').single(),
				supabase
					.from('subscriptions')
					.select('*, prices(*, products(*))')
					.in('status', ['trialing', 'active'])
					.single(),
			]).then((results) => {
				const userDetailsPromise = results[0]
				const subscriptionPromise = results[1]

				if (userDetailsPromise.status === 'fulfilled')
					setUserDetails(userDetailsPromise.value.data as UserDetails)

				if (subscriptionPromise.status === 'fulfilled')
					setSubscription(subscriptionPromise.value.data as Subscription)

				setIsLoading(false)
			})
		} else if (!user && !isLoading) {
			setUserDetails(null)
			setSubscription(null)
		}
	}, [user, isLoading, supabase])

	const value = {
		session,
		user,
		userDetails,
		isLoading,
		subscription,
		supabase,
	}

	return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error(`useUser must be used within a MyUserContextProvider.`)
	}
	return context
}
