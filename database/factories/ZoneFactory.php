<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Zone;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Zone>
 */
class ZoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $factory->define(Zone::class, function (Faker $faker) {
            return [
                'region_id' => \App\Models\Region::factory(),
                'name' => $faker->city . ' Zone',
                'code' => $faker->randomNumber(3),
            ];
        });
    }
}
