<?php

use App\Http\Controllers\AcquisitionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('/acquisitions')->name('acquisitions.')->group(function () {
        Route::get('/', [AcquisitionController::class, 'index'])->name('index');
        Route::post('/', [AcquisitionController::class, 'store'])->name('store');
        Route::get('/{acquisition}', [AcquisitionController::class, 'show'])->name('show');
    });

    Route::prefix('/customers')->name('customers.')->group(function () {
        Route::get('/dropdown', [CustomerController::class, 'dropdown'])->name('dropdown');
    });

    Route::prefix('/orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
    });

    Route::prefix('/products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/dropdown', [ProductController::class, 'dropdown'])->name('dropdown');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::patch('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('/profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        // below route is declared as "post" due to the limitation of Inertia.js multiple file upload
        Route::post('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('/users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
    });

    Route::prefix('/variants')->name('variants.')->group(function () {
        Route::post('/', [ProductVariantController::class, 'store'])->name('store');
        Route::get('/dropdown', [ProductVariantController::class, 'dropdown'])->name('dropdown');
        Route::post('/validate', [ProductVariantController::class, 'validate'])->name('validate');
        Route::patch('/{variant}', [ProductVariantController::class, 'update'])->name('update');
        Route::delete('/{variant}', [ProductVariantController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('/invoices')->name('invoices.')->group(function () {
        Route::get('/{order}', [InvoiceController::class, 'show'])->name('show');
    });
});

require __DIR__ . '/auth.php';
