import { ProductService } from '@/services/product.service'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetailSkeleton } from '@/components/Skeletons'
import { Product } from '@/models/types'

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    // Await params in Next.js 15
    const { id } = await params

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductView id={id} />
            </Suspense>
        </div>
    )
}

async function ProductView({ id }: { id: string }) {
    const product = await ProductService.getProductById(id)

    if (!product) {
        notFound()
    }

    // Parse schema safely
    const schema = product.input_schema as any

    return (
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-x-16">
                {/* Product Image/Info Column */}
                <div>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-800 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-8xl font-bold text-white/5 uppercase tracking-widest text-center select-none">
                                {product.title.substring(0, 3)}
                            </span>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 p-6">
                            <span className="inline-flex items-center rounded-full bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                {product.type === 'direct_api' ? 'Automatic Delivery' : 'Instant Key'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{product.title}</h1>
                        <p className="mt-4 text-gray-400">{product.description}</p>
                    </div>
                </div>

                {/* Form Column */}
                <div className="mt-10 lg:mt-0">
                    <div className="rounded-2xl bg-white/5 p-8 border border-white/10 shadow-2xl backdrop-blur-sm">
                        <h2 className="text-xl font-semibold mb-6">Top-Up Details</h2>

                        <form className="space-y-6">
                            {/* Dynamic Form Generation */}
                            {schema?.fields?.map((field: any) => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-white">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="mt-2">
                                        {field.type === 'select' ? (
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                className="block w-full rounded-md border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:bg-gray-900"
                                            >
                                                {field.options?.map((opt: string) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type === 'number' ? 'number' : 'text'}
                                                name={field.name}
                                                id={field.name}
                                                required={field.required}
                                                className="block w-full rounded-md border-0 bg-white/5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-500"
                                                placeholder={`Enter ${field.label}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-white/10 my-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">Total Price</span>
                                    <span className="text-2xl font-bold text-white">${product.price > 0 ? product.price : ' --'}</span>
                                </div>

                                <button
                                    type="button"
                                    className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
