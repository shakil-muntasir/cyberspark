<?php

namespace App\Providers;

use App\Models\ProductVariant;
use App\Observers\ProductVariantObserver;
use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        ProductVariant::observe(ProductVariantObserver::class);
    }
}
