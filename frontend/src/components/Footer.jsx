import React from "react";
import { BarChart, TrendingUp, Users, FileText, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Worker Performance', href: '/worker' },
    { name: 'DN Reports', href: '/dn' },
    { name: 'DPMO Analysis', href: '/dpmo' },
    { name: 'FSF/FAF Metrics', href: '/fsf_and_faf' },
    { name: 'Upload Data', href: '/upload' }
  ];

  const kpiMetrics = [
    { icon: Users, name: 'Worker Analytics', description: 'Track picking & packing performance' },
    { icon: TrendingUp, name: 'DPMO Tracking', description: 'Monitor quality metrics' },
    { icon: FileText, name: 'DN Reports', description: 'Shipment & productivity insights' },
    { icon: BarChart, name: 'FSF/FAF Analysis', description: 'Performance benchmarking' }
  ];

  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <BarChart className="h-8 w-8 text-red-500 mr-3" />
              <h3 className="text-2xl font-bold">KPI Dashboard</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Comprehensive performance analytics platform for tracking worker productivity, 
              quality metrics, and operational efficiency across all business units.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                <Mail className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                <Phone className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-red-400">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* KPI Metrics */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold mb-6 text-red-400">Performance Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kpiMetrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <div 
                    key={metric.name}
                    className="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 border border-gray-700 hover:border-red-500"
                  >
                    <div className="flex items-start">
                      <IconComponent className="h-6 w-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-white mb-1">{metric.name}</h5>
                        <p className="text-sm text-gray-400">{metric.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">99.9%</div>
              <div className="text-gray-300 text-sm">System Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">6+</div>
              <div className="text-gray-300 text-sm">KPI Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">∞</div>
              <div className="text-gray-300 text-sm">Data Points Processed</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-red-400" />
                <span>analytics@company.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-red-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-400" />
                <span>Analytics Department</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Last Data Update: <span className="text-red-400 font-medium">Real-time</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} KPI Dashboard. All rights reserved. Built for operational excellence.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/support" className="text-gray-400 hover:text-red-400 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;