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

const UserGrowth = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch user growth data from API
  const fetchUserGrowthData = async (year) => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.access || '';

      const response = await fetch(
        `https://wrote-screensavers-carmen-myspace.trycloudflare.com/api/user/users-statics/${year}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();

      // Transform API response to chart data format
      if (result.data && Array.isArray(result.data)) {
        const transformedData = result.data.map((item) => ({
          month: item.month,
          users: item.users,
        }));
        setData(transformedData);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user growth data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available years on component mount
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        // You can fetch available years from an endpoint or hardcode them
        // For now, we'll use a range of years
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
          years.push(i.toString());
        }
        setAvailableYears(years);
      } catch (err) {
        console.error('Error fetching available years:', err);
        setAvailableYears(['2026', '2025', '2024', '2023', '2022', '2021']);
      }
    };

    fetchAvailableYears();
  }, []);

  // Fetch data when year changes
  useEffect(() => {
    fetchUserGrowthData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

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

      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading data: {error}
        </div>
      )}

      {loading ? (
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
