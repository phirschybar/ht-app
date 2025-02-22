<?php

namespace App\Http\Controllers;

use App\Models\Day;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Services\WeightTrendService;
use App\Services\ChartDataService;

class DashboardController extends Controller
{
    protected $weightTrendService;
    protected $chartDataService;

    public function __construct(WeightTrendService $weightTrendService, ChartDataService $chartDataService)
    {
        $this->weightTrendService = $weightTrendService;
        $this->chartDataService = $chartDataService;
    }

    private function calculateTrend($weights, $trendCarryForward = 0)
    {
        $trends = [];
        $trend = $trendCarryForward;

        // If no trend carried forward, use first available valid weight
        if ($trend == 0) {
            foreach ($weights as $weight) {
                if (!empty($weight) && $weight > 0) {
                    $trend = $weight;
                    break;
                }
            }
        }

        // Calculate trend using exponential moving average
        if ($trend > 0) {
            foreach ($weights as $date => $weight) {
                if (!empty($weight) && $weight > 0) {
                    // Using same formula as original: trend + ((weight - trend) / 10)
                    $trend = $trend + (($weight - $trend) / 10);
                }
                $trends[$date] = $trend > 0 ? round($trend, 1) : null;
            }
        }

        return $trends;
    }

    private function calculateVariation($weight, $trend, $previousVariation = null)
    {
        // If there's a valid weight, calculate actual variation
        if (!empty($weight) && $weight > 0 && !empty($trend)) {
            return round($weight - $trend, 1);
        }
        
        // If there's no weight but we have a previous variation, carry it forward
        if (!empty($previousVariation)) {
            return $previousVariation;
        }
        
        // If there's no weight and no previous variation but there is a trend,
        // assume we're on trend (variation = 0)
        if (!empty($trend)) {
            return 0;
        }
        
        return null;
    }

    private function getLastTrendFromPreviousMonth($date)
    {
        // Get the last day of previous month that has a trend
        $lastRecord = Day::where('user_id', Auth::id())
            ->where('date', '<', $date->startOfMonth()->format('Y-m-d'))
            ->whereNotNull('weight')
            ->orderBy('date', 'desc')
            ->first();

        if ($lastRecord) {
            // Calculate the trend for the previous month up to this record
            $prevMonthDate = Carbon::parse($lastRecord->date)->startOfMonth();
            $prevMonthRecords = Day::where('user_id', Auth::id())
                ->whereYear('date', $prevMonthDate->year)
                ->whereMonth('date', $prevMonthDate->month)
                ->orderBy('date')
                ->get()
                ->pluck('weight', 'date')
                ->toArray();

            $prevTrends = $this->calculateTrend($prevMonthRecords);
            return end($prevTrends) ?: 0;
        }

        return 0;
    }

    public function index(Request $request)
    {
        // Get selected month or default to current month
        $selected_date = $request->get('date') 
            ? Carbon::createFromFormat('Y-m', $request->get('date'))
            : now();
            
        $current_month_name = $selected_date->format('F Y');
        $prev_month = $selected_date->copy()->subMonth()->format('Y-m');
        $next_month = $selected_date->copy()->addMonth()->format('Y-m');

        // Get all data using the service
        $data = $this->chartDataService->getData($request->get('date'));

        return response()->json([
            'days' => $data['days'],
            'current_month_name' => $current_month_name,
            'prev_month' => $prev_month,
            'next_month' => $next_month,
            'chartData' => $data['chartData']
        ]);
    }

    public function updateDay(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'field' => 'required|in:weight,exercise_rung,notes',
            'value' => 'nullable',
        ]);

        $day = Day::firstOrNew([
            'date' => $validated['date'],
            'user_id' => auth()->id()
        ]);
        $day->{$validated['field']} = $validated['value'];
        $day->save();

        return response()->json(['success' => true]);
    }
} 