<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'gender' => 'male',
            'phone' => '1234567890',
            'password' => bcrypt('password'),
        ]);

        $user->update([
            'created_by_id' => $user->id,
            'updated_by_id' => $user->id,
        ]);

        Address::factory()->create([
            'user_id' => $user->id
        ]);

        $user->assignRole('admin');
    }
}
