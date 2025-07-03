import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import WorkerPerformancePlotly from "./worker_performance";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Packer = () => {
  const [packerData, setPackerData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [excelFile, setExcelFile] = useState(null); // { columns: [], rows: [] }

  const workerNames = ["Packer 1", "Packer 2", "Packer 3", "Packer 4", "Packer 5"];
  const countBasisOptions = ["Content LPN", "Item", "Quantity"];
  const timeBasisOptions = ["Drop Off Time"];

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

    // 1. Fetch Packer Data
    const response = await fetch(SummaryApi.findPacker.url, {
      method: SummaryApi.findPacker.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });

    const dataResponse = await response.json();
    if (dataResponse.success) {
      setPackerData(dataResponse?.data);
      console.log(packerData)

      // 2. Fetch JSON from Python
      const pythonResponse = await fetch(SummaryApiPython.filterWorkerController.url, {
        method: SummaryApiPython.filterWorkerController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Packer",
          packerData: dataResponse.data, // match key name used in Python backend
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
      console.error("❌ Error fetching packer data:", dataResponse.message);
    }
  };

  const exportToExcel = () => {
    if (!excelFile) return;

    const { columns, rows } = excelFile;

    const formattedRows = rows.map((row) => {
      const rowObj = {};
      columns.forEach((col, index) => {
        rowObj[col] = row[col];
      });
      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PackerData");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "packer_data.xlsx");
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Excel
          </button>
        </div>
      )}
      {!excelFile && (
        <h1 className="text-center text-blue-500 font-bold">No data is found.</h1>
      )}
    </>
  );
};

export default Packer;
