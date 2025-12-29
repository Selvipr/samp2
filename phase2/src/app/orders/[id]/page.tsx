import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { redirect } from 'next/navigation'

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const order = await OrderService.getOrderById(id)

    if (!order) {
        return <div className="text-white p-8">Order not found</div>
    }

    // Server Actions for Escrow
    async function confirmReceived() {
        'use server'
        // In a real app, you'd validate user permission here again or use OrderService which should check it
        await OrderService.confirmOrder(id, order.items?.[0]?.seller_id, order.total) // Assuming 1 item for MVP
        redirect(`/orders/${id}`)
    }

    async function raiseDispute() {
        'use server'
        await OrderService.disputeOrder(id)
        redirect(`/orders/${id}`)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <div className="mx-auto max-w-3xl px-4 py-16">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-mono">{order.status}</span>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-mono">{order.id}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-xl font-bold text-green-400">${order.total}</span>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <a
                            href={`/orders/${order.id}/invoice`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Invoice
                        </a>
                    </div>
                </div>
                {order.payment_method && (
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">Payment</span>
                        <span className="uppercase">{order.payment_method.replace('_', ' ')}</span>
                    </div>
                )}
                {order.contact_email && (
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">Email</span>
                        <span>{order.contact_email}</span>
                    </div>
                )}
                {order.delivery_info?.notes && (
                    <div className="flex flex-col mb-4 pt-4 border-t border-gray-700">
                        <span className="text-gray-400 text-sm mb-1">Delivery Notes</span>
                        <span className="text-gray-300 italic">"{order.delivery_info.notes}"</span>
                    </div>
                )}

                {/* Items List */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Items</h3>
                    {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between py-2">
                            <span>{item.title}</span>
                            <span>${item.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Secret Data Section (Only if Complete) */}
            {order.status === 'completed' && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Your Digital Goods</h3>
                    {/* 
                            Ideally, we fetch the inventory linked to this order.
                            For now, we might display a placeholder if link is broken, 
                            but let's query inventory by order_id if we added the column.
                        */}
                    <div className="font-mono bg-black/50 p-4 rounded text-lg tracking-widest text-center select-all">
                        {/* Placeholder for secret - in real impl we fetch inventory.secret_data 
                                OrderService.getOrderSecret(id) would be better
                            */}
                        ABC1-DEF2-GHI3-JKL4 (Mock Key)
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-400">Please redeem immediately.</p>
                </div>
            )}

            {/* Escrow Actions */}
            {order.status === 'escrow' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Safe Deal Escrow</h3>
                    <p className="text-sm text-gray-300 mb-6">
                        Your funds are held safely. Please verify the seller has delivered the item (if applicable) or wait for the key to be revealed upon confirmation.
                        <br /><strong>Note:</strong> For instant delivery items, clicking Confirm will reveal the key.
                    </p>

                    <div className="flex gap-4">
                        <form action={confirmReceived} className="flex-1">
                            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                Confirm Received & Release Funds
                            </button>
                        </form>
                        <form action={raiseDispute} className="flex-1">
                            <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                Dispute Transaction
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
