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
        foreach ($weights as $weight) {
            if (!empty($weight) && $weight > 0) {
                $trend = $trend + (($weight - $trend) / 10);
            }
            $trends[] = $trend > 0 ? round($trend, 1) : null;
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

    public function index(Request $request, $date = null)
    {
        // Get selected month or default to current month
        $selected_date = $date 
            ? Carbon::createFromFormat('Y-m', $date)
            : now();
            
        $current_month_name = $selected_date->format('F Y');
        $prev_month = $selected_date->copy()->subMonth()->format('Y-m');
        $next_month = $selected_date->copy()->addMonth()->format('Y-m');

        // Get all data using the service
        $data = $this->chartDataService->getData($date);

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

    public function getDashboardData()
    {
        $endDate = now()->startOfDay();
        $startDate = $endDate->copy()->subDays(29)->startOfDay();
        
        // Get today's data
        $today = Day::where('user_id', auth()->id())
            ->where('date', $endDate->format('Y-m-d'))
            ->first();
        
        // Get the data using the ChartDataService with explicit date range
        $data = $this->chartDataService->getData(null, [
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d')
        ]);

        // Get the trends and weights arrays safely
        $trends = $data['chartData']['trends'] ?? [];
        $weights = $data['chartData']['weights'] ?? [];
        
        $lastTrend = !empty($trends) ? end($trends) : null;
        $lastWeight = !empty($weights) ? end($weights) : null;
        
        // Calculate the last variation
        $lastVariation = null;
        if ($lastWeight && $lastTrend) {
            $lastVariation = round($lastWeight - $lastTrend, 1);
        }

        // Calculate tracking streak
        $streak = $this->calculateTrackingStreak();

        // Calculate 30-day change and weekly average
        $thirtyDayChange = null;
        $weeklyAverage = null;
        
        if (!empty($trends)) {
            $oldestTrend = $trends[0];
            $latestTrend = end($trends);
            $thirtyDayChange = round($latestTrend - $oldestTrend, 1);
            
            // Calculate weekly average (30 days = ~4.286 weeks)
            $weeklyAverage = round($thirtyDayChange / 4.286, 1);
        }

        return response()->json([
            'days' => $data['days'],
            'stats' => [
                'current_weight' => $lastWeight,
                'current_trend' => $lastTrend,
                'current_variation' => $lastVariation,
                'tracking_streak' => $streak,
                'thirty_day_change' => $thirtyDayChange,
                'weekly_average' => $weeklyAverage,
                'today' => $today ? [
                    'exercise_rung' => $today->exercise_rung,
                    'notes' => $today->notes
                ] : null
            ]
        ]);
    }

    private function calculateTrackingStreak()
    {
        $today = now()->startOfDay();
        $yesterday = $today->copy()->subDay();
        
        // Get all days with any data, ordered by date descending
        $days = Day::where('user_id', auth()->id())
            ->where('date', '<=', $today->format('Y-m-d'))
            ->where(function($query) {
                $query->whereNotNull('weight')
                    ->orWhereNotNull('exercise_rung')
                    ->orWhereNotNull('notes');
            })
            ->orderBy('date', 'desc')
            ->pluck('date');

        if ($days->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $latestDate = Carbon::parse($days->first());
        
        // If the most recent entry is today, start streak at 1
        if ($latestDate->format('Y-m-d') === $today->format('Y-m-d')) {
            $streak = 1;
            $latestDate = $yesterday; // Move to yesterday for the rest of the calculation
        }

        // Continue counting streak from previous days
        foreach ($days as $date) {
            $currentDate = Carbon::parse($date);
            
            // Skip today's entry as we've already counted it
            if ($currentDate->format('Y-m-d') === $today->format('Y-m-d')) {
                continue;
            }
            
            // Check if this date is exactly one day before the latest date
            if ($latestDate->format('Y-m-d') === $currentDate->format('Y-m-d')) {
                $streak++;
                $latestDate = $currentDate->copy()->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    private function calculateWeightChange($trends)
    {
        $validTrends = array_filter($trends);
        if (count($validTrends) < 2) {
            return null;
        }
        
        $firstTrend = reset($validTrends);
        $lastTrend = end($validTrends);
        
        return round($lastTrend - $firstTrend, 1);
    }
} 