import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const Productivity_Worker = ({ data = {} }) => {
  // Transform data for recharts
  const transformedData = Object.entries(data).map(([name, metrics]) => ({
    name,
    average_d_t: metrics.average_d_t || 0,
    average_fr_t: metrics.average_fr_t || 0,
    average_l_t: metrics.average_l_t || 0,
    average_lines: metrics.average_lines || 0,
    average_quantity: metrics.average_quantity || 0,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart configuration
  const chartConfig = {
    margin: { top: 20, right: 30, left: 20, bottom: 80 },
    height: 400,
  };

  const metrics = [
    {
      key: 'average_d_t',
      title: 'Average Drop Time',
      color: '#8b5cf6',
      bgGradient: 'from-purple-50 to-purple-100',
      type: 'bar'
    },
    {
      key: 'average_fr_t',
      title: 'Average Free Time',
      color: '#06b6d4',
      bgGradient: 'from-cyan-50 to-cyan-100',
      type: 'line'
    },
    {
      key: 'average_l_t',
      title: 'Average Load Time',
      color: '#10b981',
      bgGradient: 'from-emerald-50 to-emerald-100',
      type: 'area'
    },
    {
      key: 'average_lines',
      title: 'Average Lines',
      color: '#f59e0b',
      bgGradient: 'from-amber-50 to-amber-100',
      type: 'bar'
    },
    {
      key: 'average_quantity',
      title: 'Average Quantity',
      color: '#ef4444',
      bgGradient: 'from-red-50 to-red-100',
      type: 'area'
    }
  ];

  if (Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      </div>
    );
  }

  const renderChart = (metric) => {
    const ChartComponent = metric.type === 'line' ? LineChart : 
                          metric.type === 'area' ? AreaChart : BarChart;
    
    return (
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <ChartComponent data={transformedData} margin={chartConfig.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {metric.type === 'line' && (
            <Line 
              type="monotone" 
              dataKey={metric.key} 
              stroke={metric.color}
              strokeWidth={3}
              dot={{ fill: metric.color, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: metric.color }}
            />
          )}
          
          {metric.type === 'area' && (
            <Area 
              type="monotone" 
              dataKey={metric.key} 
              stroke={metric.color}
              strokeWidth={2}
              fill={metric.color}
              fillOpacity={0.3}
            />
          )}
          
          {metric.type === 'bar' && (
            <Bar 
              dataKey={metric.key} 
              fill={metric.color}
              radius={[4, 4, 0, 0]}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Worker Productivity Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive analysis of worker performance metrics
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
              📈 {Object.keys(data).length} Workers Analyzed
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8">
          {metrics.map((metric) => (
            <div 
              key={metric.key}
              className={`bg-gradient-to-br ${metric.bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
            >
              <div className="flex items-center mb-6">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: metric.color }}
                ></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {metric.title}
                </h2>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 bg-white/60 rounded-full text-gray-600 uppercase tracking-wide">
                    {metric.type}
                  </span>
                </div>
              </div>
              
              <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <div style={{ minWidth: Math.max(800, transformedData.length * 60) }}>
                    {renderChart(metric)}
                  </div>
                </div>
              </div>
              
              {/* Metric Summary */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>
                  Max: {Math.max(...transformedData.map(d => d[metric.key])).toFixed(2)}
                </span>
                <span>
                  Avg: {(transformedData.reduce((acc, d) => acc + d[metric.key], 0) / transformedData.length).toFixed(2)}
                </span>
                <span>
                  Min: {Math.min(...transformedData.map(d => d[metric.key])).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            📊 Dataset Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(data).length}
              </div>
              <div className="text-sm text-gray-600">Total Workers</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...transformedData.map(d => d.average_quantity)).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Max Quantity</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...transformedData.map(d => d.average_lines)).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Max Lines</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Metrics Tracked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity_Worker;