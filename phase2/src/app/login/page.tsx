'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

import { login } from './actions'
import { useTransition } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        startTransition(async () => {
            const result = await login(null, formData)
            if (result?.error) {
                setError(result.error)
                setLoading(false)
            }
            // On success, the server action redirects, so we don't need to do anything here
        })
    }

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) setError(error.message)
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-[#0a0a0c] text-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/" className="block text-center text-3xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
                    Shop2<span className="text-indigo-500">games</span>
                </Link>
                <h2 className="mt-6 text-center text-xl font-bold leading-9 tracking-tight text-white">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <div className="mb-4 rounded-md bg-red-900/30 border border-red-500/30 p-4 text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-[#0a0a0c] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-400">
                    Not a member?{' '}
                    <Link href="/register" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    )
}
