<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionController extends Controller
{
    /**
     * Display a listing of regions.
     */
    public function index()
    {
        // You can adjust pagination size as needed
        $regions = Region::latest()->paginate(10);

        return Inertia::render('Admin/Regions/Index', [
            'regions' => $regions,
        ]);
    }

    /**
     * Show the form for creating a new region.
     */
    public function create()
    {
        return Inertia::render('Admin/Regions/Create');
    }

    /**
     * Store a newly created region in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:regions,name',
            'code'        => 'nullable|string|max:50|unique:regions,code',
            'description' => 'nullable|string',
        ]);

        Region::create($validated);

        return redirect()->route('admin.regions.index')
            ->with('success', 'Region created successfully.');
    }

    /**
     * Show the form for editing the specified region.
     */
    public function edit(Region $region)
    {
        return Inertia::render('Admin/Regions/Edit', [
            'region' => $region,
        ]);
    }

    /**
     * Update the specified region in storage.
     */
    public function update(Request $request, Region $region)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:regions,name,' . $region->id,
            'code'        => 'nullable|string|max:50|unique:regions,code,' . $region->id,
            'description' => 'nullable|string',
        ]);

        $region->update($validated);

        return redirect()->route('admin.regions.index')
            ->with('success', 'Region updated successfully.');
    }

    /**
     * Remove the specified region from storage.
     */
    public function destroy(Region $region)
    {
        $region->delete();

        return redirect()->route('admin.regions.index')
            ->with('success', 'Region deleted successfully.');
    }
}
