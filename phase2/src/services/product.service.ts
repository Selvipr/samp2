import { createClient } from '@/lib/supabase/server'
import { Product } from '@/models/types'

export class ProductService {
    /**
     * Fetches all products ordered by creation date.
     */
    static async getAllProducts(): Promise<Product[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching products:', error)
            return []
        }

        return data as Product[]
    }

    /**
     * Fetches a single product by ID.
     */
    static async getProductById(id: string): Promise<Product | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            // It's common to return null if not found rather than throwing
            return null
        }

        return data as Product
    }
}
