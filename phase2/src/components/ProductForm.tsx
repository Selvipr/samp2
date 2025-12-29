'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ProductFormProps {
    lang: string
    initialData?: any
    sellerId: string
}

export default function ProductForm({ lang, initialData, sellerId }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        type: initialData?.type || 'serial_key'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            seller_id: sellerId
        }

        try {
            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert(payload)
                if (error) throw error
            }

            router.push(`/${lang}/seller/products`)
            router.refresh()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Product Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Type</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                        >
                            <option value="serial_key">Serial Key</option>
                            <option value="file">File Download</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    )
}
