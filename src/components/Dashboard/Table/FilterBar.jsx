
import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css" // Base styles
import "./customCalendar.css" // Custom calendar styles (optional)
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa"

const FilterBar = ({
  search,
  setSearch,
  subscription,
  setSubscription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isOrderManagement,
}) => {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <div className="flex flex-wrap items-center justify-between mb-4 space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 w-1/3 relative top-2"
      />

      {/* Subscription/Status Dropdown */}
      <select
        value={subscription}
        onChange={(e) => setSubscription(e.target.value)}
        className="border rounded px-4 py-2 w-1/4"
      >
        <option value="">All</option>
        {isOrderManagement ? (
          // Order status options
          <>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </>
        ) : (
          // Subscription type options
          <>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </>
        )}
      </select>

      {/* Date Range Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center space-x-2 bg-white border rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
        >
          <FaCalendarAlt />
          <span>
            {startDate && endDate
              ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
              : "Starting - Ending"}
          </span>

          {showCalendar ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showCalendar && (
          <div className="absolute z-50 right-0 top-10 mt-2 bg-white shadow-md rounded-lg p-4">
            <Calendar
              selectRange
              onChange={(range) => {
                setStartDate(range[0])
                setEndDate(range[1])
                setShowCalendar(false)
              }}
              value={[startDate, endDate]}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar

