<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taxi extends Model
{
    use HasFactory;

    protected $fillable = ['model', 'mark', 'license_plate', 'zone_id'];

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class);
    }
}
