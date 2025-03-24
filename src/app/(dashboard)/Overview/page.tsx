'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalTickets: number;
  activeMatches: number;
  pendingResults: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    activeMatches: 0,
    pendingResults: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from Supabase
    // This is mock data for now
    setStats({
      totalTickets: 156,
      activeMatches: 8,
      pendingResults: 3,
      totalRevenue: 25000,
    });
  }, []);

  return (
    <div className="max-w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Tickets</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalTickets}</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Matches</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.activeMatches}</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Results</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.pendingResults}</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-xl sm:text-2xl font-bold">FCFA {stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Latest Tickets</span>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            {/* TODO: Add real ticket data */}
            <p className="text-gray-500">No recent tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
} 