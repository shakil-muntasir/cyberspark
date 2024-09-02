<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 25) as $i) {
            $user = User::factory()->create([
                'created_by_id' => User::inRandomOrder()->first()->id,
                'updated_by_id' => User::inRandomOrder()->first()->id,
            ]);
            Address::factory()->create(['user_id' => $user->id]);
        }
    }
}
