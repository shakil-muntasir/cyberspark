<?php

namespace Database\Seeders;

use App\Models\CourierService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourierServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CourierService::factory(5)->create();
    }
}
