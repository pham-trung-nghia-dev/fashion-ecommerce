<?php

use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'API backend qms-research']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::get('/banners', [BannerController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/promotions', [PromotionController::class, 'index']);

Route::get('/jobs', [JobController::class, 'index']);

Route::get('/stores', [StoreController::class, 'index']);
