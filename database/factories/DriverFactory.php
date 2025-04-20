<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
        use App\Models\Driver;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Driver>
 */
class DriverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

$factory->define(Driver::class, function (Faker $faker) {
    return [
        'taxi_id' => \App\Models\Taxi::factory(),
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'permis_confidence' => $faker->numberBetween(1, 100),
        'cin' => $faker->unique()->numerify('########'),
        'license_number' => $faker->unique()->regexify('[A-Z]{2}[0-9]{6}'),
        'phone' => $faker->phoneNumber,
        'email' => $faker->unique()->safeEmail,
    ];
});
    }
}
