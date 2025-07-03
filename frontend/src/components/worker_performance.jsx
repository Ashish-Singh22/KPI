import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Users, BarChart3, Calendar, TrendingUp, Clock, Target, Sparkles } from "lucide-react";

const WorkerPerformancePlotly = ({ filterData, data, columns }) => {
  console.log("my_lovely",data)
 const [processedData, setProcessedData] = useState([]);
 const [headers, setHeaders] = useState([]);

 useEffect(() => {
   if (data && columns) {
     // Find numeric time slot columns (exclude Employee and Vehicle Used)
     const timeSlots = columns.filter(col => 
       col !== "Employee" && 
       col !== "Vehicle Used" && 
       !col.toLowerCase().includes("vehicle") &&
       !col.toLowerCase().includes("employee")
     );
     setHeaders(timeSlots);

     const formatted = data.map((row) => {
       const employee = row[columns.find(col => col.toLowerCase().includes("employee")) || columns[0]] || "Unknown";
       const times = timeSlots.map((col) => parseInt(row[col]) || 0);
       return { employee, times, fullRow: row };
     });

     setProcessedData(formatted);
   }
 }, [data, columns]);

 const barTraces = headers.map((slot, i) => ({
   x: processedData.map((d) => d.employee),
   y: processedData.map((d) => d.times[i] || 0),
   name: slot,
   type: "bar",
   marker: {
     color: `hsl(${200 + i * 25}, 65%, 55%)`,
     line: { width: 0 }
   }
 }));

 const heatmapZ = processedData.map((d) => d.times);
 const heatmapY = processedData.map((d) => d.employee);

 const totalCount = processedData.reduce((sum, emp) => sum + emp.times.reduce((s, t) => s + t, 0), 0);
 const avgPerformance = processedData.length ? (totalCount / processedData.length).toFixed(1) : 0;

 // Extract filter information
 const countBasis = filterData?.countBasis || "Performance Count";
 const timeBasis = filterData?.timeBasis || "Time Basis";
 const startDate = filterData?.startDate || "";
 const endDate = filterData?.endDate || "";
 const dateRange = startDate === endDate ? startDate : `${startDate} to ${endDate}`;

 // Calculate proper dimensions for better spacing
 const employeeCount = processedData.length;
 const timeSlotCount = headers.length;
 
 // Fixed dimensions with proper spacing
 const barChartHeight = Math.max(600, employeeCount * 25 + 300);
 const heatmapHeight = Math.max(600, employeeCount * 40 + 200);
 const heatmapWidth = Math.max(800, timeSlotCount * 100 + 300);

 return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
     {/* Header */}
     <div className="bg-gradient-to-r from-slate-700 to-blue-700 shadow-lg">
       <div className="max-w-7xl mx-auto px-6 py-8 text-center">
         <div className="flex items-center justify-center mb-4">
           <div className="bg-white p-3 rounded-xl shadow-md">
             <TrendingUp className="w-8 h-8 text-blue-600" />
           </div>
         </div>
         <h1 className="text-4xl font-bold text-white mb-3">
           Worker Performance Dashboard
         </h1>
         <div className="flex items-center justify-center gap-2 mb-3">
           <Sparkles className="w-4 h-4 text-blue-300" />
           <p className="text-lg text-blue-100">Analyze employee productivity based on {countBasis} across {timeBasis}</p>
           <Sparkles className="w-4 h-4 text-blue-300" />
         </div>
         {dateRange && (
           <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm bg-white/20 backdrop-blur-sm text-white border border-white/30">
             <Calendar className="w-4 h-4 mr-2" />
             {dateRange}
           </div>
         )}
       </div>
     </div>

     <div className="max-w-7xl mx-auto px-6 py-8">
       {/* Filter Info Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
           <div className="flex items-center">
             <div className="p-3 rounded-lg bg-blue-500 shadow-sm">
               <Target className="w-6 h-6 text-white" />
             </div>
             <div className="ml-4">
               <p className="text-sm font-medium text-gray-600 mb-1">Count Basis</p>
               <p className="text-xl font-bold text-gray-800">{countBasis}</p>
             </div>
           </div>
         </div>
         <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
           <div className="flex items-center">
             <div className="p-3 rounded-lg bg-green-500 shadow-sm">
               <Clock className="w-6 h-6 text-white" />
             </div>
             <div className="ml-4">
               <p className="text-sm font-medium text-gray-600 mb-1">Time Basis</p>
               <p className="text-xl font-bold text-gray-800">{timeBasis}</p>
             </div>
           </div>
         </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatsCard icon={<Users />} label="Total Employees" value={processedData.length} color="emerald" />
         <StatsCard icon={<Calendar />} label="Time Slots" value={headers.length} color="blue" />
         <StatsCard icon={<BarChart3 />} label={`Avg ${countBasis}`} value={avgPerformance} color="purple" />
       </div>

       {/* Charts Section */}
       <div className="space-y-8">
         {/* Bar Chart */}
         <ChartCard 
           title={`${countBasis} Overview`} 
           subtitle={`Interactive stacked bar chart showing ${countBasis} by employee across ${timeBasis}`}
         >
           <div className="overflow-x-auto">
             <Plot
               data={barTraces}
               layout={{
                 barmode: "stack",
                 font: { family: "Inter, sans-serif", color: "#374151" },
                 plot_bgcolor: "#f8fafc",
                 paper_bgcolor: "white",
                 xaxis: { 
                   title: "Employee Name",
                   tickangle: -45,
                   tickfont: { size: 12, color: "#374151" },
                   titlefont: { color: "#374151", size: 14, family: "Inter, sans-serif" },
                   gridcolor: "#e5e7eb",
                   linecolor: "#d1d5db",
                   automargin: true
                 },
                 yaxis: { 
                   title: countBasis,
                   tickfont: { size: 12, color: "#374151" },
                   titlefont: { color: "#374151", size: 14, family: "Inter, sans-serif" },
                   gridcolor: "#e5e7eb",
                   linecolor: "#d1d5db",
                   automargin: true
                 },
                 margin: { t: 80, b: 180, l: 120, r: 60 },
                 legend: { 
                   orientation: "h", 
                   y: -0.35, 
                   x: 0.5, 
                   xanchor: "center",
                   title: { text: timeBasis, font: { color: "#374151", size: 14 } },
                   font: { color: "#374151", size: 12 },
                   bgcolor: "#f9fafb",
                   bordercolor: "#d1d5db",
                   borderwidth: 1
                 },
                 title: {
                   text: `${countBasis} Distribution by ${timeBasis}`,
                   font: { size: 18, color: "#1f2937", family: "Inter, sans-serif" },
                   x: 0.5,
                   xanchor: "center"
                 },
                 hovermode: 'x unified',
                 bargap: 0.3,
                 bargroupgap: 0.1
               }}
               config={{ 
                 responsive: true, 
                 displayModeBar: true,
                 modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                 displaylogo: false
               }}
               style={{ width: "100%", height: `${barChartHeight}px` }}
             />
           </div>
         </ChartCard>

         {/* Heatmap */}
         <ChartCard 
           title={`${countBasis} Heatmap`} 
           subtitle={`Interactive intensity map of ${countBasis} across ${timeBasis} for each employee with values displayed`}
         >
           <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "800px" }}>
             <Plot
               data={[
                 {
                   z: heatmapZ,
                   x: headers,
                   y: heatmapY,
                   type: "heatmap",
                   colorscale: [
                     [0, "#f1f5f9"],
                     [0.2, "#e2e8f0"],
                     [0.4, "#cbd5e1"],
                     [0.6, "#94a3b8"],
                     [0.8, "#64748b"],
                     [1, "#475569"]
                   ],
                   hovertemplate: `<b>%{y}</b><br>${timeBasis}: <b>%{x}</b><br>${countBasis}: <b>%{z}</b><br><extra></extra>`,
                   showscale: true,
                   colorbar: { 
                     title: { 
                       text: countBasis, 
                       font: { color: "#374151", size: 14, family: "Inter, sans-serif" } 
                     },
                     tickfont: { color: "#374151", size: 12 },
                     bgcolor: "#f9fafb",
                     bordercolor: "#d1d5db",
                     borderwidth: 1,
                     thickness: 20
                   },
                   texttemplate: "%{z}",
                   textfont: { 
                     size: 14, 
                     color: "#1f2937",
                     family: "Inter, sans-serif"
                   },
                   showText: true,
                   textposition: "middle center",
                   xgap: 2,
                   ygap: 2
                 },
               ]}
               layout={{
                 font: { family: "Inter, sans-serif", color: "#374151" },
                 plot_bgcolor: "#f8fafc",
                 paper_bgcolor: "white",
                 xaxis: { 
                   title: timeBasis,
                   tickfont: { size: 12, color: "#374151" },
                   titlefont: { color: "#374151", size: 14, family: "Inter, sans-serif" },
                   gridcolor: "#e5e7eb",
                   linecolor: "#d1d5db",
                   tickangle: -45,
                   automargin: true
                 },
                 yaxis: { 
                   title: "Employee Name",
                   tickfont: { size: 12, color: "#374151" },
                   titlefont: { color: "#374151", size: 14, family: "Inter, sans-serif" },
                   gridcolor: "#e5e7eb",
                   linecolor: "#d1d5db",
                   automargin: true
                 },
                 margin: { t: 80, b: 150, l: 200, r: 120 },
                 title: {
                   text: `${countBasis} Heatmap by ${timeBasis}`,
                   font: { size: 18, color: "#1f2937", family: "Inter, sans-serif" },
                   x: 0.5,
                   xanchor: "center"
                 },
                 width: heatmapWidth,
                 height: heatmapHeight
               }}
               config={{ 
                 responsive: true, 
                 displayModeBar: true,
                 modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                 displaylogo: false,
                 scrollZoom: true
               }}
               style={{ minWidth: `${heatmapWidth}px`, height: `${heatmapHeight}px` }}
             />
           </div>
         </ChartCard>

         {/* Data Table */}
         <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-lg bg-indigo-500">
                 <BarChart3 className="w-5 h-5 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-800">Detailed Performance Data</h3>
             </div>
             <p className="text-gray-600">
               Comprehensive {countBasis} breakdown by employee across {timeBasis}
               {dateRange && <span className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">({dateRange})</span>}
             </p>
           </div>
           <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "600px" }}>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50 sticky top-0 z-10">
                 <tr>
                   <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r border-gray-200">
                     <div className="flex items-center gap-2">
                       <Users className="w-4 h-4" />
                       Employee Name
                     </div>
                   </th>
                   {headers.map((h, idx) => (
                     <th key={idx} className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider" style={{ minWidth: "120px" }}>
                       <div className="space-y-1">
                         <div>{h}</div>
                         <div className="text-xs text-gray-500 normal-case font-normal bg-gray-200 px-2 py-1 rounded">
                           ({timeBasis})
                         </div>
                       </div>
                     </th>
                   ))}
                   <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider bg-gray-50 z-20 border-l border-gray-200">
                     <div className="flex items-center justify-center gap-2">
                       <Target className="w-4 h-4" />
                       Total {countBasis}
                     </div>
                   </th>
                   {columns.find(col => col.toLowerCase().includes("vehicle")) && (
                     <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider sticky right-0 bg-gray-50 z-20 border-l border-gray-200">
                       <div className="flex items-center justify-center gap-2">
                         <Clock className="w-4 h-4" />
                         Vehicle Used
                       </div>
                     </th>
                   )}
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {processedData.map((row, i) => {
                   const total = row.times.reduce((sum, val) => sum + val, 0);
                   const vehicleColumn = columns.find(col => col.toLowerCase().includes("vehicle"));
                   const vehicleUsed = vehicleColumn ? row.fullRow[vehicleColumn] : "";
                   
                   return (
                     <tr key={i} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 font-semibold text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-200" style={{ minWidth: "200px" }}>
                         {row.employee}
                       </td>
                       {row.times.map((v, j) => (
                         <td key={j} className="px-4 py-4 text-center text-sm">
                           <span className={`inline-flex items-center justify-center w-10 h-8 rounded-full text-sm font-semibold ${
                             v === 0 ? 'bg-gray-100 text-gray-500 border border-gray-300' :
                             v <= 2 ? 'bg-red-100 text-red-700 border border-red-300' :
                             v <= 5 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                             'bg-green-100 text-green-700 border border-green-300'
                           }`}>
                             {v}
                           </span>
                         </td>
                       ))}
                       <td className="px-4 py-4 text-center bg-white z-10 border-l border-gray-200">
                         <span className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-300">
                           {total}
                         </span>
                       </td>
                       {vehicleColumn && (
                         <td className="px-4 py-4 text-center sticky right-0 bg-white z-10 border-l border-gray-200" style={{ minWidth: "150px" }}>
                           <span className="inline-flex items-center px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium border border-gray-300">
                             {vehicleUsed || "N/A"}
                           </span>
                         </td>
                       )}
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

// Enhanced Reusable Card Components
const StatsCard = ({ icon, label, value, color }) => {
 const colorMap = {
   emerald: 'bg-emerald-500',
   blue: 'bg-blue-500', 
   purple: 'bg-purple-500'
 };
 
 return (
   <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
     <div className="flex items-center">
       <div className={`p-3 rounded-lg ${colorMap[color]} shadow-sm`}>
         {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
       </div>
       <div className="ml-4">
         <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
         <p className="text-2xl font-bold text-gray-800">{value}</p>
       </div>
     </div>
   </div>
 );
};

const ChartCard = ({ title, subtitle, children }) => (
 <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
   <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
     <div className="flex items-center gap-3 mb-2">
       <div className="p-2 rounded-lg bg-indigo-500">
         <TrendingUp className="w-5 h-5 text-white" />
       </div>
       <h3 className="text-xl font-bold text-gray-800">{title}</h3>
     </div>
     <p className="text-gray-600">{subtitle}</p>
   </div>
   <div className="p-6">{children}</div>
 </div>
);

export default WorkerPerformancePlotly;