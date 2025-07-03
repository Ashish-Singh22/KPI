import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Dn from "./choice_dn";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import DnPerformance from "./dn_performance";

const Shipment = () => {
  const [shipmentData, setShipmentData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [data,setData] = useState({})
  const name_list = ["dn_count","t_hour","t_quantity","t_item","t_dn_value"] 

  const organizationList = ["D9M", "AC1", "AM2", "D9N"];

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
    console.log(currentFilters)

    // 1. Fetch Shipment Data (Node backend)
    const response = await fetch(SummaryApi.findShipment.url, {
      method: SummaryApi.findShipment.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });

    const dataResponse = await response.json();
    if (dataResponse.success) {
      setShipmentData(dataResponse.data);
      console.log(dataResponse?.data)

      // 2. Fetch Processed Data for Excel + Plotting (Python backend)
      const pythonResponse = await fetch(SummaryApiPython.filterDnController.url, {
        method: SummaryApiPython.filterDnController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Shipment",
          ShipmentData: dataResponse.data,
          filterData: updatedFilters,
        }),
      });

      const json = await pythonResponse.json();
      if (json.success) {
        setData(json?.data)
        
      } else {
        console.error("❌ Python API error:", json.message);
      }
    } else {
      console.error("❌ Error fetching shipment data:", dataResponse.message);
    }
  };

  

    

  return (
    <>
      <Choice_Dn
         organizationList={organizationList}
         onShowData={handleFilterChange} // ✅ CORRECT PROP NAME
/>
     { Object.keys(data).length > 0 && <DnPerformance
          data={data}
          name ={"Shipment"}
          name_list={name_list} /> }
     
      

    </>
  );
};

export default Shipment;
