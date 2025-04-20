<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'description',
        'detected_at',
        'driver_id',
        'taxi_id',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function taxi()
    {
        return $this->belongsTo(Taxi::class);
    }
}
