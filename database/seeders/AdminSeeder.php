<?php

namespace Database\Seeders;

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

        $user->address()->create([
            'street' => '123 Admin Street',
            'city' => 'Admin City',
            'state' => 'Admin State',
            'zip' => '12345',
        ]);

        $user->assignRole('admin');
    }
}
