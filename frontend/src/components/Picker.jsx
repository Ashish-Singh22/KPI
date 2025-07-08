import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import WorkerPerformancePlotly from "./worker_performance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Productivity_Worker from "./Productivity_worker";

const Picker = () => {
  const [pickerData, setPickerData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [excelFile, setExcelFile] = useState(null); // Contains { columns: [], rows: [] }
  const [productivityData,setProductivityData] = useState([])

  const workerNames = ["Picker 1", "Picker 2", "Picker 3", "Picker 4", "Picker 5"];
  const countBasisOptions = ["Line Number", "Item", "Quantity"];
  const timeBasisOptions = ["Loaded Time", "Drop Off Time"];

  const handleFilterChange = async (filterData) => {
    console.log("📥 Received filter data:", filterData);

    const start = new Date(filterData.startDate);
    const end = new Date(filterData.endDate);
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }

    const updatedFilters = {
      ...filterData,
      dates,
    };

    setCurrentFilters(updatedFilters);

    // 1. Fetch Picker Data (from Node.js or Django)
    const response = await fetch(SummaryApi.findPicker.url, {
      method: SummaryApi.findPicker.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });

    const dataResponse = await response.json();
    if (dataResponse.success) {
      setPickerData(dataResponse.data);

      // 2. Fetch Pre-processed JSON for plotting from Python
      const pythonResponse = await fetch(SummaryApiPython.filterWorkerController.url, {
        method: SummaryApiPython.filterWorkerController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Picker",
          pickerData: dataResponse.data,
          filterData: updatedFilters,
        }),
      });

      const json = await pythonResponse.json();
      if (json.success) {
        setExcelFile({
          columns: json.columns,
          rows: json.data,
        });
        console.log("📦 JSON data received and stored for dashboard");
      } else {
        console.error("❌ Python API error:", json.message);
      }
    } else if (dataResponse.error) {
      console.error("❌ Error fetching picker data:", dataResponse.message);
    }






    const response_1 = await fetch(SummaryApi.productivityPickingFindController.url, {
      method: SummaryApi.productivityPickingFindController.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });

    const dataResponse_1 = await response_1.json();
    if (dataResponse_1.success) {

      // console.log("productivity Picking Find Controller Data :: " , dataResponse_1.data)

      // 2. Fetch Pre-processed JSON for plotting from Python
      const pythonResponse_1 = await fetch(SummaryApiPython.filterProductivityPickerController.url, {
        method: SummaryApiPython.filterProductivityPickerController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productivityData: dataResponse_1.data,
          filterData: updatedFilters,
        }),
      });

      const json_1 = await pythonResponse_1.json();
      if (json_1.success) {
        setProductivityData(json_1?.final_data)
        // console.log(json_1?.final_data)
        console.log("📦 JSON data received and stored for dashboard");
      } else {
        console.error("❌ Python API error:", json_1.message);
      }
    } else if (dataResponse_1.error) {
      console.error("❌ Error fetching productivity picker data:", dataResponse_1.message);
    }
  };

  const exportToExcel = () => {
    if (!excelFile) return;

    const { columns, rows } = excelFile;

    // Convert column-wise data into row-wise array of objects
    const formattedRows = rows.map((row) => {
      const rowObj = {};
      columns.forEach((col, index) => {
        rowObj[col] = row[col];
      });
      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PickerData");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "picker_data.xlsx");
  };

  return (
    <>
      <Choice_Worker
        count_basis={countBasisOptions}
        time_basis={timeBasisOptions}
        worker_names={workerNames}
        onSelectionChange={handleFilterChange}
      />

      {excelFile && (
        <div className="p-4">
          <WorkerPerformancePlotly
            filterData={currentFilters}
            data={excelFile.rows}
            columns={excelFile.columns}
          />
          <button
            onClick={exportToExcel}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Excel
          </button>
        </div>
      )}

      {productivityData && (
        <div className="p-4">
          <Productivity_Worker
            data = { productivityData }
          />
        </div>
      )}
    </>
  );
};

export default Picker;
