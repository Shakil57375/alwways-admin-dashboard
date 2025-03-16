import { useState } from "react"
import FilterBar from "./FilterBar.jsx"
import Table from "./Table.jsx"
import UserModal from "../../../pages/Modals/UserModal.jsx"
import { AnimatePresence } from "framer-motion"
import { useGetAllUsersQuery } from "../../../features/user/userApi.js"
import { useGetAllOrdersQuery } from "../../../features/order/orderApi.js"
const UserTable = ({ isDashboard, isOrderManagement }) => {
  const [search, setSearch] = useState("")
  const [subscription, setSubscription] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  // Use the appropriate query based on whether we're showing orders or users
  const {
    data: userData = [],
    isLoading: isLoadingUsers,
    isError: isUserError,
    error: userError,
  } = useGetAllUsersQuery(undefined, {
    skip: isOrderManagement, // Skip this query if we're in order management
  })

  const {
    data: orderData = [],
    isLoading: isLoadingOrders,
    isError: isOrderError,
    error: orderError,
  } = useGetAllOrdersQuery(undefined, {
    skip: !isOrderManagement, // Skip this query if we're not in order management
  })

  // Determine which data to use
  const data = isOrderManagement ? orderData : userData
  const isLoading = isOrderManagement ? isLoadingOrders : isLoadingUsers
  const isError = isOrderManagement ? isOrderError : isUserError
  const error = isOrderManagement ? orderError : userError

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      false ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      false

    const matchesSubscription = subscription
      ? isOrderManagement
        ? item.status === subscription
        : item.subscriptionType === subscription
      : true

    const matchesDate =
      (!startDate || new Date(item.date) >= new Date(startDate)) &&
      (!endDate || new Date(item.date) <= new Date(endDate))

    return matchesSearch && matchesSubscription && matchesDate
  })

  const handleRowClick = (user) => {
    setSelectedUser(user) // Open the modal with selected user details
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">{isOrderManagement ? "Order list" : "Subscriber"}</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CAB91]"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">{isOrderManagement ? "Order list" : "Subscriber"}</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error?.data?.message || "Failed to load data"}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{isOrderManagement ? "Order list" : "Users"}</h1>
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
      />
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
    </div>
  )
}

export default UserTable

