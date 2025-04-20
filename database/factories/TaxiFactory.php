<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
        use App\Models\Taxi;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Taxi>
 */
class TaxiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

$factory->define(Taxi::class, function (Faker $faker) {
    return [
        'zone_id' => \App\Models\Zone::factory(),
        'model' => $faker->randomElement(['Toyota', 'Honda', 'Ford']),
        'mark' => $faker->year,
        'license_plate' => $faker->regexify('[A-Z]{2}-[0-9]{3}-[A-Z]{2}'),
    ];
});
    }
}
