import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';

const TableRow = ({
  item,
  onRowClick,
  onDeleteClick,
  isOrderManagement,
  isDashboard,
}) => {
  return (
    <tr className="border-b bg-white hover:bg-gray-50 transition-colors">
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
            item.status === 'Active'
              ? 'text-green-500'
              : item.status === 'Blocked'
                ? 'text-red-500'
                : item.status === 'confirm'
                  ? 'text-green-500'
                  : item.status === 'cancel'
                    ? 'text-red-500'
                    : 'text-yellow-500'
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

      <td className="px-4 py-2">
        <div className="flex items-center justify-center gap-3">
          {/* View Button */}
          <button
            className="text-gray-500 hover:text-[#8CAB91] transition-colors"
            onClick={() => onRowClick(item)}
            title="View Details"
          >
            <FaEye className="text-lg" />
          </button>

          {/* Delete Button - Only show for user management (not orders or dashboard) */}
          {/* {!isOrderManagement && !isDashboard && (
            <button
              className="text-gray-500 hover:text-red-500 transition-colors"
              onClick={(e) => onDeleteClick(item, e)}
              title="Delete User"
            >
              <FaTrash className="text-lg" />
            </button>
          )} */}
          <button
            className="text-gray-500 hover:text-red-500 transition-colors"
            onClick={(e) => onDeleteClick(item, e)}
            title="Delete User"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
