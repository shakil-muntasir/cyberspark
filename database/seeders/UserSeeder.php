<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach(range(1, 10) as $i) {
            $user = User::factory()->create([
                'created_by' => User::where('email', 'admin@email.com')->first()->id ?? null,
            ]);
            Address::factory()->create(['user_id' => $user->id]);
        }
    }
}
