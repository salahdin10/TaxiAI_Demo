
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AlertController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
//user Route
Route::middleware('auth','userMiddleware')->group(function (){

    Route::get('dashboard',[\App\Http\Controllers\User\UserController::class,'index'])->name('dashboard');

    route::get('/ai-recognition', function () {    return Inertia::render('AIRecognition');})->name('ai.recognition');


// In your auth‑protected group for users:
    Route::get('/alerts', [AlertController::class, 'index'])
     ->middleware(['auth','userMiddleware'])
     ->name('alerts.index');

});
// admin Route
Route::middleware('auth','adminMiddleware')->group(function () {
    Route::get('/Admin/Dashboard', [\App\Http\Controllers\Admin\AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/Admin/Users', [\App\Http\Controllers\Admin\AdminController::class, 'users'])->name('admin.users');
    Route::delete('/Admin/Users/{user}', [\App\Http\Controllers\Admin\AdminController::class, 'destroy'])->name('admin.users.destroy');
//Regions Route
Route::get('/Admin/Regions/Index.tsx', [\App\Http\Controllers\Admin\RegionController::class, 'index'])->name('admin.regions.index');
Route::get('/Admin/Regions/Create', [\App\Http\Controllers\Admin\RegionController::class, 'create'])->name('admin.regions.create');
Route::post('/Admin/Regions/Store', [\App\Http\Controllers\Admin\RegionController::class, 'store'])->name('admin.regions.store');
Route::get('/Admin/Regions/Edit/{region}', [\App\Http\Controllers\Admin\RegionController::class, 'edit'])->name('admin.regions.edit');
Route::put('/Admin/Regions/{region}', [\App\Http\Controllers\Admin\RegionController::class, 'update'])->name('admin.regions.update');
Route::delete('/Admin/Regions/{region}', [\App\Http\Controllers\Admin\RegionController::class, 'destroy'])->name('admin.regions.destroy');
// Zones Route
    Route::get('/Admin/Zones/Index', [\App\Http\Controllers\Admin\ZoneController::class, 'index'])->name('admin.zones.index');
    Route::get('/Admin/Zones/Create', [\App\Http\Controllers\Admin\ZoneController::class, 'create'])->name('admin.zones.create');
    Route::post('/Admin/Zones/Store', [\App\Http\Controllers\Admin\ZoneController::class, 'store'])->name('admin.zones.store');
    Route::get('/Admin/Zones/Edit/{zone}', [\App\Http\Controllers\Admin\ZoneController::class, 'edit'])->name('admin.zones.edit');
    Route::put('/Admin/Zones/{zone}', [\App\Http\Controllers\Admin\ZoneController::class, 'update'])->name('admin.zones.update');
    Route::delete('/Admin/Zones/{zone}', [\App\Http\Controllers\Admin\ZoneController::class, 'destroy'])->name('admin.zones.destroy');
// Taxi Route
    Route::get('/Admin/Taxis/Index', [\App\Http\Controllers\Admin\TaxiController::class, 'index'])->name('admin.taxis.index');
    Route::get('/Admin/Taxis/Create', [\App\Http\Controllers\Admin\TaxiController::class, 'create'])->name('admin.taxis.create');
    Route::post('/Admin/Taxis/Store', [\App\Http\Controllers\Admin\TaxiController::class, 'store'])->name('admin.taxis.store');
    Route::get('/Admin/Taxis/Edit/{taxi}', [\App\Http\Controllers\Admin\TaxiController::class, 'edit'])->name('admin.taxis.edit');
    Route::put('/Admin/Taxis/{taxi}', [\App\Http\Controllers\Admin\TaxiController::class, 'update'])->name('admin.taxis.update');
    Route::delete('/Admin/Taxis/{taxi}', [\App\Http\Controllers\Admin\TaxiController::class, 'destroy'])->name('admin.taxis.destroy');
// Region Route
    Route::get('/Admin/Drivers/Index', [\App\Http\Controllers\Admin\DriverController::class, 'index'])->name('admin.drivers.index');
    Route::get('/Admin/Drivers/Create', [\App\Http\Controllers\Admin\DriverController::class, 'create'])->name('admin.drivers.create');
    Route::post('/Admin/Drivers/Store', [\App\Http\Controllers\Admin\DriverController::class, 'store'])->name('admin.drivers.store');
    Route::get('/Admin/Drivers/Edit/{driver}', [\App\Http\Controllers\Admin\DriverController::class, 'edit'])->name('admin.drivers.edit');
    Route::put('/Admin/Drivers/{driver}', [\App\Http\Controllers\Admin\DriverController::class, 'update'])->name('admin.drivers.update');
    Route::delete('/Admin/Drivers/{driver}', [\App\Http\Controllers\Admin\DriverController::class, 'destroy'])->name('admin.drivers.destroy');
});

