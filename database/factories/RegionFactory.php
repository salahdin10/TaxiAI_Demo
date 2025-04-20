<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Region;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Region>
 */
class RegionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $factory->define(Region::class, function (Faker $faker) {
            return [
                'name' => $faker->city,
                'code' => $faker->randomNumber(5),
                'description' => $faker->sentence,
                'created_at' => $faker->dateTimeThisYear,
            ];
        });
    }
}
