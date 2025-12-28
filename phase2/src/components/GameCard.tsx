import Link from 'next/link'

interface Product {
    id: string
    title: string
    price: number
    type: string
}

export default function GameCard({ product }: { product: Product }) {
    // Generate a placeholder image based on title (in a real app, this would be a real URL)
    // For now, using a gradient placeholder.
    return (
        <Link href={`/shop/${product.id}`} className="group relative block overflow-hidden rounded-xl bg-gray-900 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
            {/* Image Placeholder */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-800">
                <div className="h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 object-cover transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/10 select-none uppercase tracking-widest">{product.title.substring(0, 2)}</span>
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                    <p className="mt-1 text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {product.type === 'direct_api' ? 'Instant Top-Up' : 'digital Key'}
                    </p>
                    <div className="mt-4 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-indigo-400 font-bold">Start Now &rarr;</span>
                    </div>
                </div>
            </div>

            {/* Type Badge */}
            <div className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {product.type === 'direct_api' ? 'Top-Up' : 'Key'}
            </div>
        </Link>
    )
}
