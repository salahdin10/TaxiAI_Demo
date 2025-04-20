<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index()
    {
        // Load latest alerts, with driver & taxi relations
        $alerts = Alert::with(['driver','taxi'])
            ->orderByDesc('detected_at')
            ->get();

        // Pass to Inertia
        return Inertia::render('Alerts', [
            'alerts' => $alerts,
        ]);
    }
}
