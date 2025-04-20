<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
   use HasFactory;
   protected $fillable = ['name','code','description','region_id'];

   protected $with = ['region'];


   public function region(){
       return $this->belongsTo(Region::class);
   }
    public function taxis()
    {
        return $this->hasMany(Taxi::class);
    }

}
