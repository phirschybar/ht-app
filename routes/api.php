<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
        'status' => 'success'
    ]);
});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'web'])->group(function () {
    Route::get('/auth-test', function () {
        return response()->json([
            'message' => 'Authentication successful',
            'user' => auth()->user()
        ]);
    });
    
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/dashboard/update-day', [DashboardController::class, 'updateDay']);
});
