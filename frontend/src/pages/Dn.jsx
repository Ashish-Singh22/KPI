import React, { useState } from "react";
import { Package, Users, FolderOpen } from "lucide-react"; // FolderOpen icon added for distinction
import Shipment from "../components/Shipment_dn";
import Productivity from "../components/Productivity_dn";
import OpenDn from "../components/OpenDn"; // ✅ Import your Open Dn component

const Dn = () => {
  const [activeTab, setActiveTab] = useState("Shipment");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DN Analysis</h1>
          <p className="text-gray-600">
            Monitor the Dn step wise time on the basis of Organization
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-8 inline-flex">
          <button
            onClick={() => handleTabChange("Shipment")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === "Shipment"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Shipment
          </button>
          <button
            onClick={() => handleTabChange("Productivity")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === "Productivity"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Productivity
          </button>
          <button
            onClick={() => handleTabChange("Open Dn")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === "Open Dn"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FolderOpen className="h-5 w-5 mr-2" />
            Open Dn
          </button>
        </div>

        {/* Content Area */}
        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {activeTab === "Shipment" && <Shipment />}
          {activeTab === "Productivity" && <Productivity />}
          {activeTab === "Open Dn" && <OpenDn />} {/* ✅ Handle Open Dn */}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dn;
