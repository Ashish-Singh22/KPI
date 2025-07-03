import React, { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle, AlertCircle, X,
  Loader, Calendar, Package, BarChart3, Download , Building2
} from "lucide-react";
import SummaryApiPython from "../common/index_python";
import UploadInventoryShow from "./Upload_Inventory_Show";

const UploadInventory = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [uploadStates, setUploadStates] = useState({
    scheduleReport: { file: null, uploading: false, success: false, error: null },
    exceptionReport: { file: null, uploading: false, success: false, error: null }
  });
  const [processing, setProcessing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [dataError, setDataError] = useState(null);

  const scheduleInputRef = useRef(null);
  const exceptionInputRef = useRef(null);

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    value: i + 1,
    label: `Week ${i + 1}`
  }));

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
    { value:"All", label: "All Months"}
  ];

  const handleFileSelect = (key, file) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: { ...prev[key], file, success: false, error: null }
    }));
  };

  const handleFileRemove = (key) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: { ...prev[key], file: null, success: false, error: null }
    }));
  };

  const handleUploadAndProcess = async () => {
    if (!uploadStates.scheduleReport.file || !uploadStates.exceptionReport.file || !selectedWeek || !selectedMonth) {
      setDataError("Please select both files, week and month.");
      return;
    }

    setProcessing(true);
    setDataError(null);

    setUploadStates(prev => ({
      scheduleReport: { ...prev.scheduleReport, uploading: true, error: null },
      exceptionReport: { ...prev.exceptionReport, uploading: true, error: null }
    }));

    try {
      const formData = new FormData();
      formData.append('scheduleReport', uploadStates.scheduleReport.file);
      formData.append('exceptionReport', uploadStates.exceptionReport.file);
      formData.append('week', selectedWeek);
      formData.append('month', selectedMonth);

      // Debugging
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await fetch(SummaryApiPython.uploadInventoryController.url, {
        method: SummaryApiPython.uploadInventoryController.method || "POST",
        credentials: "include",
        body: formData,
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        console.log("📦 Upload and processing successful:", dataResponse);
        setProcessedData(dataResponse?.data || {});
        setUploadStates(prev => ({
          scheduleReport: { ...prev.scheduleReport, uploading: false, success: true },
          exceptionReport: { ...prev.exceptionReport, uploading: false, success: true }
        }));
      } else {
        throw new Error(dataResponse.message || "Upload and processing failed");
      }
    } catch (error) {
      setDataError(error.message);
      setUploadStates(prev => ({
        scheduleReport: { ...prev.scheduleReport, uploading: false, error: error.message },
        exceptionReport: { ...prev.exceptionReport, uploading: false, error: error.message }
      }));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadResults = () => {
    if (!processedData) return;

    const dataStr = JSON.stringify(processedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `inventory_week${selectedWeek}_month${selectedMonth}.json`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
  };

  const canUpload = selectedWeek && selectedMonth && uploadStates.scheduleReport.file && uploadStates.exceptionReport.file;
  const [inputValue, setInputValue] = useState("");
  const organizationList = ["D9M", "AC1", "AM2", "D9N"];
  const [selectedOrganization, setSelectedOrganization] = useState("");


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Upload and process your inventory reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Time Period Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Select Time Period</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Week</label>
                  <select 
                    value={selectedWeek} 
                    onChange={e => setSelectedWeek(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Week</option>
                    {weeks.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                    <option key="123" value="All">All</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Month</label>
                  <select 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Shelf Space Vacancies (% of Empty Locations)</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type something..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    />
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-red-500" />
                    Organization
                </label>
                <input
                    type="text"
                    list="org-list"
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    placeholder="Select or type organization"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
                <datalist id="org-list">
                    {organizationList.map((org, idx) => (
                    <option key={idx} value={org} />
                    ))}
                </datalist>
                </div>


              </div>
            </div>

            

            {/* File Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Upload Reports</h3>
              </div>

              <div className="space-y-6">
                {[
                  { key: "scheduleReport", title: "Schedule Report", icon: FileText, ref: scheduleInputRef },
                  { key: "exceptionReport", title: "Exception Report", icon: AlertCircle, ref: exceptionInputRef }
                ].map(({ key, title, icon: Icon, ref }) => (
                  <div key={key} className="space-y-3">
                    <input
                      type="file"
                      ref={ref}
                      onChange={(e) => handleFileSelect(key, e.target.files[0])}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                    
                    <div
                      onClick={() => {
                        if (!processing) {
                          ref.current.click();
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md group ${
                        uploadStates[key].file 
                          ? "border-green-400 bg-green-50" 
                          : processing 
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          uploadStates[key].file 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        } transition-colors duration-200`}>
                          {uploadStates[key].uploading ? (
                            <Loader className="h-6 w-6 animate-spin" />
                          ) : uploadStates[key].success ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{title}</h4>
                          <p className="text-sm text-gray-500 truncate">
                            {uploadStates[key].file 
                              ? uploadStates[key].file.name 
                              : "Click to select file (.xlsx, .xls, .csv)"
                            }
                          </p>
                        </div>

                        {uploadStates[key].file && !processing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileRemove(key);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {uploadStates[key].error && (
                      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{uploadStates[key].error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <button
                disabled={!canUpload || processing}
                onClick={handleUploadAndProcess}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  canUpload && !processing 
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader className="h-6 w-6 animate-spin" />
                    <span>Uploading & Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Upload className="h-6 w-6" />
                    <span>Upload & Process</span>
                  </div>
                )}
              </button>

              {dataError && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg mt-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{dataError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Upload Status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Week Selected</span>
                  {selectedWeek ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Week {selectedWeek}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not selected</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Month Selected</span>
                  {selectedMonth ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>{months.find(m => m.value == selectedMonth)?.label}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not selected</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Schedule Report</span>
                  {uploadStates.scheduleReport.file ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Ready</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not uploaded</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Exception Report</span>
                  {uploadStates.exceptionReport.file ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Ready</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not uploaded</span>
                  )}
                </div>
              </div>

              {canUpload && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Ready to process!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {processedData && (
          <div className="mt-8">
            <UploadInventoryShow inventoryData={processedData} inputValue={inputValue} organization={selectedOrganization} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadInventory;