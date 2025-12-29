'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function InventoryManager({ productId, currentCount }: { productId: string, currentCount: number }) {
    const [keys, setKeys] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAddKeys = async () => {
        if (!keys.trim()) return
        setLoading(true)

        const keyList = keys.split('\n').filter(k => k.trim().length > 0)

        try {
            const supabase = createClient()
            const payload = keyList.map(k => ({
                product_id: productId,
                secret_data: k.trim(),
                status: 'available',
                type: 'serial_key'
            }))

            const { error } = await supabase.from('inventory').insert(payload)
            if (error) throw error

            setKeys('')
            alert(`Successfully added ${keyList.length} keys`)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to add inventory')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#151518] rounded-xl border border-white/5 p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Inventory Management</h2>

            <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-sm">Current Stock</span>
                    <p className="text-2xl font-bold text-green-400">{currentCount}</p>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Add New Keys (One per line)</label>
                <textarea
                    rows={5}
                    placeholder="Key-1234-ABCD&#10;Key-5678-EFGH"
                    value={keys}
                    onChange={e => setKeys(e.target.value)}
                    className="block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:ring-indigo-500"
                />

                <button
                    onClick={handleAddKeys}
                    disabled={loading || !keys.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Keys to Inventory'}
                </button>
            </div>
        </div>
    )
}
