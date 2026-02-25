'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useGetUserGrowthQuery } from '../../features/user/userApi';

const UserGrowth = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [data, setData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const {
    data: growthData,
    isLoading: isGrowthLoading,
    error: growthError,
  } = useGetUserGrowthQuery(selectedYear);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    // Generate available years from 2020 to current year
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year.toString());
    }
    setAvailableYears(years);
  }, []);

  // Transform API response to chart data format
  useEffect(() => {
    if (growthData?.data && Array.isArray(growthData.data)) {
      const transformedData = growthData.data.map((item) => ({
        month: item.month,
        users: item.users,
      }));
      setData(transformedData);
    }
  }, [growthData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Growth</h2>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {growthError && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading data: {growthError.message || 'Unknown error'}
        </div>
      )}

      {isGrowthLoading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
              }}
              formatter={(value) => [value, 'Users']}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#22c55e"
              fill="#86efac"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <p>No data available for {selectedYear}</p>
        </div>
      )}
    </div>
  );
};

export default UserGrowth;
