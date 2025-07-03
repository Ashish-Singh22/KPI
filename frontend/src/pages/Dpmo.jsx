import React, { useState } from "react";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import Choice_Dpmo from "../components/choice_dpmo";
import { toast } from "react-toastify";
import DpmoPerformance from "../components/dpmo_performance";
// import DpmoPerformance from "./dpmo_performance"; // Uncomment when you create this component

const Dpmo = () => {
  const [dpmoData, setDpmoData] = useState([]);
  const [data, setData] = useState({});
  const [currentFilters, setCurrentFilters] = useState(null);

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
    // Add as needed
  ];

  const handleFilterChange = async (filterData) => {
    console.log("📥 Received filter data:", filterData);
    const { startMonth, endMonth, selectedMonths } = filterData;

    const updatedFilters = {
      ...filterData,
      selectedMonths,
    };

    setCurrentFilters(updatedFilters);

    try {
      // 1. Fetch Raw DPMO Data (Node backend)
      const response = await fetch(SummaryApi.findDpmo.url, {
        method: SummaryApi.findDpmo.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFilters),
      });

      const dataResponse = await response.json();

      if (!dataResponse.success) {
        toast.error("Failed to fetch DPMO data: " + dataResponse.message);
        return;
      }

      setDpmoData(dataResponse.data);
      console.log("📦 Node DPMO Data:", dataResponse.data);

      // 2. Fetch Processed Data (Python backend)
      const pythonResponse = await fetch(SummaryApiPython.filterDpmoController.url, {
        method: SummaryApiPython.filterDpmoController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dpmoData: dataResponse.data
        }),
      });

      const json = await pythonResponse.json();

      if (!json.success) {
        toast.error("Failed to process DPMO data: " + json.message);
        return;
      }

      setData(json?.data);
      console.log("📊 Python Processed DPMO Data:", json?.data);
    } catch (err) {
      console.error("❌ Error during DPMO fetch:", err);
      toast.error("Something went wrong while fetching DPMO data.");
    }
  };

  return (
    <>
      <Choice_Dpmo monthList={monthList} onShowData={handleFilterChange} />

      { Object.keys(data).length > 0 && <DpmoPerformance data={data} /> }
      
    </>
  );
};

export default Dpmo;
