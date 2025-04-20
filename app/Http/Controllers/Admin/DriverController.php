<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Taxi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverController extends Controller
{

    public function index()
    {
        $drivers = Driver::with(['taxi'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => $drivers,
            'taxis' => Taxi::select(['id', 'license_plate'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Drivers/Create', [
            'taxis' => Taxi::doesntHave('drivers')
                ->select(['id', 'license_plate'])
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'permis_confidence' => 'required|integer|between:0,100',
            'cin' => 'required|string|unique:drivers',
            'license_number' => 'required|string|unique:drivers',
            'phone' => 'required|string|regex:/^[0-9]{10}$/|unique:drivers',
            'email' => 'required|email|max:255|unique:drivers',
            'taxi_id' => 'required|exists:taxis,id'
        ]);

        Driver::create($validated);

        return redirect()->route('admin.drivers.index')
            ->with('success', 'Driver created successfully.');
    }

    public function show(Driver $driver)
    {
        return Inertia::render('Admin/Drivers/Show', [
            'driver' => $driver->load(['taxi.zone.region'])
        ]);
    }

    public function edit(Driver $driver)
    {
        return Inertia::render('Admin/Drivers/Edit', [
            'driver' => $driver,
            'taxis' => Taxi::whereDoesntHave('drivers')
                ->orWhere('id', $driver->taxi_id)
                ->select(['id', 'license_plate'])
                ->get()
        ]);
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'permis_confidence' => 'required|integer|between:0,100',
            'cin' => 'required|string|size:12|unique:drivers,cin,'.$driver->id,
            'license_number' => 'required|string|size:10|unique:drivers,license_number,'.$driver->id,
            'phone' => 'required|string|regex:/^[0-9]{10}$/|unique:drivers,phone,'.$driver->id,
            'email' => 'required|email|max:255|unique:drivers,email,'.$driver->id,
            'taxi_id' => 'required|exists:taxis,id'
        ]);

        $driver->update($validated);

        return redirect()->route('admin.drivers.index')
            ->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();
        return redirect()->route('admin.drivers.index')
            ->with('success', 'Driver deleted successfully.');
    }
}
