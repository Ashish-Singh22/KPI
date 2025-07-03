import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DpmoPerformance = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState("t_claim");
  
  const name_list = ["t_claim", "t_quantity", "t_claim_value"];
  
  // Calculate acceptance rate
  const acceptanceRate = data.t_claim > 0 ? ((data.t_accepted_claim / data.t_claim) * 100).toFixed(2) : 0;

  // Prepare table data from load_data with grouped areas
  const prepareTableData = () => {
    const groupedData = {};
    
    // First, group all data by area and rowLabel
    Object.keys(data.load_data).forEach(area => {
      if (!groupedData[area]) {
        groupedData[area] = {};
      }
      
      Object.keys(data.load_data[area]).forEach(rowLabel => {
        if (!groupedData[area][rowLabel]) {
          groupedData[area][rowLabel] = [];
        }
        
        Object.keys(data.load_data[area][rowLabel]).forEach(subCategory => {
          const values = data.load_data[area][rowLabel][subCategory];
          groupedData[area][rowLabel].push({
            subCategory,
            t_claim: values[0],
            t_quantity: values[1],
            t_claim_value: values[2]
          });
        });
      });
    });
    
    // Convert to table rows with area spanning
    const tableRows = [];
    
    Object.keys(groupedData).forEach(area => {
      let areaFirstRow = true;
      let areaRowCount = 0;
      
      // Count total rows for this area
      Object.keys(groupedData[area]).forEach(rowLabel => {
        areaRowCount += groupedData[area][rowLabel].length;
      });
      
      Object.keys(groupedData[area]).forEach(rowLabel => {
        let rowLabelFirstRow = true;
        const rowLabelRowCount = groupedData[area][rowLabel].length;
        
        groupedData[area][rowLabel].forEach(item => {
          tableRows.push({
            area: areaFirstRow ? area : null,
            areaSpan: areaFirstRow ? areaRowCount : 0,
            rowLabel: rowLabelFirstRow ? rowLabel : null,
            rowLabelSpan: rowLabelFirstRow ? rowLabelRowCount : 0,
            subCategory: item.subCategory,
            t_claim: item.t_claim,
            t_quantity: item.t_quantity,
            t_claim_value: item.t_claim_value
          });
          areaFirstRow = false;
          rowLabelFirstRow = false;
        });
      });
    });
    
    return tableRows;
  };

  // Prepare bar chart data
  const prepareBarChartData = () => {
    return Object.keys(data.bar_data).map(key => ({
      name: key,
      t_claim: data.bar_data[key][0],
      t_quantity: data.bar_data[key][1],
      t_claim_value: data.bar_data[key][2]
    }));
  };

  const tableData = prepareTableData();
  const barChartData = prepareBarChartData();

  const formatValue = (value, metric) => {
    if (metric === "t_claim_value") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(value);
    }
    return value?.toLocaleString() || 0;
  };

  const getMetricLabel = (metric) => {
    switch(metric) {
      case "t_claim": return "Total Claims";
      case "t_quantity": return "Total Quantity";
      case "t_claim_value": return "Total Claim Value";
      default: return metric;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">DPMO Performance Dashboard</h1>
        
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Claims</h3>
            <p className="text-2xl font-bold text-blue-600">{data.t_claim?.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Accepted Claims</h3>
            <p className="text-2xl font-bold text-green-600">{data.t_accepted_claim?.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Acceptance Rate</h3>
            <p className="text-2xl font-bold text-purple-600">{acceptanceRate}%</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Quantity</h3>
            <p className="text-2xl font-bold text-orange-600">{data.t_quantity?.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Claim Value</h3>
            <p className="text-lg font-bold text-red-600">${data.t_claim_value?.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Accepted Value</h3>
            <p className="text-lg font-bold text-emerald-600">${data.t_accepted_claim_value?.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric Selection */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Metric to Display:</h3>
          <div className="flex flex-wrap gap-2">
            {name_list.map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getMetricLabel(metric)}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <h2 className="text-xl font-semibold">Detailed Breakdown - {getMetricLabel(selectedMetric)}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row Label</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{getMetricLabel(selectedMetric)}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {row.area && (
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize border-r border-gray-200 bg-blue-50" 
                        rowSpan={row.areaSpan}
                      >
                        {row.area}
                      </td>
                    )}
                    {row.rowLabel && (
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 uppercase border-r border-gray-200 bg-gray-50" 
                        rowSpan={row.rowLabelSpan}
                      >
                        {row.rowLabel}
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 uppercase">
                      {row.subCategory}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatValue(row[selectedMetric], selectedMetric)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Overview Chart - {getMetricLabel(selectedMetric)}</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (selectedMetric === "t_claim_value") {
                      return `$${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toLocaleString();
                  }}
                />
                <Tooltip 
                  formatter={(value) => [formatValue(value, selectedMetric), getMetricLabel(selectedMetric)]}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Bar 
                  dataKey={selectedMetric} 
                  fill="#3B82F6" 
                  name={getMetricLabel(selectedMetric)}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DpmoPerformance