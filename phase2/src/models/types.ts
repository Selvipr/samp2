export interface Product {
    id: string
    title: string
    description: string | null
    price: number
    type: 'serial_key' | 'file' | 'direct_api'
    input_schema: Record<string, any> | null
    supplier_config: Record<string, any> | null
    created_at: string
}

export interface UserProfile {
    id: string
    email: string
    role: 'buyer' | 'seller' | 'admin'
    wallet_balance: number
    kyc_status: string
    created_at: string
}
