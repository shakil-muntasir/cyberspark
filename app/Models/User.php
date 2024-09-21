<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Gender;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Traits\HasRoles;
use Str;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'gender',
        'phone',
        'image',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $casts = [
        'gender' => Gender::class,
        'status' => UserStatus::class
    ];

    public function address(): HasOne
    {
        return $this->hasOne(Address::class, 'user_id');
    }

    public function customerOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function deliveryManOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'delivery_man_id');
    }

    /**
     * Get the current roles of the user.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getCurrentRolesAttribute()
    {
        // Check if the user has roles
        if ($this->roles->isEmpty()) {
            return [];
        }

        return $this->roles->map(function ($role) {
            return [
                'label' => Str::title(str_replace('_', ' ', $role->name)),
                'value' => $role->name
            ];
        })->toArray();
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', UserStatus::ACTIVE->value);
    }

    /**
     * Scope a query to only include inactive users.
     *
     * @param  Builder $query
     * @return Builder
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', UserStatus::INACTIVE->value);
    }

    /**
     * Scope a query to only include users of given gender
     * 
     * @param  Builder $query
     * @return Builder
     */
    public function scopeWhereGender(Builder $query, string $gender): Builder
    {
        if (!in_array($gender, Gender::values())) {
            throw new \InvalidArgumentException("Invalid gender value: $gender");
        }

        return $query->where('gender', $gender);
    }

    /**
     * Scope a query to search users based on given search query.
     *
     * @param  Builder $query
     * @param  string|null $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!empty($search)) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('address', function ($q) use ($search) {
                        $q->where('street', 'like', "%{$search}%")
                            ->orWhere('city', 'like', "%{$search}%")
                            ->orWhere('state', 'like', "%{$search}%")
                            ->orWhere('zip', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * Filter and sort users based on given parameters.
     *
     * @param  array<string, mixed>  $params
     * @return LengthAwarePaginator
     */
    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->search($params['search'] ?? '')
            ->when($params['active'], fn($q) => $q->active())
            ->when($params['inactive'], fn($q) => $q->inactive())
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest() // Default sorting by latest created_at date
            )
            ->paginate($params['per_page'] ?? 10);
    }
}
