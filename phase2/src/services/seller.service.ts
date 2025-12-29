import { createClient } from '@/lib/supabase/client'
import { Product } from '@/models/types'

export class SellerService {
    // Fetch products owned by the seller
    static async getMyProducts(sellerId: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as Product[]
    }

    // Get Single Product
    static async getProductById(productId: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

        if (error) throw error
        return data as Product
    }

    // Create a new product
    static async createProduct(productData: Partial<Product>) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single()

        if (error) throw error
        return data
    }

    // Add Inventory (Keys)
    static async addInventoryKeys(productId: string, keys: string[]) {
        const supabase = createClient()

        if (keys.length === 0) return

        const payload = keys.map(k => ({
            product_id: productId,
            secret_data: k,
            status: 'available',
            type: 'serial_key'
        }))

        const { error } = await supabase
            .from('inventory')
            .insert(payload)

        if (error) throw error
    }

    // Get Inventory Stats for a Product
    static async getInventoryStats(productId: string) {
        const supabase = createClient()
        const { count, error } = await supabase
            .from('inventory')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId)
            .eq('status', 'available')

        if (error) throw error
        return count || 0
    }
}
