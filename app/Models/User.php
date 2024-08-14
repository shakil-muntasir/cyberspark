<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
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
        'status' => UserStatus::class
    ];


    public function address(): HasOne
    {
        return $this->hasOne(Address::class, 'user_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'created_by');
    }

    public function users(): HasMany
    {
        return $this->hasMany(self::class, 'created_by');
    }

    public function creator()
    {
        return $this->belongsTo(self::class, 'created_by');
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
                    })
                    ->orWhereHas('creator', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
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
            ->orderBy($params['sort_by'] ?? 'id', $params['sort_to'] ?? 'asc')
            ->paginate($params['per_page'] ?? 10);
    }
}
