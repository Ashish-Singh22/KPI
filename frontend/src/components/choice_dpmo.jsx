import React, { useState } from "react";
import { Calendar, Eye, Building2 } from "lucide-react";

const Choice_Dpmo = ({ monthList = [], onShowData }) => {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const handleShowClick = () => {
    if (!startMonth || !endMonth) return;

    // Get all months between startMonth and endMonth from the list
    const startIndex = monthList.indexOf(startMonth);
    const endIndex = monthList.indexOf(endMonth);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return;

    const selectedMonths = monthList.slice(startIndex, endIndex + 1);

    const selectionData = {
      startMonth,
      endMonth,
      selectedMonths,
    };

    if (onShowData) onShowData(selectionData);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6">
        <Building2 className="h-6 w-6 text-red-500 mr-3" />
        <h2 className="text-xl font-bold text-white">Filter Options</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Start Month */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-red-500" />
            Start Month
          </h3>
          <input
            type="text"
            list="month-list"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            placeholder="Select start month"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
          />
        </div>

        {/* End Month */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-red-500" />
            End Month
          </h3>
          <input
            type="text"
            list="month-list"
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            placeholder="Select end month"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
          />
        </div>

        {/* Datalist */}
        <datalist id="month-list">
          {monthList.map((month, idx) => (
            <option key={idx} value={month} />
          ))}
        </datalist>
      </div>

      {/* Show Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleShowClick}
          className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          <Eye className="h-5 w-5 mr-2" />
          Show
        </button>
      </div>
    </div>
  );
};

export default Choice_Dpmo;
