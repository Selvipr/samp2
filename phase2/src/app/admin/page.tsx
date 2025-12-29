import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Fetch Stats
    // NOTE: In a real app with millions of rows, use count() estimate or dedicated stats table.
    // For MVP, we count directly.

    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: disputesCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true })
    // .eq('status', 'open') // Assuming disputes have status, check schema

    const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, total, status, created_at, users(email)')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-white mt-2">{usersCount || 0}</p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">{ordersCount || 0}</p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Active Disputes</h3>
                    <p className="text-3xl font-bold text-red-400 mt-2">{disputesCount || 0}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="font-semibold">Recent Global Activity</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {recentOrders?.map((order: any) => (
                        <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <p className="text-sm text-white font-medium">
                                    New Order form <span className="text-indigo-400">{order.users?.email}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-green-400 font-bold">${order.total}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'disputed' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {(!recentOrders || recentOrders.length === 0) && (
                        <div className="px-6 py-8 text-center text-gray-500">No activity yet.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
