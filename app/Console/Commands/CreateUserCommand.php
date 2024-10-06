<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use function Laravel\Prompts\{text, password, multiselect};

class CreateUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a user and assign them roles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Prompt for the user's details
        $name = text(
            label: 'What is your name?',
            placeholder: 'E.g. John',
            required: true
        );

        $email = text(
            label: 'What is your email address?',
            placeholder: 'E.g. john@email.com',
            required: true
        );

        $phone = text(
            label: 'What is your phone number?',
            placeholder: 'E.g. 1234567890',
            required: true
        );

        $password = password(
            label: 'What is your password?',
            placeholder: 'password',
            required: true,
            hint: 'Minimum 8 characters.'
        );

        // Fetch roles from the Role model
        $roles = Role::all()->pluck('name')->toArray();

        $selectedRoles = multiselect(
            label: 'Select roles for the user',
            options: $roles,
            required: true
        );

        // Prompt for the address details
        $street = text(
            label: 'What is your street address?',
            placeholder: 'E.g. 123 Main St',
            required: true
        );
        $city = text(
            label: 'What is your city?',
            placeholder: 'E.g. New York',
            required: true
        );
        $state = text(
            label: 'What is your state?',
            placeholder: 'E.g. NY',
            required: true
        );
        $zip = text(
            label: 'What is your zip code?',
            placeholder: 'E.g. 10001',
            required: true
        );

        try {
            // Create the user
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'password' => bcrypt($password),
            ]);

            // Attach the selected roles to the user
            $user->syncRoles($selectedRoles);

            $this->info('User created successfully and assigned roles: ' . implode(', ', $selectedRoles));

            // Save the address with the user relationship
            $user->address()->create([
                'street' => $street,
                'city' => $city,
                'state' => $state,
                'zip' => $zip,
            ]);

            $this->info('Address created successfully.');

            return 0;
        } catch (\Exception $e) {
            $this->error('An error occurred while creating the user: ' . $e->getMessage());
            return 1;
        }
    }
}
