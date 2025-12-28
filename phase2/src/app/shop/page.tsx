import { ProductService } from '@/services/product.service'
import GameCard from '@/components/GameCard'

export default async function ShopPage() {
    // Fetch products via Service
    const products = await ProductService.getAllProducts()

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            {/* Header */}
            <div className="relative isolate overflow-hidden pt-14">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
                        Browse Games <span className="text-indigo-500">.</span>
                    </h1>

                    {/* Filter Tabs (Static for now) */}
                    <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
                        {['All Games', 'MOBA', 'FPS', 'RPG', 'Vouchers'].map((category, i) => (
                            <button
                                key={category}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${i === 0
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-24">
                        {products?.map((product) => (
                            <GameCard key={product.id} product={product} />
                        ))}

                        {(!products || products.length === 0) && (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No games found. Database seeding might be needed.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
