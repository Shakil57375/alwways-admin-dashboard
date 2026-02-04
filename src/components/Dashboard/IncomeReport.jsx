import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Data for different years
const dataByYear = {
  2024: [
    { month: "Jan", value: 30000 },
    { month: "Feb", value: 12000 },
    { month: "Mar", value: 15000 },
    { month: "Apr", value: 0 },
    { month: "May", value: 25000 },
    { month: "Jun", value: 35000 },
    { month: "Jul", value: 35000 },
    { month: "Aug", value: 13000 },
    { month: "Sep", value: 31000 },
    { month: "Oct", value: 21000 },
    { month: "Nov", value: 17000 },
    { month: "Dec", value: 15000 },
  ],
  2023: [
    { month: "Jan", value: 20000 },
    { month: "Feb", value: 15000 },
    { month: "Mar", value: 10000 },
    { month: "Apr", value: 5000 },
    { month: "May", value: 20000 },
    { month: "Jun", value: 25000 },
    { month: "Jul", value: 30000 },
    { month: "Aug", value: 15000 },
    { month: "Sep", value: 25000 },
    { month: "Oct", value: 20000 },
    { month: "Nov", value: 10000 },
    { month: "Dec", value: 15000 },
  ],
  2022: [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 12000 },
    { month: "Mar", value: 13000 },
    { month: "Apr", value: 14000 },
    { month: "May", value: 15000 },
    { month: "Jun", value: 20000 },
    { month: "Jul", value: 22000 },
    { month: "Aug", value: 18000 },
    { month: "Sep", value: 16000 },
    { month: "Oct", value: 19000 },
    { month: "Nov", value: 17000 },
    { month: "Dec", value: 15000 },
  ],
  2021: [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 7000 },
    { month: "Mar", value: 8000 },
    { month: "Apr", value: 9000 },
    { month: "May", value: 10000 },
    { month: "Jun", value: 15000 },
    { month: "Jul", value: 12000 },
    { month: "Aug", value: 11000 },
    { month: "Sep", value: 10000 },
    { month: "Oct", value: 13000 },
    { month: "Nov", value: 15000 },
    { month: "Dec", value: 12000 },
  ],
};

const IncomeReport = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  // Handle year selection
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Income Report (under construction)
        </h2>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border rounded px-4 py-2 bg-white text-gray-600 focus:ring focus:ring-[#8CAB91]"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dataByYear[selectedYear]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          {/* Set the Y-axis ticks to specific values */}
          <YAxis
            ticks={[0, 10000, 20000, 30000, 40000]}
            tickFormatter={(tick) => `${tick / 1000}k`}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4caf50"
            fill="url(#colorValue)"
          />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeReport;
