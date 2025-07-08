import React, { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from "lucide-react";
import SummaryApiPython from "../common/index_python";
import { toast } from "react-toastify";
import openDnPerformance from "./openDnPerformance";
import OpenDnPerformance from "./openDnPerformance";

const OpenDn = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [data,setData]= useState({});

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        setErrorMessage('Please select a valid Excel file (.xlsx, .xls) or CSV file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file first');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Replace with your actual Python backend URL
      const response = await fetch(SummaryApiPython.openDnController.url, {
        method: SummaryApiPython.openDnController.method,
        credentials: 'include',
        body: formData,
      });

      const dataResponse = await response.json();
          //   console.log(dataResponse)
      
        if (dataResponse.success) {
            toast.success(dataResponse?.message || "Upload successful");
            setData({
              p_d : dataResponse?.p_d || {},
              f_d : dataResponse?.f_d || {},
              h_d : dataResponse?.h_d || {},
              final_data : dataResponse?.final_data
            })
            setUploadStatus('success'); 
            console.log(dataResponse)

        } else {
            throw new Error(dataResponse?.message || "Upload failed");
        }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Network error occurred during upload');
      console.error('❌ Network error:', error);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setResponseData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FileSpreadsheet className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Open DN Excel Upload
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload your Excel file to process DN data
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {uploadStatus === 'idle' || uploadStatus === 'error' ? (
            <>
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="fileInput"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      Click to select Excel file
                    </p>
                    <p className="text-gray-500">
                      Supports .xlsx, .xls, and .csv files
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={resetUpload}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              )}

              {/* Upload Button */}
              {selectedFile && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleUpload}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Upload and Process
                  </button>
                </div>
              )}
            </>
          ) : uploadStatus === 'uploading' ? (
            /* Loading State */
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Processing your file...
              </h3>
              <p className="text-gray-500">
                Please wait while we upload and process your Excel file
              </p>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your Excel file has been processed successfully
              </p>
              
              {/* Response Data Display */}
              {responseData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-green-700 mb-2">Response Data:</h4>
                  <pre className="text-sm text-green-600 overflow-auto max-h-40">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                </div>
              )}

              <button
                onClick={resetUpload}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Upload Another File
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Supported File Formats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-700">.xlsx</p>
                <p className="text-sm text-gray-500">Excel 2007+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-700">.xls</p>
                <p className="text-sm text-gray-500">Excel 97-2003</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-700">.csv</p>
                <p className="text-sm text-gray-500">Comma Separated</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {data && <OpenDnPerformance p_d = {data?.p_d} f_d = {data?.f_d} h_d = {data?.h_d} final_data={data?.final_data}/>}

    </div>
  );
};

export default OpenDn;