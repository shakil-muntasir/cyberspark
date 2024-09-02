<?php

namespace App\Models;

use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Str;

class Category extends Model
{
    use HasFactory, HasUserTracking, SoftDeletes;

    protected $fillable = ['name'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get all category options as an associative array with 'label' and 'value'.
     *
     * @return array
     */
    public static function getAllOptions(): array
    {
        return self::all()->map(function ($category) {
            return [
                'label' => Str::title(str_replace('_', ' ', $category->name)),
                'value' => (string) $category->id,
            ];
        })->toArray();
    }
}
