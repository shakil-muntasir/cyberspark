<?php

namespace App\Classes;

class AuditUserResolver implements \OwenIt\Auditing\Contracts\UserResolver
{
    /**
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public static function resolve()
    {
        // If we are in a local environment and running in console or unit tests, return the first admin user
        if (!app()->isProduction() && (app()->runningInConsole() || app()->runningUnitTests())) {
            return \App\Models\User::role('admin')->first();
        }

        $guards = config('audit.user.guards', [
            config('auth.defaults.guard')
        ]);

        foreach ($guards as $guard) {
            try {
                $authenticated = auth()->guard($guard)->check();
            } catch (\Exception $exception) {
                continue;
            }

            if (true === $authenticated) {
                return auth()->guard($guard)->user();
            }
        }

        return null;
    }
}
