<?php

namespace App\Observers;

use App\Models\ProductVariant;

class ProductVariantObserver
{
    /**
     * Handle the ProductVariant "create" event.
     *
     * @param  \App\Models\ProductVariant  $variant
     * @return void
     */
    public function created(ProductVariant $variant)
    {
        $this->productUpdatedBy($variant);
    }
    
    /**
     * Handle the ProductVariant "updating" event.
     *
     * @param  \App\Models\ProductVariant  $variant
     * @return void
     */
    public function updating(ProductVariant $variant)
    {
        $this->productUpdatedBy($variant);
    }

    /**
     * Update product's updated by info using product variant.
     *
     * @param  \App\Models\ProductVariant  $variant
     * @return void
     */
    private function productUpdatedBy(ProductVariant $variant)
    {
        // Update the updated by user in the Product model when a variant is updated
        $variant->product()->update(['updated_by_id' => auth()->id()]);
    }
}
