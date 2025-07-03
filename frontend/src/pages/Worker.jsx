import React, { useState, useEffect } from "react";
import { Package, Users } from "lucide-react";
import Picker from "../components/Picker";
import Packer from "../components/Packer";

// Packer Component


// Main Worker Component
const Worker = () => {
  const [activeTab, setActiveTab] = useState("picker");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Management</h1>
          <p className="text-gray-600">Monitor and manage picker and packer activities</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-8 inline-flex">
          <button
            onClick={() => handleTabChange("picker")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === "picker"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Picker
          </button>
          <button
            onClick={() => handleTabChange("packer")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === "packer"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Packer
          </button>
        </div>

        {/* Content Area */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {activeTab === "picker" ? <Picker/> : <Packer/>}
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

export default Worker;