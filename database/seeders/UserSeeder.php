<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 10) as $i) {
            $user = User::factory()->create();
            Address::factory()->create(['user_id' => $user->id]);

            $user->assignRole('sales_rep');
        }

        foreach (range(1, 20) as $i) {
            $user = User::factory()->create();
            Address::factory()->create(['user_id' => $user->id]);

            $user->assignRole('delivery_man');
        }

        foreach (range(1, 30) as $i) {
            $user = User::factory()->create();
            Address::factory()->create(['user_id' => $user->id]);

            $user->assignRole('customer');
        }
    }
}
