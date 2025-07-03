import React, { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const KpiInventory = () => {
const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, showYear] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isTransposed, setIsTransposed] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Refs for capturing sections
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const tableRef = useRef(null);
  const chartRef = useRef(null);

  const weekOptions = ["1", "2", "3", "4", "All"];
  const monthOptions = [
    { name: "January", value: "1" }, { name: "February", value: "2" },
    { name: "March", value: "3" }, { name: "April", value: "4" },
    { name: "May", value: "5" }, { name: "June", value: "6" },
    { name: "July", value: "7" }, { name: "August", value: "8" },
    { name: "September", value: "9" }, { name: "October", value: "10" },
    { name: "November", value: "11" }, { name: "December", value: "12" }
  ];
  const month_dict = {
    "1":"January",
    "2":"February",
    "3":"March",
    "4":"April",
    "5":"May",
    "6":"June",
    "7":"July",
    "8":"August",
    "9":"September",
    "10":"October",
    "11":"November",
    "12":"December"
  }
  const organizationOptions = ["D9M", "D9N", "AC1", "AP2"];

  const handleWeekChange = (week) => {
    if (week === "All") {
      setSelectedWeeks(selectedWeeks.includes("All") ? [] : ["All"]);
    } else {
      const newWeeks = selectedWeeks.filter(w => w !== "All");
      setSelectedWeeks(
        newWeeks.includes(week) ? newWeeks.filter(w => w !== week) : [...newWeeks, week]
      );
    }
  };

  const fetchYearData = async() => {
    try {
      const response = await fetch(SummaryApi.findInventory.url, {
        method: SummaryApi.findInventory.method,
        credentials: "include",
        body: JSON.stringify({ weeks: ["All"], month: "All", organization: selectedOrganization }),
        headers: { "Content-Type": "application/json" }
      });
     
      const dataResponse = await response.json();
      if (dataResponse.success) {
        const yearData = dataResponse?.data;
        return yearData;
      } else {
        toast.error(dataResponse?.message || "Year data fetch failed");
        return [];
      }
    } catch (err) {
      console.error("Error fetching year data:", err);
      return [];
    }
  }

  const fetchInventoryData = async () => {
    if (!selectedMonth || !selectedOrganization || selectedWeeks.length === 0) {
      setError("Please select all filters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const numericWeeks = selectedWeeks.includes("All") ? ["1", "2", "3", "4", "All"] : selectedWeeks;
      const numericMonth = parseInt(selectedMonth);
      const organization = selectedOrganization;
      
      const response = await fetch(SummaryApi.findInventory.url, {
        method: SummaryApi.findInventory.method,
        credentials: "include",
        body: JSON.stringify({ weeks: numericWeeks, month: numericMonth, organization }),
        headers: { "Content-Type": "application/json" }
      });
     
      const dataResponse = await response.json();
      if (dataResponse.success) {
        let combinedData = dataResponse?.data || [];
        
        // If year is checked, fetch year data and append it
        if (year) {
          const yearData = await fetchYearData();
          if (yearData.length > 0) {
            combinedData = [...combinedData, ...yearData];
          }
        }
        setInventoryData(combinedData);
        toast.success(dataResponse?.message || "Database Updated successfully");
        setLoading(false);
      } else {
        toast.error(dataResponse?.message || "Database Update failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

 const prepareChartData = () => {
  // Filter out year data for chart as it might not be suitable for week-based chart
  const weeklyData = inventoryData.filter(item => !item.isYearData);

  return weeklyData.map(item => {
    let name = "";

    if (item.week === "All" && item.month === "All") {
      name = "Year" ; // Add fallback for year if available
    } else if (item.week === "All" && item.month !== "All") {
      name = month_dict[item?.month]; // Prefer monthName if present
    } else {
      name = `Week ${item.week}`;
    }

    return {
      name,
      "Locator Accuracy": Number(item["Locator Accuracy"]),
      "Piece Accuracy": Number(item["Piece Accuracy"]),
      "Net Accuracy": Number(item["Net Accuracy"]),
      "Gross Accuracy": Number(item["Gross Accuracy"])
    };
  });
};


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    let sortableData = [...inventoryData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const getFilteredData = () => {
    const sortedData = getSortedData();
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);

  const exportToCSV = () => {
    const data = getFilteredData();
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).filter(key => key !== '_id' && key !== 'isYearData');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const transposeTable = () => {
    setIsTransposed(!isTransposed);
  };

  const getTransposedData = () => {
    if (!isTransposed || inventoryData.length === 0) return inventoryData;
    
    const headers = Object.keys(inventoryData[0]).filter(key => key !== '_id' && key !== 'isYearData');
    const transposedData = [];

    headers.forEach(header => {
      const row = { metric: header };
      inventoryData.forEach((item, index) => {
        // Check if it's year data based on both week and month being "All"
        const isYearData = item.isYearData || (item.week === "All" && item.month === "All");
        const columnName = isYearData ? 'Year' : `Week_${item.week}`;
        row[columnName] = item[header];
      });
      transposedData.push(row);
    });

    return transposedData;
  };

 const renderTable = () => {
    const dataToRender = isTransposed ? getTransposedData() : getPaginatedData();
    if (dataToRender.length === 0) return null;

    // Filter out ID column when not transposed
    const headers = Object.keys(dataToRender[0])
      .filter(key => key !== 'isYearData')
      .filter(key => isTransposed || key !== '_id'); // Remove _id in original form

    // Helper function to get min/max values
    const getMinMaxValues = () => {
      const minMax = {};
      const allData = isTransposed ? getTransposedData() : getFilteredData();
      
      if (isTransposed) {
        // For transposed view: calculate min/max for each row (metric)
        allData.forEach((item, rowIndex) => {
          const values = headers
            .map(header => item[header])
            .filter(val => typeof val === 'number' && !isNaN(val));
          
          if (values.length > 0) {
            minMax[rowIndex] = {
              min: Math.min(...values),
              max: Math.max(...values)
            };
          }
        });
      } else {
        // For original view: calculate min/max for each column
        headers.forEach(header => {
          const values = allData
            .map(item => item[header])
            .filter(val => typeof val === 'number' && !isNaN(val));
          
          if (values.length > 0) {
            minMax[header] = {
              min: Math.min(...values),
              max: Math.max(...values)
            };
          }
        });
      }
      
      return minMax;
    };

    const minMaxValues = getMinMaxValues();

    // Helper function to get color class based on value position
    const getValueColorClass = (value, header, rowIndex = null) => {
      if (typeof value !== 'number') return '';
      
      let minMaxData;
      if (isTransposed) {
        // For transposed view: use row-based min/max
        minMaxData = minMaxValues[rowIndex];
      } else {
        // For original view: use column-based min/max
        minMaxData = minMaxValues[header];
      }
      
      if (!minMaxData) return '';
      
      const { min, max } = minMaxData;
      if (min === max) return ''; // No variation in values
      
      if (value === max) {
        return 'bg-green-100 text-green-800 border-green-200';
      } else if (value === min) {
        return 'bg-red-100 text-red-800 border-red-200';
      }
      return '';
    };

    return (
      <div ref={tableRef} className="overflow-hidden rounded-xl shadow-2xl bg-white">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">📊 Inventory Analytics</h2>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="🔍 Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:border-white/50 transition-all duration-300"
              />
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm focus:outline-none focus:border-white/50 transition-all duration-300"
              >
                <option value={5} className="text-gray-800">5 rows</option>
                <option value={10} className="text-gray-800">10 rows</option>
                <option value={25} className="text-gray-800">25 rows</option>
                <option value={50} className="text-gray-800">50 rows</option>
              </select>
              <button
                onClick={transposeTable}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                🔄 {isTransposed ? 'Original' : 'Transpose'}
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                📥 Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                {headers.map((header, index) => (
                  <th
                    key={header}
                    onClick={() => !isTransposed && handleSort(header)}
                    className={`px-6 py-4 text-left font-bold text-gray-800 uppercase tracking-wider text-sm border-b-2 border-gray-200 ${
                      !isTransposed ? 'cursor-pointer hover:bg-gray-200 transition-colors duration-200' : ''
                    } ${index === 0 ? 'sticky left-0 bg-gray-100 z-10' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{header.replace(/_/g, ' ')}</span>
                      {!isTransposed && sortConfig.key === header && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((item, rowIndex) => {
                // Check if it's year data based on both conditions
                const isYearData = item.isYearData || (item.week === "All" && item.month === "All");
                
                return (
                  <tr
                    key={item._id || rowIndex}
                    className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.01] border-b border-gray-100 ${
                      isYearData ? 'bg-yellow-50' : ''
                    }`}
                  >
                    {headers.map((header, colIndex) => (
                      <td
                        key={header}
                        className={`px-6 py-4 text-gray-800 ${colIndex === 0 ? 'sticky left-0 bg-white z-10 font-semibold' : ''} ${
                          isYearData && colIndex === 0 ? 'bg-yellow-50' : ''
                        }`}
                      >
                       {header === 'week' || header === 'metric' || header === 'month' ? (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isYearData ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                  {header === 'week'
                                  ? isYearData
                                    ? 'Year'
                                    : item[header] === 'All'
                                      ? month_dict[selectedMonth]
                                      : `Week ${item[header]}`
                                  : header === 'month'
                                  ? isYearData
                                    ? 'All'
                                    : month_dict[selectedMonth]
                                  : item[header]}
                              </span>
                        ) : typeof item[header] === 'number' && header.includes('Accuracy') ? (
                            <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isYearData 
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                    : (() => {
                                        const minMaxData = isTransposed ? minMaxValues[rowIndex] : minMaxValues[header];
                                        return item[header] === minMaxData?.max
                                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                                          : item[header] === minMaxData?.min
                                            ? 'bg-gradient-to-r from-red-400 to-red-600'
                                            : 'bg-gradient-to-r from-blue-400 to-blue-500';
                                      })()
                                }`}
                                style={{ width: `${Math.min(item[header], 100)}%` }}
                              ></div>
                            </div>
                            <span className={`font-semibold text-sm px-2 py-1 rounded-full border ${
                              (() => {
                                const minMaxData = isTransposed ? minMaxValues[rowIndex] : minMaxValues[header];
                                return item[header] === minMaxData?.max
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : item[header] === minMaxData?.min
                                    ? 'bg-red-100 text-red-800 border-red-200'
                                    : '';
                              })()
                            }`}>
                              {Number(item[header]).toFixed(2)}%
                            </span>
                          </div>
                        ) : typeof item[header] === 'number' && header.includes('Vacancies') ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            getValueColorClass(item[header], header, rowIndex) || 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {Number(item[header]).toFixed(2)}%
                          </span>
                        ) : typeof item[header] === 'number' ? (
                          <span className={`font-mono font-semibold px-3 py-1 rounded-lg border transition-all duration-200 ${
                            getValueColorClass(item[header], header, rowIndex) || 'text-blue-600 bg-blue-50 border-blue-200'
                          }`}>
                            {Number(item[header]).toLocaleString()}
                          </span>
                        ) : header === '_id' && isTransposed ? (
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item[header]}
                          </span>
                        ) : (
                          <span>{item[header]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isTransposed && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600 flex items-center gap-4">
                <span>
                  Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, getFilteredData().length)} of {getFilteredData().length} entries
                  {getFilteredData().length !== inventoryData.length && ` (filtered from ${inventoryData.length} total)`}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>Highest</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Lowest</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                            : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-2">...</span>}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📈 KPI Inventory Dashboard
          </h1>
          <p className="text-xl text-gray-600 font-medium">Advanced Performance Analytics & Real-time Metrics</p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced Filters */}
        <div ref={filtersRef} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎛️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Filter Controls</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weeks Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-3">📅 Select Weeks:</label>
              <div className="grid grid-cols-2 gap-2">
                {weekOptions.map(week => (
                  <label key={week} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWeeks.includes(week)}
                      onChange={() => handleWeekChange(week)}
                      className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-gray-700">
                      {week === "All" ? "🗓️ All Weeks" : `📊 Week ${week}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Month Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-3">📆 Select Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white text-gray-700 font-medium"
              >
                <option value="">🗓️ Choose Month</option>
                {monthOptions.map(m => (
                  <option key={m.value} value={m.value}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Organization Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-3">🏢 Select Organization:</label>
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white text-gray-700 font-medium"
              >
                <option value="">🏬 Choose Organization</option>
                {organizationOptions.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Yearly Toggle */}
          <div className="mt-8 flex justify-center">
            <label className="inline-flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all duration-200">
              <input
                type="checkbox"
                checked={year}
                onChange={() => showYear(!year)}
                className="w-5 h-5 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                />
              <span className="ml-3 text-lg font-semibold text-indigo-700">📅 Yearly Data View</span>
            </label>
          </div>

          {/* Fetch Button */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchInventoryData}
              disabled={loading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Loading Data...
                </>
              ) : (
                <>
                  🚀 Fetch Data
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">❌ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        {inventoryData.length > 0 && (
          <div className="mb-8">
            {renderTable()}
          </div>
        )}

        {/* Individual Charts with Optimized Scales */}
        {inventoryData.length > 0 && (
          <div className="space-y-8">
            {/* Locator Accuracy Chart */}
            <div ref={chartRef} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Locator Accuracy Trends</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip 
                      formatter={(v) => [`${v.toFixed(2)}%`, 'Locator Accuracy']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Locator Accuracy" 
                      stroke="#3B82F6" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Piece Accuracy Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🧩</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Piece Accuracy Trends</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip 
                      formatter={(v) => [`${v.toFixed(2)}%`, 'Piece Accuracy']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Piece Accuracy" 
                      stroke="#10B981" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Net Accuracy Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Net Accuracy Trends</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip 
                      formatter={(v) => [`${v.toFixed(2)}%`, 'Net Accuracy']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Net Accuracy" 
                      stroke="#F59E0B" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gross Accuracy Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Gross Accuracy Trends</h2>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']}
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip 
                      formatter={(v) => [`${v.toFixed(2)}%`, 'Gross Accuracy']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Gross Accuracy" 
                      stroke="#EF4444" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Combined Overview Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Combined Accuracy Overview</h2>
                <div className="ml-auto">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Fixed Scale for Comparison</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      domain={[85, 100]} 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="600"
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip 
                      formatter={(v) => `${v.toFixed(2)}%`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Locator Accuracy" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Piece Accuracy" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Net Accuracy" 
                      stroke="#F59E0B" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Gross Accuracy" 
                      stroke="#EF4444" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiInventory;