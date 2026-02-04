import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Data for different years
const dataByYear = {
  2024: [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 60 },
    { month: "May", value: 30 },
    { month: "Jun", value: 40 },
    { month: "Jul", value: 80 },
    { month: "Aug", value: 75 },
    { month: "Sep", value: 90 },
    { month: "Oct", value: 85 },
    { month: "Nov", value: 95 },
    { month: "Dec", value: 50 },
  ],
  2023: [
    { month: "Jan", value: 90 },
    { month: "Feb", value: 60 },
    { month: "Mar", value: 70 },
    { month: "Apr", value: 80 },
    { month: "May", value: 50 },
    { month: "Jun", value: 30 },
    { month: "Jul", value: 60 },
    { month: "Aug", value: 55 },
    { month: "Sep", value: 85 },
    { month: "Oct", value: 75 },
    { month: "Nov", value: 65 },
    { month: "Dec", value: 70 },
  ],
  2022: [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 40 },
    { month: "Mar", value: 60 },
    { month: "Apr", value: 50 },
    { month: "May", value: 30 },
    { month: "Jun", value: 50 },
    { month: "Jul", value: 40 },
    { month: "Aug", value: 45 },
    { month: "Sep", value: 70 },
    { month: "Oct", value: 60 },
    { month: "Nov", value: 55 },
    { month: "Dec", value: 50 },
  ],
  2021: [
    { month: "Jan", value: 30 },
    { month: "Feb", value: 25 },
    { month: "Mar", value: 40 },
    { month: "Apr", value: 35 },
    { month: "May", value: 20 },
    { month: "Jun", value: 30 },
    { month: "Jul", value: 50 },
    { month: "Aug", value: 45 },
    { month: "Sep", value: 60 },
    { month: "Oct", value: 55 },
    { month: "Nov", value: 50 },
    { month: "Dec", value: 45 },
  ],
};

const SubscriberGrowth = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Subscriber Growth (under construction)</h2>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border rounded px-4 py-2 bg-white text-gray-600 focus:ring focus:ring-green-300"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataByYear[selectedYear]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="value" fill="#8CAB91" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriberGrowth;
