import React from "react";
import { FaEye } from "react-icons/fa";

const TableRow = ({ item, onRowClick, isOrderManagement, isDashboard }) => {
  return (
    <tr className="border-b bg-white">
      <td className="px-4 py-2">{item.id}</td>
      <td className="px-4 py-2 flex items-center space-x-2">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-8 h-8 rounded-full"
        />
        <span>{item.name}</span>
      </td>
      <td className="px-4 py-2">{item.email}</td>
      <td className="px-4 py-2">{item.contactNumber}</td>
      <td className="px-4 py-2">{item.location}</td>
      {!isDashboard && (
        <td
          className={`px-4 py-2 ${
            item.status === "confirm"
              ? "text-green-500"
              : item.status === "cancel"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          {item?.status}
        </td>
      )}
      {/* Conditionally render Subscription Type */}
      {!isOrderManagement && (
        <td className="px-4 py-2">{item.subscriptionType}</td>
      )}
      {/* Conditionally render Income */}
      {!isOrderManagement && <td className="px-4 py-2">${item.income}</td>}

      {isDashboard && (
        <td className="px-4 py-2 text-center">
          <button
            className="flex items-center justify-center gap-2"
            onClick={() => onRowClick(item)}
          >
            <FaEye className="text-gray-500 cursor-pointer  relative left-8" />
          </button>
        </td>
      )}
      {isOrderManagement && (
        <td className="px-4 py-2 text-center">
          <button
            className="flex items-center justify-center gap-2"
            onClick={() => onRowClick(item)}
          >
            <FaEye className="text-gray-500 cursor-pointer  relative left-12" />
          </button>
        </td>
      )}
    </tr>
  );
};

export default TableRow;
