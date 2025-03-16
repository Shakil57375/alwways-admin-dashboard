"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaRegEdit } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"
import { toast } from "react-hot-toast"
import {
  useGetAllSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../../features/subscription/subscriptionApi"
import Modal from "../Modals/Modal"
import ConfirmationModal from "../Modals/ConfirmationModal"

// Available offers for checkboxes
const availableOffers = [
  "Unlimited chat with the AI Chat Bot",
  "Access full book",
  "200 images",
  "New feature added",
  "Downloadable soft copy Pdf book",
  "$10 off on physical book",
]

// Package options for dropdown
const packageOptions = ["Free", "Normal", "Standard", "Premium", "Golden"]

const SubscriptionPage = () => {
  // State for modals and form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [modalType, setModalType] = useState("add")
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [selectedOffers, setSelectedOffers] = useState([])

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  // RTK Query hooks
  const { data: subscriptions = [], isLoading, isError, error } = useGetAllSubscriptionsQuery()

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation()
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation()

  // Open Add Modal
  const openAddModal = () => {
    setModalType("add")
    reset()
    setSelectedOffers([])
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (subscription) => {
    setModalType("edit")
    setCurrentSubscription(subscription)

    // Format dates for the form
    const formatDate = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    }

    // Set form values
    setValue("title", subscription.title)
    setValue("description", subscription.description || "")
    setValue("price", subscription.price)
    setValue("discount", subscription.discount || 0)
    setValue("startDate", formatDate(subscription.startDate))
    setValue("endDate", formatDate(subscription.endDate))

    // Set selected benefits
    setSelectedOffers(subscription.benefits || [])

    setIsModalOpen(true)
  }

  // Open Delete Confirmation Modal
  const openDeleteConfirmation = (subscription) => {
    setCurrentSubscription(subscription)
    setIsConfirmationOpen(true)
  }

  // Handle Delete Subscription
  const handleConfirmDelete = async () => {
    if (!currentSubscription || !currentSubscription._id) {
      toast.error("Invalid subscription ID")
      return
    }

    try {
      await deleteSubscription(currentSubscription._id).unwrap()
      toast.success(`Subscription "${currentSubscription.title}" deleted successfully`)
      setIsConfirmationOpen(false)
    } catch (err) {
      console.error("Delete error:", err)
      toast.error(err.data?.message || "Failed to delete subscription")
    }
  }

  // Handle Add/Edit Submission
  const onSubmit = async (data) => {
    try {
      const subscriptionData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        discount: Number(data.discount || 0),
        benefits: selectedOffers,
        startDate: data.startDate,
        endDate: data.endDate,
      }

      if (modalType === "add") {
        await createSubscription(subscriptionData).unwrap()
        toast.success("Subscription created successfully")
      } else if (modalType === "edit") {
        await updateSubscription({
          id: currentSubscription._id,
          ...subscriptionData,
        }).unwrap()
        toast.success("Subscription updated successfully")
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error("Submission error:", err)
      toast.error(err.data?.message || "Failed to save subscription")
    }
  }

  // Handle Offer Checkbox Changes
  const handleOfferChange = (offer) => {
    if (selectedOffers.includes(offer)) {
      setSelectedOffers(selectedOffers.filter((o) => o !== offer))
    } else {
      setSelectedOffers([...selectedOffers, offer])
    }
  }

  // Format price to display with $ sign
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `$${price}`
    }
    return price
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CAB91]"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error?.data?.message || "Failed to load subscriptions"}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium text-black">Subscriptions</h1>
        <button
          onClick={openAddModal}
          className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Subscription Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No subscriptions found. Click &quot;Add&quot; to create one.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => (
                <tr key={subscription._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{subscription._id.substring(0, 6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subscription.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(subscription.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscription.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => openEditModal(subscription)}
                        className="text-[#8CAB91] hover:text-green-700 transition-colors"
                        title="Edit subscription"
                      >
                        <FaRegEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(subscription)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete subscription"
                      >
                        <AiOutlineDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={modalType === "add" ? "Create Subscription" : "Edit Subscription"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", { required: "Package name is required" })}
                type="text"
                placeholder="Premium"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Package Price <span className="text-red-500">*</span>
              </label>
              <input
                {...register("price", {
                  required: "Price is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid number",
                  },
                })}
                type="text"
                placeholder="30"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              placeholder="Access full content for 30 days"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              rows="2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Discount (%)</label>
            <input
              {...register("discount", {
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid number",
                },
              })}
              type="text"
              placeholder="10"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
            />
            {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("startDate", {
                  required: "Start date is required",
                })}
                type="date"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("endDate", { required: "End date is required" })}
                type="date"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Package Benefits</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
              {availableOffers.map((offer) => (
                <label key={offer} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOffers.includes(offer)}
                    onChange={() => handleOfferChange(offer)}
                    className="form-checkbox h-4 w-4 text-[#8CAB91] rounded focus:ring-[#8CAB91]"
                  />
                  <span className="text-sm">{offer}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isUpdating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {modalType === "add" ? "Creating..." : "Updating..."}
              </span>
            ) : modalType === "add" ? (
              "Create Subscription"
            ) : (
              "Update Subscription"
            )}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        subscriptionId={currentSubscription?._id}
        subscriptionName={currentSubscription?.title}
      />
    </div>
  )
}

export default SubscriptionPage

