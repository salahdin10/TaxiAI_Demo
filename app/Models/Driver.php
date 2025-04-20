<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'permis_confidence',
        'cin',
        'license_number',
        'phone',
        'email',
        'taxi_id'
    ];

    public function taxi()
    {
        return $this->belongsTo(Taxi::class);
    }
}
