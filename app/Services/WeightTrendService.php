<?php

namespace App\Services;

use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class WeightTrendService
{
    public function calculateTrend($weights, $trendCarryForward = 0)
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
                    $trend = $trend + (($weight - $trend) / 10);
                }
                $trends[$date] = $trend > 0 ? round($trend, 1) : null;
            }
        }

        return $trends;
    }

    public function calculateVariation($weight, $trend, $previousVariation = null)
    {
        if (!empty($weight) && $weight > 0 && !empty($trend)) {
            return round($weight - $trend, 1);
        }
        
        if (!empty($previousVariation)) {
            return $previousVariation;
        }
        
        if (!empty($trend)) {
            return 0;
        }
        
        return null;
    }

    public function recalculateForDate($date)
    {
        // Get the start of the month for the given date
        $startOfMonth = Carbon::parse($date)->startOfMonth();
        
        // Get all weights for the month
        $weights = Day::where('user_id', Auth::id())
            ->whereYear('date', $startOfMonth->year)
            ->whereMonth('date', $startOfMonth->month)
            ->orderBy('date')
            ->pluck('weight', 'date')
            ->toArray();

        // Get trend carry-forward from previous month
        $trendCarryForward = $this->getLastTrendFromPreviousMonth($startOfMonth);
        
        // Calculate all trends for the month
        $trends = $this->calculateTrend($weights, $trendCarryForward);
        
        // Find the previous variation
        $previousVariation = null;
        foreach ($weights as $currentDate => $weight) {
            if ($currentDate >= $date) {
                break;
            }
            if (!empty($weight) && $weight > 0) {
                $previousVariation = $this->calculateVariation($weight, $trends[$currentDate] ?? null);
            }
        }

        // Calculate new trend and variation for the specific date
        $trend = $trends[$date] ?? null;
        $variation = $this->calculateVariation($weights[$date] ?? null, $trend, $previousVariation);

        return [
            'trend' => $trend,
            'variation' => $variation
        ];
    }

    private function getLastTrendFromPreviousMonth($date)
    {
        $lastRecord = Day::where('user_id', Auth::id())
            ->where('date', '<', $date->format('Y-m-d'))
            ->whereNotNull('weight')
            ->orderBy('date', 'desc')
            ->first();

        if ($lastRecord) {
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
} 