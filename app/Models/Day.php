<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    protected $fillable = ['date', 'weight', 'exercise_rung', 'notes', 'user_id'];
    
    protected $casts = [
        'date' => 'date',
        'weight' => 'decimal:2',
        'exercise_rung' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
