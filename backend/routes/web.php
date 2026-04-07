<?php

use Illuminate\Support\Facades\Route;

// SPA catch-all: serve React app for all non-API routes
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
