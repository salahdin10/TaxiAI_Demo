<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use App\Models\Alert;
use Carbon\Carbon;

class SyncJsonAlerts extends Command
{
    protected $signature = 'alerts:sync';
    protected $description = 'Sync alerts from public/web/data.json into the database';

    public function handle()
    {
        $jsonPath = public_path('web/data.json');

        if (!File::exists($jsonPath)) {
            $this->error('data.json not found.');
            return;
        }

        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        if (!$data || !isset($data['face'], $data['time'])) {
            $this->error('Invalid or incomplete JSON format.');
            return;
        }

        if ($data['face'] === 'UNKNOWN PERSON') {
            $exists = Alert::where('type', 'unknown_person')
                ->where('description', 'LIKE', "%{$data['face']}%")
                ->whereDate('detected_at', today())
                ->exists();

            if (!$exists) {
                Alert::create([
                    'type' => 'unknown_person',
                    'description' => 'Detected an unknown person at ' . $data['time'],
                    'detected_at' => Carbon::now(),
                ]);

                $this->info('Alert created.');
            } else {
                $this->info('Alert already exists.');
            }
        } else {
            $this->info('No alert to sync.');
        }
    }
}
