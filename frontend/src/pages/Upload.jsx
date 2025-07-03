import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Loader,
  Upload as UploadIcon
} from "lucide-react";
import { toast } from "react-toastify";
import SummaryApiPython from "../common/index_python";
import SummaryApi from "../common";

const UploadPage = () => {
  const [uploadStates, setUploadStates] = useState({
    workerPicking: { file: null, uploading: false, success: false, error: null },
    workerPacking: { file: null, uploading: false, success: false, error: null },
    dpmo: { file: null, uploading: false, success: false, error: null },
    dnShipment: { file: null, uploading: false, success: false, error: null },
    dnProductivity: { file: null, uploading: false, success: false, error: null },
    fsfFaf: { file: null, uploading: false, success: false, error: null },
    productivityPicking : { file: null, uploading: false, success: false, error: null },
  });

  const uploadConfigs = [
    {
      key: 'workerPicking',
      title: 'Worker Picking Report',
      description: 'Upload worker picking performance data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.workerPickingUpload.url,
      method: SummaryApiPython.workerPickingUpload.method,
      mernEndpoint: SummaryApi.workerPickingUpload.url,
      mernMethod: SummaryApi.workerPickingUpload.method
    },
    {
      key: 'workerPacking',
      title: 'Worker Packing Report',
      description: 'Upload worker packing performance data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.workerPackingUpload.url,
      method: SummaryApiPython.workerPackingUpload.method,
      mernEndpoint: SummaryApi.workerPackingUpload.url,
      mernMethod: SummaryApi.workerPackingUpload.method
    },
    {
      key: 'dpmo',
      title: 'DPMO Report',
      description: 'Upload Defects Per Million Opportunities data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.dpmoUpload.url,
      method: SummaryApiPython.dpmoUpload.method,
      mernEndpoint: SummaryApi.dpmoUpload.url,
      mernMethod: SummaryApi.dpmoUpload.method
    },
    {
      key: 'dnShipment',
      title: 'DN Shipment Report',
      description: 'Upload delivery note shipment data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.dnShipmentUpload.url,
      method: SummaryApiPython.dnShipmentUpload.method,
      mernEndpoint: SummaryApi.dnShipmentUpload.url,
      mernMethod: SummaryApi.dnShipmentUpload.method
    },
    {
      key: 'dnProductivity',
      title: 'DN Productivity Report',
      description: 'Upload delivery note productivity metrics',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.dnProductivityUpload.url,
      method: SummaryApiPython.dnProductivityUpload.method,
      mernEndpoint: SummaryApi.dnProductivityUpload.url,
      mernMethod: SummaryApi.dnProductivityUpload.method
    },
    {
      key: 'fsfFaf',
      title: 'FSF/FAF Report',
      description: 'Upload FSF and FAF performance data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.fsfFafUpload.url,
      method: SummaryApiPython.fsfFafUpload.method,
      mernEndpoint: SummaryApi.fsfFafUpload.url,
      mernMethod: SummaryApi.fsfFafUpload.method
    },
    {
      key: 'productivityPicking',
      title: 'Productivity Picking Report',
      description: 'Upload Productivity Picking data',
      acceptedTypes: '.csv,.xlsx,.xls',
      endpoint: SummaryApiPython.productivityPickingController.url,
      method: SummaryApiPython.productivityPickingController.method,
      mernEndpoint: SummaryApi.productivityPickingUploadController.url,
      mernMethod: SummaryApi.productivityPickingUploadController.method
    },
  ];

  const handleFileSelect = (key, file) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        file,
        success: false,
        error: null
      }
    }));
  };

  const handleFileRemove = (key) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        file: null,
        uploading: false,
        success: false,  // ✅ Reset success flag
        error: null
      }
    }));
  };

  const handleUpload = async (key, endpoint, method, mernEndpoint, mernMethod) => {
    const state = uploadStates[key];
    if (!state.file) return;

    setUploadStates(prev => ({
      ...prev,
      [key]: { ...prev[key], uploading: true, error: null }
    }));

    try {
      const formData = new FormData();
      formData.append('file', state.file);

      const response = await fetch(endpoint, {
        method: method,
        credentials: "include",
        body: formData,
      });

      const dataResponse = await response.json();
    //   console.log(dataResponse)

      if (dataResponse.success) {
        toast.success(dataResponse?.message || "Upload successful");

        const mernResponse = await fetch(mernEndpoint, {
          method: mernMethod,
          credentials: "include",
          body: dataResponse.data ? JSON.stringify(dataResponse.data) : null,
          headers: { "Content-Type": "application/json" }
        });

        const mernDataResponse = await mernResponse.json();
        if (mernDataResponse.success) {
          toast.success(mernDataResponse?.message || "Database Updated successfully");
        } else {
          toast.error(mernDataResponse?.message || "Database Update failed");
        }


        setUploadStates(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            uploading: false,
            success: true,
            error: null
          }
        }));

        // Reset state after success (optional delay)
        setTimeout(() => {
          handleFileRemove(key);
        }, 3000);
      } else {
        throw new Error(dataResponse?.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.message);
      setUploadStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          uploading: false,
          error: error.message
        }
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">KPI Data Upload Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your performance reports to keep your KPI dashboards updated with the latest data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uploadConfigs.map((config) => {
            const state = uploadStates[config.key];
            return (
              <div key={config.key} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-black text-white p-6 border-b-4 border-red-600">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-red-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">{config.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">{config.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <label className="block">
                      <input
                        key={state.success ? 'reset' + Date.now() : config.key}
                        type="file"
                        className="hidden"
                        accept={config.acceptedTypes}
                        onChange={(e) => handleFileSelect(config.key, e.target.files[0])}
                        disabled={state.uploading}
                      />
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${state.file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'} ${state.uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {state.file ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-green-600 mr-2" />
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-900 truncate">{state.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(state.file.size)}</p>
                              </div>
                            </div>
                            {!state.uploading && (
                              <button onClick={(e) => { e.preventDefault(); handleFileRemove(config.key); }} className="text-red-500 hover:text-red-700 p-1">
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to select file or drag & drop</p>
                            <p className="text-xs text-gray-400 mt-1">CSV, Excel files only</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {state.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">{state.error}</p>
                    </div>
                  )}

                  {state.success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <p className="text-sm text-green-700">File uploaded successfully!</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleUpload(config.key, config.endpoint, config.method, config.mernEndpoint, config.mernMethod)}
                    disabled={!state.file || state.uploading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center ${state.file && !state.uploading ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {state.uploading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : state.success ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Uploaded
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload File
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported File Types</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Process</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Select the appropriate file for each report type</li>
                <li>• Click "Upload File" to process the data</li>
                <li>• Wait for confirmation before uploading another file</li>
                <li>• Data will be automatically processed and updated in your dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
