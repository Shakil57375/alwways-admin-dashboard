import { useState } from 'react';
import FilterBar from './FilterBar.jsx';
import Table from './Table.jsx';
import UserModal from '../../../pages/Modals/UserModal.jsx';
import { AnimatePresence } from 'framer-motion';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from '../../../features/user/userApi.js';
import { useGetAllOrdersQuery } from '../../../features/order/orderApi.js';
import { toast } from 'react-hot-toast';

const UserTable = ({ isDashboard, isOrderManagement }) => {
  const [search, setSearch] = useState('');
  const [subscription, setSubscription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation

  // Use the appropriate query based on whether we're showing orders or users
  const {
    data: userData = [],
    isLoading: isLoadingUsers,
    isError: isUserError,
    error: userError,
  } = useGetAllUsersQuery(undefined, {
    skip: isOrderManagement, // Skip this query if we're in order management
  });

  const {
    data: orderData = [],
    isLoading: isLoadingOrders,
    isError: isOrderError,
    error: orderError,
  } = useGetAllOrdersQuery(undefined, {
    skip: !isOrderManagement, // Skip this query if we're not in order management
  });

  // Delete user mutation
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Determine which data to use
  const data = isOrderManagement ? orderData : userData;
  const isLoading = isOrderManagement ? isLoadingOrders : isLoadingUsers;
  const isError = isOrderManagement ? isOrderError : isUserError;
  const error = isOrderManagement ? orderError : userError;

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      false ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      false;

    const matchesSubscription = subscription
      ? isOrderManagement
        ? item.status === subscription
        : item.subscriptionType === subscription
      : true;

    const matchesDate =
      (!startDate || new Date(item.date) >= new Date(startDate)) &&
      (!endDate || new Date(item.date) <= new Date(endDate));

    return matchesSearch && matchesSubscription && matchesDate;
  });

  const handleRowClick = (user) => {
    setSelectedUser(user); // Open the modal with selected user details
  };

  const handleDeleteClick = (user, e) => {
    e.stopPropagation(); // Prevent row click
    setDeleteConfirm(user); // Open delete confirmation
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await deleteUser(deleteConfirm.id).unwrap();
      toast.success(response.message || 'User deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.data?.message || 'Failed to delete user');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          {isOrderManagement ? 'Order list' : 'Subscriber'}
        </h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CAB91]"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          {isOrderManagement ? 'Order list' : 'Subscriber'}
        </h1>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {' '}
            {error?.data?.message || 'Failed to load data'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {isOrderManagement ? 'Order list' : 'Users'}
      </h1>
      <FilterBar
        search={search}
        setSearch={setSearch}
        subscription={subscription}
        setSubscription={setSubscription}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isOrderManagement={isOrderManagement}
      />
      <Table
        isDashboard={isDashboard}
        isOrderManagement={isOrderManagement}
        data={filteredData}
        onRowClick={handleRowClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <UserModal
            isOrderManagement={isOrderManagement}
            isDashboard={isDashboard}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete user{' '}
                <strong>{deleteConfirm.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserTable;
