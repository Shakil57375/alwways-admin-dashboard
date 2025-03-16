"use client"
import { motion } from "framer-motion"
// import BookCollection from "../../components/Dashboard/OrderedBook"

const UserModal = ({ user, onClose, isOrderManagement }) => {
  if (!user) return null // If no user is selected, don't render the modal.

  const formatDate = (date) => {
    if (!date) return "Not Available"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, x: "200%" }, // Hidden state: moves out of view
    visible: { opacity: 1, x: "0%" }, // Visible state: slides into view
    exit: { opacity: 0, x: "200%" }, // Exit state: moves back out of view
  }

  // Prepare book data for OrderManagement view
  const bookData = isOrderManagement
    ? [
        {
          bookTitle: user.bookTitle || "Book Title",
          quantity: user.quantity || 1,
          price: user.price || 0,
        },
      ]
    : []

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10">
      <motion.div
        className="bg-white rounded-lg shadow-lg w-1/3 max-h-[100%] relative overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth animation
      >
        {/* Modal Header */}
        <div className="bg-[#8CAB91] p-6 flex items-center justify-between rounded-t-lg">
          <div className="flex flex-col items-center justify-center w-full">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <h2 className="mt-2 text-lg font-semibold text-[#FAF1E6] ">{user.name}</h2>
            <p className="text-sm text-[#FAF1E6]">{user.role || "user"}</p>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 text-[#FAF1E6] hover:text-red-600">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{user.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Contact No</h3>
            <p>{user.contactNumber}</p>
          </div>
          {!isOrderManagement && (
            <div>
              <h3 className="font-semibold">Date of Birth</h3>
              <p>{formatDate(user.date)}</p>
            </div>
          )}
          {!isOrderManagement && (
            <div>
              <h3 className="font-semibold">Subscription Type</h3>
              <p>{user.subscriptionType}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold">Address</h3>
            <p>{user.location || "Not Available"}</p>
          </div>
          {isOrderManagement && (
            <div>
              <h3 className="font-semibold">Order Status</h3>
              <p>{user.status}</p>
            </div>
          )}
          {isOrderManagement && (
            <div>
              <h3 className="font-semibold">Order Date</h3>
              <p>{formatDate(user.date)}</p>
            </div>
          )}
          {/* {isOrderManagement && (
            <div>
              <BookCollection books={bookData} />
            </div>
          )} */}
        </div>
      </motion.div>
    </div>
  )
}

export default UserModal

