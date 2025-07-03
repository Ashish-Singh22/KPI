import React from 'react';
import { BarChart3, Truck, ActivitySquare, Boxes } from 'lucide-react';

const Home = () => {
  return (
    <div className=" bg-gradient-to-br from-gray-100 to-white text-gray-800">
      

   
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-indigo-700 mb-4">Optimizing Warehouse Excellence</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The IPDC KPI Dashboard empowers data-driven decision-making across Worker Performance, Delivery Numbers, Quality Control, and Inventory Management — all in real time.
          </p>
        </section>

        {/* KPI Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
            title="Worker Analytics"
            description="Track picker & packer efficiency with real-time metrics."
          />
          <KpiCard
            icon={<Truck className="w-8 h-8 text-green-600" />}
            title="DN Tracking"
            description="Manage Delivery Numbers with shipment and Productivity analytics."
          />
          <KpiCard
            icon={<ActivitySquare className="w-8 h-8 text-red-600" />}
            title="DPMO "
            description="Monitor defects under different Operations in IPDC."
          />
          <KpiCard
            icon={<Boxes className="w-8 h-8 text-yellow-600" />}
            title="Inventory Insights"
            description="Gain control over stock, space, and reorder dynamics."
          />
        </section>
      

     
    </div>
  );
};

const KpiCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;
