import { motion, AnimatePresence } from "framer-motion"

const ConfirmationModal = ({ isOpen, onClose, onConfirm, subscriptionId, subscriptionName }) => {
  // Framer Motion animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Starting state: faded out and smaller
    visible: { opacity: 1, scale: 1 }, // Fully visible and normal scale
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }, // Exit: fade and shrink
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {/* Modal Content */}
          <motion.div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 max-h-[90vh] overflow-y-auto relative"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth animation
            >
              <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
                ✕
              </button>
              <h2 className="text-lg font-bold text-red-600 text-center mb-2">Are you sure?</h2>
              <p className="text-center text-gray-700 font-medium mb-4">
                {subscriptionName ? (
                  <>
                    Do you want to delete the <span className="text-[#8CAB91] font-semibold">{subscriptionName}</span>{" "}
                    subscription?
                  </>
                ) : (
                  "Do you want to delete this subscription?"
                )}
              </p>
              <p className="text-center text-gray-500 text-sm mb-6">
                This action cannot be undone. Subscription ID:{" "}
                {subscriptionId ? (
                  <span className="font-mono bg-gray-100 px-1 rounded">{subscriptionId}</span>
                ) : (
                  "Unknown"
                )}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationModal

