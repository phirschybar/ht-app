<?php

namespace App\Services;

use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChartDataService
{
    protected $weightTrendService;

    public function __construct(WeightTrendService $weightTrendService)
    {
        $this->weightTrendService = $weightTrendService;
    }

    public function getData(?string $date = null)
    {
        $selected_date = $date ? Carbon::createFromFormat('Y-m', $date) : now();
        $current_month = $selected_date->format('m');
        $current_year = $selected_date->format('Y');
        $year_month = $current_year . '-' . $current_month;
        $n_days_in_month = $selected_date->daysInMonth;

        $days = [];
        
        // First pass: collect all days
        for ($i = 1; $i <= $n_days_in_month; $i++) {
            $date = $year_month . '-' . str_pad($i, 2, '0', STR_PAD_LEFT);
            $dayRecord = Day::where('date', $date)
                           ->where('user_id', Auth::id())
                           ->first();

            $isFutureDate = Carbon::parse($date)->isAfter(now());
            
            $weight = null;
            if ($dayRecord?->weight !== null) {
                $weight = floor($dayRecord->weight) == $dayRecord->weight 
                    ? number_format($dayRecord->weight, 0) 
                    : number_format($dayRecord->weight, 1);
            }

            // Get trend and variation using recalculateForDate
            $calculations = null;
            if (!$isFutureDate && $dayRecord) {
                $calculations = $this->weightTrendService->recalculateForDate($date);
            }

            $days[] = [
                'day' => $i,
                'name' => date('D, jS', strtotime($date)),
                'date' => $date,
                'weight' => $weight,
                'trend' => $calculations ? $calculations['trend'] : null,
                'variation' => $calculations ? $calculations['variation'] : null,
                'exercise_rung' => $dayRecord?->exercise_rung,
                'notes' => $dayRecord?->notes,
                'is_editable' => !$isFutureDate,
            ];
        }

        $chartData = [
            'labels' => array_map(function($day) {
                return date('j', strtotime($day['date']));
            }, $days),
            'weights' => array_map(function($day) {
                return $day['weight'] ? floatval(str_replace(',', '', $day['weight'])) : null;
            }, $days),
            'trends' => array_map(function($day) {
                return $day['trend'] ? floatval($day['trend']) : null;
            }, $days)
        ];

        Log::info('Final chart data', [
            'chartData' => $chartData
        ]);

        return [
            'days' => $days,
            'chartData' => $chartData
        ];
    }
} 