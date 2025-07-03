import React, { useEffect } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadInventoryShow = ({ inventoryData , inputValue , organization,month , week }) => {
  // Sample data structure based on your input
  console.log(inputValue,organization)
  const data = {
    scheduleData: {
      "Count of Adjustment Date": inventoryData["scheduleData"]["Count of Adjustment Date"],
      "Count of Storage Location Name": inventoryData["scheduleData"]["Count of Storage Location Name"],
      "Sum of Adjustment Amount": inventoryData["scheduleData"]["Sum of Adjustment Amount"],
      "Sum of Gross Amount": inventoryData["scheduleData"]["Sum of Gross Amount"],
      "Sum of Gross Qty": inventoryData["scheduleData"]["Sum of Gross Qty"],
      "Sum of System Inventory Quantity": inventoryData["scheduleData"]["Sum of System Inventory Quantity"],
      "Sum of Total Cost": inventoryData["scheduleData"]["Sum of Total Cost"]
    },
    exceptionData: {
      "Count of Adjustment Date": inventoryData["exceptionData"]["Count of Adjustment Date"],
      "Count of Storage Location Name": inventoryData["exceptionData"]["Count of Storage Location Name"],
      "Sum of Adjustment Amount": inventoryData["exceptionData"]["Sum of Adjustment Amount"],
      "Sum of Gross Amount": inventoryData["exceptionData"]["Sum of Gross Amount"],
      "Sum of Gross Qty": inventoryData["exceptionData"]["Sum of Gross Qty"],
      "Sum of System Inventory Quantity": inventoryData["exceptionData"]["Sum of System Inventory Quantity"],
      "Sum of Total Cost": inventoryData["exceptionData"]["Sum of Total Cost"]
    },
    totalValues: {
      "Total Adjustment Amount": inventoryData["Total Adjustment Amount"],
      "Total Adjustment Date": inventoryData["Total Adjustment Date"],
      "Total Gross Amount": inventoryData["Total Gross Amount"],
      "Total Gross Qty": inventoryData["Total Gross Qty"],
      "Total Storage Location Name": inventoryData["Total Storage Location Name"],
      "Total System Inventory Quantity": inventoryData["Total System Inventory Quantity"],
      "Total Cost": inventoryData["Total Total Cost"],
      "Difference": inventoryData["Difference"]
    },
    accuracyMetrics: {
      "Inventory Count Accuracy (By Dollars) Gross": { value: inventoryData["Inventory Count Accuracy(By Dollars) Gross"]-3, limit: "≥ 99.0%" },
      "Inventory Count Accuracy (By Dollars) Net": { value: inventoryData["Inventory Count Accuracy(By Dollars) Net"], limit: "≥ 99.5%" },
      "Inventory Count Accuracy (By Location)": { value: inventoryData["Inventory Count Accuracy(By Location)"], limit: "≥ 95.0%" },
      "Inventory Count Accuracy (By Pieces) Gross": { value: inventoryData["Inventory Count Accuracy(By Pieces) Gross"], limit: "≥ 99.0%" },
      "Inventory Discrepancy Gross": { value: inventoryData["Inventory discrepancy Gross"], limit: "≤ 2.0 Lakh INR" },
      "Inventory Discrepancy Net": { value: inventoryData["Inventory discrepancy Net"], limit: "≤ 1.0 Lakh INR" }

    }
  };

  const sendData = async () => {
  try {
    const response = await fetch(SummaryApi.inventoryUpload.url, {
      method: SummaryApi.inventoryUpload.method,
      credentials: "include",
      body: JSON.stringify({
        "organization": organization,
        "week": inventoryData["week"],
        "month": inventoryData["month"],
        "Locator Accuracy": inventoryData["Inventory Count Accuracy(By Location)"],
        "Piece Accuracy": inventoryData["Inventory Count Accuracy(By Pieces) Gross"],
        "Net Accuracy": inventoryData["Inventory Count Accuracy(By Dollars) Net"],
        "Gross Accuracy": inventoryData["Inventory Count Accuracy(By Dollars) Gross"],
        "Inventory discrepancy-Net": inventoryData["Inventory discrepancy Net"],
        "Inventory discrepancy-Gross": inventoryData["Inventory discrepancy Gross"],
        "Total Amount Counted in Cr": (inventoryData["Total Total Cost"] / 10000000),
        "Shelf Space Vacancies (% of Empty Locations)": inputValue,
        "Total Number of Tasks generated": inventoryData["Total Number of Tasks generated"],
        "Tasks Completion Within 48Hrs": inventoryData["Total Completion Within 48Hrs"],
        "Tasks Pending beyond 48 Hrs": inventoryData["Total Pending beyond 48Hrs"],
        "Total Number of Tasks Accepted with 0 Variance": inventoryData["Total Number of Tasks Accepted with 0 Variance"],
        "Total Number of Tasks Rejected with Variance": inventoryData["Total Number of Tasks Rejected with Variance"],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const dataResponse = await response.json();
    if (dataResponse.success) {
      toast.success(dataResponse?.message || "Database Updated successfully");
    } else {
      toast.error(dataResponse?.message || "Database Update failed");
    }
  } catch (error) {
    toast.error("Error while sending data");
    console.error(error);
  }
};

useEffect(() => {
  if (inventoryData && Object.keys(inventoryData).length > 0) {
    sendData();
  }
}, [inventoryData]);


  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    return num;
  };

  const formatCurrency = (num) => {
    if (typeof num === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(num);
    }
    return num;
  };

  const getStatusColor = (metric, value) => {
    const numValue = parseFloat(value);
    switch (metric) {
      case "Inventory Count Accuracy (By Dollars) Gross":
        return numValue >= 99.0 ? "text-emerald-600" : "text-red-500";
      case "Inventory Count Accuracy (By Dollars) Net":
        return numValue >= 99.5 ? "text-emerald-600" : "text-red-500";
      case "Inventory Count Accuracy (By Location)":
        return numValue >= 95.0 ? "text-emerald-600" : "text-red-500";
      case "Inventory Count Accuracy (By Pieces) Gross":
        return numValue >= 99.0 ? "text-emerald-600" : "text-red-500";
      case "Inventory Discrepancy Gross":
        return numValue <= 2.0 ? "text-emerald-600" : "text-red-500";
      case "Inventory Discrepancy Net":
        return Math.abs(numValue) <= 1.0 ? "text-emerald-600" : "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Inventory Management Dashboard
          </h1>
          <div className="flex justify-center items-center space-x-6 text-lg">
            <div className="bg-white rounded-full px-6 py-2 shadow-md">
              <span className="text-gray-600">Month:</span>
              <span className="font-semibold text-blue-600 ml-2">{month}</span>
            </div>
            <div className="bg-white rounded-full px-6 py-2 shadow-md">
              <span className="text-gray-600">Week:</span>
              <span className="font-semibold text-purple-600 ml-2">{week}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Schedule Report Data */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                Schedule Report
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(data.scheduleData).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600 font-medium">{key}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {key.includes('Amount') || key.includes('Cost') ? formatNumber(value) : formatNumber(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exception Report Data */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                Exception Report
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(data.exceptionData).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600 font-medium">{key}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {key.includes('Amount') || key.includes('Cost') ? formatNumber(value) : formatNumber(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Values Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                Total Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(data.totalValues).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600 font-medium">{key.replace('Total ', '')}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {key.includes('Amount') || key.includes('Cost') ? formatNumber(value) : formatNumber(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Metrics - Vertical Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="w-4 h-4 bg-white rounded-full mr-4"></div>
              Inventory Accuracy Metrics
            </h2>
          </div>
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold text-lg">Metric</th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">Limit</th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">Value</th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.accuracyMetrics).map(([key, data], index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-6 px-6 text-gray-800 font-medium">{key}</td>
                      <td className="py-6 px-6 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {data.limit}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center">
                      <span className="text-2xl font-bold text-emerald-600">
  {data.limit === "≤ 2.0 Lakh INR" || data.limit === "≤ 1.0 Lakh INR"  ? formatNumber(data.value) : `${formatNumber(data.value)}%`}
</span>

                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                            getStatusColor(key, data.value).includes('emerald') 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {getStatusColor(key, data.value).includes('emerald') ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-gray-600 text-sm">
              Last Updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInventoryShow;