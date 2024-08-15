<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $image = $request->file('image');
        if ($image) {
            // Define user-specific directory and random filename
            $userId = $request->user()->id;
            $directory = base_path("public/storage/users/{$userId}");

            // Empty the directory before saving the new image
            if (File::exists($directory)) {
                $files = File::files($directory);
                foreach ($files as $file) {
                    File::delete($file);
                }
            } else {
                // If directory does not exist, create it
                File::makeDirectory($directory, 0755, true); // Creates the directory with the necessary permissions
            }

            // Read image from file system and resize it
            $manager = new ImageManager(new Driver());
            $resizedImage = $manager->read($image)->coverDown(250, 250, 'center')->toJpeg(80);

            // Generate a random filename
            $randomFileName = Str::random(24) . '.jpg'; // or any other extension depending on image format
            $path = $directory . '/' . $randomFileName;

            // Save the resized image
            $resizedImage->save($path);

            // Save the image path to the data array
            $data['image'] = "users/{$userId}/{$randomFileName}";
        }

        $request->user()->fill($data);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
