import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    /* 
   * Fetch user profile from public table to verify the trigger worked 
   * and to get role/balance information.
   */
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white shadow dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <form action="/auth/signout" method="post">
                        <button className="text-sm font-medium text-red-600 hover:text-red-500">
                            Sign out
                        </button>
                    </form>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Welcome, {profile?.email || user.email}
                            </h2>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
                                    <div className="text-sm font-medium text-indigo-500 dark:text-indigo-400">Role</div>
                                    <div className="mt-1 text-2xl font-semibold text-indigo-700 dark:text-indigo-300 capitalize">
                                        {profile?.role || 'Guest'}
                                    </div>
                                </div>
                                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="text-sm font-medium text-green-500 dark:text-green-400">Wallet</div>
                                    <div className="mt-1 text-2xl font-semibold text-green-700 dark:text-green-300">
                                        ${profile?.wallet_balance || '0.00'}
                                    </div>
                                </div>
                                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="text-sm font-medium text-blue-500 dark:text-blue-400">UID</div>
                                    <div className="mt-1 text-xs font-mono text-blue-700 dark:text-blue-300 truncate">
                                        {user.id}
                                    </div>
                                </div>
                            </div>

                            {!profile && (
                                <div className="mt-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Note: Your public profile was not found. This might be due to a database trigger delay or error.
                                </div>
                            )}

                            <p className="mt-6 text-gray-600 dark:text-gray-400">
                                Start by browsing products or managing your inventory.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
