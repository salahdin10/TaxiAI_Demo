<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZoneController extends Controller
{
    public function index()
    {
        $zones = Zone::with('region')->latest()->paginate(10);
        return Inertia::render('Admin/Zones/Index', [
            'zones' => $zones,
            'regions' => Region::all(['id', 'name'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Zones/Create', [
            'regions' => Region::all(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:zones,code',
            'description' => 'nullable|string',
            'region_id' => 'required|exists:regions,id'
        ]);

        Zone::create($request->all());

        return redirect()->route('admin.zones.index')
            ->with('success', 'Zone created successfully.');
    }

    public function edit(Zone $zone)
    {
        return Inertia::render('Admin/Zones/Edit', [
            'zone' => $zone,
            'regions' => Region::all(['id', 'name'])
        ]);
    }

    public function update(Request $request, Zone $zone)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:zones,code,'.$zone->id,
            'description' => 'nullable|string',
            'region_id' => 'required|exists:regions,id'
        ]);

        $zone->update($request->all());

        return redirect()->route('admin.zones.index')
            ->with('success', 'Zone updated successfully.');
    }

    public function destroy(Zone $zone)
    {
        $zone->delete();
        return redirect()->route('admin.zones.index')
            ->with('success', 'Zone deleted successfully.');
    }
}
