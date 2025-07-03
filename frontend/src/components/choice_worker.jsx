import React, { useState, useEffect } from "react";
import { Package, Users, Calendar, Clock, Target, Timer, Eye } from "lucide-react";

const Choice_Worker = ({
  count_basis = [],
  time_basis = [],
  worker_names = [],
  onSelectionChange,
  onShowData
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedCountBasis, setSelectedCountBasis] = useState("");
  const [selectedTimeBasis, setSelectedTimeBasis] = useState("");
  const [enableWorkerSelection, setEnableWorkerSelection] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!startDate) setStartDate(today);
    if (!endDate) setEndDate(today);
  }, [today]);

  const handleShiftChange = (shift) => {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const handleAllShifts = () => {
    setSelectedShifts(selectedShifts.length === 3 ? [] : [1, 2, 3]);
  };

  const handleShowClick = () => {
    const selectionData = {
      startDate,
      endDate,
      shifts: selectedShifts,
      countBasis: selectedCountBasis,
      timeBasis: selectedTimeBasis,
    };

    if (enableWorkerSelection) {
      selectionData.workerName = selectedWorker;
    }

    if (onShowData) onShowData(selectionData);
    if (onSelectionChange) onSelectionChange(selectionData);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 text-red-500 mr-3" />
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

        {/* Shift Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-red-500" />
            Shift Selection
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="all-shifts"
                checked={selectedShifts.length === 3}
                onChange={handleAllShifts}
                className="h-4 w-4 text-red-500 bg-gray-800 border-gray-600 rounded"
              />
              <label htmlFor="all-shifts" className="ml-2 text-sm text-gray-300">
                All Shifts
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((shift) => (
                <div key={shift} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`shift-${shift}`}
                    checked={selectedShifts.includes(shift)}
                    onChange={() => handleShiftChange(shift)}
                    className="h-4 w-4 text-red-500 bg-gray-800 border-gray-600 rounded"
                  />
                  <label htmlFor={`shift-${shift}`} className="ml-2 text-sm text-gray-300">
                    Shift {shift}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Count Basis */}
        {count_basis.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-500" />
              Count Basis
            </h3>
            <select
              value={selectedCountBasis}
              onChange={(e) => setSelectedCountBasis(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
            >
              <option value="">Select Count Basis</option>
              {count_basis.map((basis, idx) => (
                <option key={idx} value={basis}>
                  {basis}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Time Basis */}
        {time_basis.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center">
              <Timer className="h-5 w-5 mr-2 text-red-500" />
              Time Basis
            </h3>
            <select
              value={selectedTimeBasis}
              onChange={(e) => setSelectedTimeBasis(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
            >
              <option value="">Select Time Basis</option>
              {time_basis.map((basis, idx) => (
                <option key={idx} value={basis}>
                  {basis}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Worker Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Users className="h-5 w-5 mr-2 text-red-500" />
            Worker Selection
          </h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-worker"
              checked={enableWorkerSelection}
              onChange={(e) => {
                setEnableWorkerSelection(e.target.checked);
                if (!e.target.checked) setSelectedWorker("");
              }}
              className="h-4 w-4 text-red-500 bg-gray-800 border-gray-600 rounded"
            />
            <label htmlFor="enable-worker" className="ml-2 text-sm text-gray-300">
              Enable Worker Selection
            </label>
          </div>

          {enableWorkerSelection && (
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md"
            >
              <option value="">Select Worker</option>
              {worker_names.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
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

export default Choice_Worker;