import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeightTrendChart({ days }) {
    
    // Map all days, keeping nulls for missing data
    const chartData = days.map((day, index) => {
        const date = new Date(day.date);
        return {
            name: date.getDate(),
            fullDate: day.date,
            weight: day.weight || null,
            trend: day.trend || null,
            index: days.length - index  // Revert back to original index calculation
        };
    }).reverse();  // Reverse the array after mapping

    // Check if there's any weight data at all
    const hasData = chartData.some(day => day.weight !== null);
    
    // If no data, don't render the chart
    if (!hasData) {
        return null;
    }

    // Calculate min and max values for Y axis (only from days with data)
    const allValues = chartData.flatMap(data => [data.weight, data.trend].filter(Boolean));
    const minValue = Math.floor(Math.min(...allValues));
    const maxValue = Math.ceil(Math.max(...allValues));
    const padding = 1;

    const options = {
        chart: {
            id: 'weight-trend',
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            },
            background: '#1f2937'
        },
        grid: {
            show: true,
            borderColor: '#374151',
            strokeDashArray: 1,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        xaxis: {
            type: 'numeric',
            tickAmount: days.length,
            labels: {
                formatter: function(value) {
                    const date = new Date(days[Math.floor(value) - 1]?.date);
                    return date ? `${date.getDate()}` : '';
                },
                style: {
                    colors: '#9ca3af'
                }
            },
            tooltip: {
                enabled: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tickFormatter: (value) => {
                const dayIndex = chartData.findIndex(d => d.name === value);
                if (dayIndex >= 0 && days[dayIndex]) {
                    const date = new Date(days[dayIndex].date);
                    return date.getDate();
                }
                return '';
            },
            interval: 0
        },
        yaxis: {
            title: {
                text: 'Weight'
            },
            min: minValue - padding,
            max: maxValue + padding,
            tickCount: maxValue - minValue + 3,
            allowDecimals: false,
            labels: {
                style: {
                    colors: '#9ca3af'
                }
            }
        },
        series: [
            {
                name: 'Weight',
                type: 'line',
                data: chartData.map(data => ({
                    x: data.name,
                    y: data.weight
                })),
                color: '#FFFFFF'
            },
            {
                name: 'Trend',
                type: 'line',
                data: chartData.map(data => ({
                    x: data.name,
                    y: data.trend
                })),
                color: 'rgb(255, 99, 132)'
            }
        ],
        stroke: {
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ['#374151'],
                inverseColors: true,
                opacityFrom: 0.8,
                opacityTo: 0
            }
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            x: {
                format: 'dd MMM'
            },
            y: {
                formatter: function(value) {
                    return value.toFixed(2);
                }
            }
        },
        legend: {
            position: 'top'
        },
        background: '#1f2937'
    };

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
                        dataKey="index"
                        stroke="#9CA3AF"
                        angle={0}
                        height={30}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => {
                            const day = chartData.find(d => d.index === value);
                            if (day) {
                                const date = new Date(day.fullDate);
                                date.setDate(date.getDate() + 1); // Add one day to fix alignment
                                return date.getDate();
                            }
                            return '';
                        }}
                        domain={['dataMin', 'dataMax']}
                        type="number"
                        reversed={true}
                        interval={0}
                        ticks={chartData.map(d => d.index)}
                    />
                    <YAxis 
                        stroke="#9CA3AF"
                        domain={[minValue - padding, maxValue + padding]}
                        tickCount={maxValue - minValue + 3}
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                    />
                    {/* Add vertical reference lines */}
                    {chartData.map((point, index) => (
                        point.weight && point.trend && (
                            <ReferenceLine
                                key={`ref-${index}`}
                                segment={[
                                    { x: point.index, y: point.weight },
                                    { x: point.index, y: point.trend }
                                ]}
                                stroke={point.weight > point.trend ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)'}
                                strokeWidth={2}
                                ifOverflow="visible"
                            />
                        )
                    ))}
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#FFFFFF"
                        dot={(props) => {
                            if (props.payload.weight && props.payload.trend) {
                                const color = props.payload.weight > props.payload.trend 
                                    ? 'rgb(255, 99, 132)'  // Above trend - red
                                    : 'rgb(75, 192, 192)'  // Below trend - green
                                return <circle 
                                    cx={props.cx} 
                                    cy={props.cy} 
                                    r={3} 
                                    fill={color} 
                                />
                            }
                            return null;
                        }}
                        strokeWidth={0}
                        connectNulls={false}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="rgb(255, 99, 132)"
                        dot={(props) => {
                            if (props.payload.weight && props.payload.trend) {
                                const color = props.payload.weight > props.payload.trend 
                                    ? 'rgb(255, 99, 132)'  // Weight above trend - red
                                    : 'rgb(75, 192, 192)'  // Weight below trend - green
                                return <circle 
                                    cx={props.cx} 
                                    cy={props.cy} 
                                    r={3} 
                                    fill={color} 
                                />
                            }
                            return null;
                        }}
                        strokeWidth={2}
                        connectNulls={true}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
} 