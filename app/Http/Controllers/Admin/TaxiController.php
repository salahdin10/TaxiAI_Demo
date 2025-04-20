<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Taxi;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaxiController extends Controller
{
    /**
     * Display a listing of the taxis.
     */
    public function index()
    {
        $taxis = Taxi::with(['zone.region'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Taxis/Index', [
            'taxis' => $taxis,
            'zones' => Zone::with('region')->get()
        ]);
    }

    /**
     * Show the form for creating a new taxi.
     */
    public function create()
    {
        return Inertia::render('Admin/Taxis/Create', [
            'zones' => Zone::with('region')->get()
        ]);
    }

    /**
     * Store a newly created taxi in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'model' => 'required|string|max:255',
            'mark' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:taxis',
            'zone_id' => 'required|exists:zones,id'
        ]);

        Taxi::create($validated);

        return redirect()->route('admin.taxis.index')
            ->with('success', 'Taxi created successfully.');
    }

    /**
     * Display the specified taxi.
     */
    public function show(Taxi $taxi)
    {
        return Inertia::render('Admin/Taxis/Show', [
            'taxi' => $taxi->load(['zone.region'])
        ]);
    }

    /**
     * Show the form for editing the specified taxi.
     */
    public function edit(Taxi $taxi)
    {
        return Inertia::render('Admin/Taxis/Edit', [
            'taxi' => $taxi->load(['zone.region']),
            'zones' => Zone::with('region')->get()
        ]);
    }

    /**
     * Update the specified taxi in storage.
     */
    public function update(Request $request, Taxi $taxi)
    {
        $validated = $request->validate([
            'model' => 'required|string|max:255',
            'mark' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:taxis,license_plate,'.$taxi->id,
            'zone_id' => 'required|exists:zones,id'
        ]);

        $taxi->update($validated);

        return redirect()->route('admin.taxis.index')
            ->with('success', 'Taxi updated successfully.');
    }

    /**
     * Remove the specified taxi from storage.
     */
    public function destroy(Taxi $taxi)
    {
        $taxi->delete();

        return redirect()->route('admin.taxis.index')
            ->with('success', 'Taxi deleted successfully.');
    }
}
