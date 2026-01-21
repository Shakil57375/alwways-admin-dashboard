import React, { useState } from 'react';
import UserTable from '../../components/Dashboard/Table/UserTable';
import { FiDownload } from 'react-icons/fi';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);

  const handleExportCSV = () => {
    exportToCSV(usersData, 'users');
  };

  const handleExportExcel = () => {
    exportToExcel(usersData, 'users');
  };

  return (
    <div>
      <div className="mb-6 flex justify-end gap-4">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <FiDownload size={20} className="animate-bounce" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <FiDownload size={20} className="animate-bounce" />
          <span>Export Excel</span>
        </button>
      </div>
      <UserTable isDashboard={true} onDataUpdate={setUsersData} />
    </div>
  );
};

export default UserManagement;
