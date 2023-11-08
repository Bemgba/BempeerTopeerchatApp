<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CallController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/call', [CallController::class, 'call'])->name('call'); 
Route::get('/lobby', [CallController::class, 'lobby'])->name('lobby'); 
Route::get('/lobbyadmin', [CallController::class, 'lobbyadmin'])->name('lobbyadmin'); 
Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
