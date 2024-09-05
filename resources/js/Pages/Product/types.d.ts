type Attributes = {
    id: string
    name: string
    sku_prefix: string
    description?: string
    status: string
    variants_count: string
    variants_sum_quantity: string
    availability: string
    category: string
    category_id: string
    created_by_id: string
    updated_by_id: string
    created_by: string
    updated_by: string
    created_at: string
    updated_at: string
}

type Relationships = {
    variants?: ProductVariant[]
}

export type Product = {
    type: string
    id: string
    attributes: Attributes
    relationships?: Relationships
}

export type ProductResource = {
    data: Product
}

export type ProductCollection = {
    data: Product[]
}

type VariantAttributes = {
    id: string
    product_id: string
    sku: string
    quantity: string
    buying_price: string
    retail_price?: string
    selling_price: string
    status: string
    created_by_id: string
    updated_by_id: string
    created_by: string
    updated_by: string
    created_at: string
    updated_at: string
}

type VariantRelationships = {
    product?: Product
}

export type ProductVariant = {
    type: string
    id: string
    attributes: VariantAttributes
    relationships?: VariantRelationships
}

export type ProductVariantResource = {
    data: ProductVariant
}

export type ProductVariantCollection = {
    data: ProductVariant[]
}

export type ProductForm = {
    name: string
    sku_prefix: string
    description?: string
    category_id: string
    status?: string
}

export type ProductVariantForm = {
    id?: string
    quantity: string
    buying_price: string
    retail_price?: string
    selling_price: string
}

export type CartItem = {
    variant: ProductVariant
    quantity: number
    subtotal: number
}
