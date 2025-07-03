import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer,Cell } from "recharts";

const DnPerformance = ({ data, name, name_list }) => {
  const [selectedMetricBar, setSelectedMetricBar] = useState(name_list?.[0] || '');
  const [selectedMetricStats, setSelectedMetricStats] = useState(name_list?.[1] || '');
  const [selectedMetricLine, setSelectedMetricLine] = useState(name_list?.[0] || '');

  // Extract summary data
  const summaryData = useMemo(() => {
    if (!data || !name_list) return [];
    return name_list.map(metric => ({
      metric,
      value: data[metric] || 0,
      avg_value: data[metric]/data["dn_count"] || 0
    }));
  }, [data, name_list]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    if (!data?.load_data || !selectedMetricBar) return [];
    
    return Object.entries(data.load_data).map(([date, categories]) => {
      const chartData = { date };
      Object.entries(categories).forEach(([category, values]) => {
        const index = name_list.indexOf(selectedMetricBar);
        chartData[category] = values[index] || 0;
      });
      return chartData;
    });
  }, [data, selectedMetricBar, name_list]);

  // Prepare statistics data
  const statsData = useMemo(() => {
    if (!data?.priority_data || !selectedMetricStats || selectedMetricStats === 'dn_count') return [];
    
    const index = name_list.indexOf(selectedMetricStats);
    // const dnCount = data.dn_count || 1;
    
    const stats = [];
    
      Object.entries(data?.priority_data).forEach(([category, values]) => {
        const total = values[index] || 0;
        const average = total / values[0];
        stats.push({
          category,
          total: total.toFixed(2),
          average: average.toFixed(2)
        });
      });
    
    return stats;
  }, [data, selectedMetricStats, name_list]);

  // Prepare line chart data
  // Prepare line chart data
const lineChartData = useMemo(() => {
    if (!data?.load_data || !selectedMetricLine) return [];
  
    const index = name_list.indexOf(selectedMetricLine);
  
    return Object.entries(data.load_data).map(([date, categories]) => {
      const point = { date };
      Object.entries(categories).forEach(([category, values]) => {
        point[category] = values[index] || 0;
      });
      return point;
    });
  }, [data, selectedMetricLine, name_list]);
  
  // Prepare table data
  const tableData = useMemo(() => {
    if (!data?.load_data) return [];
    
    const allCategories = new Set();
    const allDates = Object.keys(data.load_data);
    
    // Collect all categories
    Object.values(data.load_data).forEach(dateData => {
      Object.keys(dateData).forEach(category => {
        allCategories.add(category);
      });
    });
    
    return Array.from(allCategories).map(category => {
      const row = { category };
      allDates.forEach(date => {
        const index = name_list.indexOf(selectedMetricStats);
        const values = data.load_data[date]?.[category];
        row[date] = values?.[index] || 0;
      });
      return row;
    });
  }, [data, selectedMetricStats, name_list]);

  const allDates = data?.load_data ? Object.keys(data.load_data) : [];

  if (!data || !name_list) {
    return <div className="p-8 text-center text-gray-500">No data available</div>;
  }

  const [showAverage, setShowAverage] = useState({});

const toggleValue = (metric) => {
  setShowAverage(prev => ({
    ...prev,
    [metric]: !prev[metric]
  }));
};

const formatValue = (value, metric) => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

const formatMetricName = (metric) => {
  return metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DN Performance Dashboard</h1>
          <p className="text-gray-600">Dataset: {name}</p>
        </div>




        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {summaryData.map(({ metric, value, avg_value }) => {
    const isToggled = showAverage[metric];
    const displayValue = isToggled ? avg_value : value;
    
    return (
      <div key={metric} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100">
        {metric === "dn_count" ? (
          // Static card for dn_count
          <>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              {formatMetricName(metric)}
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatValue(value, metric)}
            </p>
          </>
        ) : (
          // Toggle card for other metrics
          <>
            <button 
              onClick={() => toggleValue(metric)}
              className="w-full text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded px-2 py-1"
            >
              {formatMetricName(metric)}
              <span className="block text-xs normal-case text-gray-400 mt-1">
                {isToggled ? 'Average' : 'Current'}
              </span>
            </button>
            
            <div className="relative overflow-hidden">
              <p className={`text-3xl font-bold transition-all duration-300 ${
                isToggled ? 'text-green-600' : 'text-blue-600'
              }`}>
                {formatValue(displayValue, metric)}
              </p>
            </div>
            
            {/* Toggle indicator */}
            <div className="flex justify-center mt-3">
              <div className="flex bg-gray-100 rounded-full p-1">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  !isToggled ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className={`w-3 h-3 rounded-full ml-1 transition-all duration-300 ${
                  isToggled ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
            </div>

          </>
        )}
      </div>
    );
  })}
</div>


        {/* Bar Chart Section */}
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-gray-800">Performance by Category</h2>
    <select
      value={selectedMetricBar}
      onChange={(e) => setSelectedMetricBar(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {name_list.map(metric => (
        <option key={metric} value={metric}>
          {metric.replace(/_/g, ' ').toUpperCase()}
        </option>
      ))}
    </select>
  </div>

  {/* Scrollable Bar Chart Container */}
  <div className="overflow-x-auto">
    <div style={{ width: `${Math.max(barChartData.length * 80, 700)}px`, height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barChartData}
          barCategoryGap={20} // adds spacing between bar groups
          barGap={5} // adds spacing between bars in the same group
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(data.priority_data || {}).map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={`hsl(${index * 60}, 70%, 50%)`}
              name={category}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Statistics Overview</h2>
            <select
              value={selectedMetricStats}
              onChange={(e) => setSelectedMetricStats(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {name_list.filter(metric => metric !== 'dn_count').map(metric => (
                <option key={metric} value={metric}>
                  {metric.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          {statsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsData.map((stat, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">{stat.category}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-sm font-medium">{stat.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average:</span>
                      <span className="text-sm font-medium">{stat.average}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        {statsData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Values by Category</h3>
            <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={statsData.map(stat => ({
                    category: stat.category,
                    average: isNaN(Number(stat.average)) ? 0 : Number(stat.average)
                }))}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                    dataKey="category" 
                    stroke="#666"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                />
                <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                    formatter={(value) => [Number(value).toLocaleString(), 'Average']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Bar 
                    dataKey="average" 
                    radius={[4, 4, 0, 0]}
                    stroke="#333"
                    strokeWidth={1}
                >
                    {statsData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${(index * 360) / statsData.length}, 70%, 60%)`}
                    />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
        )}



        </div>
     

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  {allDates.map(date => (
                    <th key={date} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.category}
                    </td>
                    {allDates.map(date => (
                      <td key={date} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof row[date] === 'number' ? row[date].toLocaleString() : row[date]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Trend Analysis</h2>
            <select
              value={selectedMetricLine}
              onChange={(e) => setSelectedMetricLine(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {name_list.map(metric => (
                <option key={metric} value={metric}>
                  {metric.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(data.priority_data || {}).map((category, index) => (
                <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={`hsl(${(index * 360) / Object.keys(data.priority_data).length}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={category}
                />
                ))}
            </LineChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DnPerformance;