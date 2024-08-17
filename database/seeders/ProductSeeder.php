<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 49) as $i) {
            Product::factory()->create([
                'created_by_id' => User::inRandomOrder()->first()->id,
                'updated_by_id' => User::inRandomOrder()->first()->id
            ]);
        }
    }
}
