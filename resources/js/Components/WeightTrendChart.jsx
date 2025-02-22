import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeightTrendChart({ days }) {
    // Map all days, keeping nulls for missing data
    const chartData = days.map(day => ({
        name: parseInt(day.date.split('-')[2]), // Convert to integer to remove leading zeros
        weight: day.weight || null,
        trend: day.trend || null
    }));

    // Calculate min and max values for Y axis (only from days with data)
    const allValues = chartData.flatMap(data => [data.weight, data.trend].filter(Boolean));
    const minValue = Math.floor(Math.min(...allValues)); // Round down to integer
    const maxValue = Math.ceil(Math.max(...allValues)); // Round up to integer
    const padding = 1; // Use 1 unit padding instead of percentage

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 5,
                        left: -30,
                        bottom: 20
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        angle={0}
                        height={30}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                        stroke="#9CA3AF"
                        domain={[minValue - padding, maxValue + padding]}
                        tickCount={maxValue - minValue + 3}
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #4B5563',
                            borderRadius: '0.375rem'
                        }}
                        labelStyle={{ color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                    />
                    {/* Add vertical reference lines */}
                    {chartData.map((point, index) => (
                        point.weight && point.trend && (
                            <ReferenceLine
                                key={`ref-${index}`}
                                segment={[
                                    { x: point.name, y: point.weight },
                                    { x: point.name, y: point.trend }
                                ]}
                                stroke="#FFFFFF"
                                strokeWidth={2}
                                ifOverflow="visible"
                            />
                        )
                    ))}
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#FFFFFF"
                        dot={{ r: 4 }}
                        strokeWidth={0}
                        connectNulls={false}
                        name="Weight"
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#60A5FA"
                        dot={{ r: 4 }}
                        strokeWidth={2}
                        connectNulls={true}
                        name="Trend"
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
} 