<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 5) as $i) {
            Category::factory()->create([
                'created_by_id' => User::inRandomOrder()->first()->id,
                'updated_by_id' => User::inRandomOrder()->first()->id,
            ]);
        }
    }
}
