import React, { useState, useEffect } from "react";
import { Calendar, Eye, Building2 } from "lucide-react";

const Choice_Dn = ({
  organizationList = [],
  onShowData
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!startDate) setStartDate(today);
    if (!endDate) setEndDate(today);
  }, [today]);

  const handleShowClick = () => {
    const selectionData = {
      startDate,
      endDate,
      organization: selectedOrganization
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
        {/* Date Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-red-500" />
            Date Range
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Organization Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-red-500" />
            Organization
          </h3>
          <input
            type="text"
            list="org-list"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            placeholder="Select or type organization"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
          />
          <datalist id="org-list">
            {organizationList.map((org, idx) => (
              <option key={idx} value={org} />
            ))}
          </datalist>
        </div>
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

export default Choice_Dn;