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

    public function getData(?string $date = null, array $options = [])
    {
        // If start_date and end_date are provided, use those instead of month-based logic
        if (isset($options['start_date']) && isset($options['end_date'])) {
            $startDate = Carbon::parse($options['start_date']);
            $endDate = Carbon::parse($options['end_date']);
        } else {
            // Original month-based logic
            $selected_date = $date ? Carbon::createFromFormat('Y-m', $date) : now();
            $startDate = $selected_date->copy()->startOfMonth();
            $endDate = $selected_date->copy()->endOfMonth();
        }

        $days = [];
        
        // Iterate through each day in the date range
        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayRecord = Day::where('date', $dateStr)
                           ->where('user_id', Auth::id())
                           ->first();

            $isFutureDate = $currentDate->isAfter(now());
            
            $weight = null;
            if ($dayRecord?->weight !== null) {
                $weight = floor($dayRecord->weight) == $dayRecord->weight 
                    ? number_format($dayRecord->weight, 0) 
                    : number_format($dayRecord->weight, 1);
            }

            // Get trend and variation using recalculateForDate
            $calculations = null;
            if (!$isFutureDate && $dayRecord) {
                $calculations = $this->weightTrendService->recalculateForDate($dateStr);
            }

            $days[] = [
                'day' => (int)$currentDate->format('d'),
                'name' => $currentDate->format('D, jS'),
                'date' => $dateStr,
                'weight' => $weight,
                'trend' => $calculations ? $calculations['trend'] : null,
                'variation' => $calculations ? $calculations['variation'] : null,
                'exercise_rung' => $dayRecord?->exercise_rung,
                'notes' => $dayRecord?->notes,
                'is_editable' => !$isFutureDate,
            ];

            $currentDate->addDay();
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
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d')
            ],
            'days_count' => count($days),
            'first_day' => $days[0] ?? null,
            'last_day' => end($days) ?? null
        ]);

        return [
            'days' => $days,
            'chartData' => $chartData
        ];
    }
} 