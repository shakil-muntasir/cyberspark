<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // WARNING: order of seeder classes is important!

        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            AdminSeeder::class, // Role and Permission Seeder must be called before AdminSeeder
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CourierServiceSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
