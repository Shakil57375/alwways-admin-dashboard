import { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineDelete } from "react-icons/ai"
import { FaRegEdit } from "react-icons/fa"
import Modal from "../Modals/Modal"
import ConfirmationModal from "../Modals/ConfirmationModal"
import Banner from "../../components/Banner"
import { toast } from "react-hot-toast"
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../features/cupon/cuponApi"

const CouponTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [modalType, setModalType] = useState("add")
  const [currentCoupon, setCurrentCoupon] = useState(null)
  const [couponToDelete, setCouponToDelete] = useState(null)

  // RTK Query hooks
  const { data: coupons = [], isLoading } = useGetAllCouponsQuery()
  const [createCoupon] = useCreateCouponMutation()
  const [updateCoupon] = useUpdateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()

  // Form handling with React Hook Form
  const { register, handleSubmit, reset, setValue } = useForm()

  // Open Modal to Add Coupon
  const openAddModal = () => {
    setModalType("add")
    reset()
    setIsModalOpen(true)
  }

  // Open Modal to Edit Coupon
  const openEditModal = (coupon) => {
    setModalType("edit")
    setCurrentCoupon(coupon)
    setValue("name", coupon.name)
    setValue("code", coupon.code)
    setValue("discount", coupon.discount)
    setValue("startDate", coupon.startDate)
    setValue("endDate", coupon.endDate)
    setIsModalOpen(true)
  }

  // Open Delete Confirmation Modal
  const openDeleteConfirmation = (coupon) => {
    setCouponToDelete(coupon)
    setIsConfirmationOpen(true)
  }

  // Confirm Coupon Deletion
  const confirmDelete = async () => {
    try {
      await deleteCoupon(couponToDelete._id).unwrap()
      toast.success("Coupon deleted successfully!")
      setIsConfirmationOpen(false)
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete coupon")
    }
  }

  // Handle Form Submission for Add/Edit
  const onSubmit = async (data) => {
    try {
      if (modalType === "add") {
        await createCoupon(data).unwrap()
        toast.success("Coupon created successfully!")
      } else {
        await updateCoupon({
          id: currentCoupon._id,
          ...data,
        }).unwrap()
        toast.success("Coupon updated successfully!")
      }
      setIsModalOpen(false)
      reset()
    } catch (error) {
      toast.error(error.data?.message || "Failed to save coupon")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#8CAB91]"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium text-black">Coupons</h1>
        <button onClick={openAddModal} className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg hover:bg-green-600">
          + Add
        </button>
      </div>

      {/* Coupon Table */}
      <table className="w-full border-collapse border rounded-lg">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="px-4 py-2 text-left">S.ID</th>
            <th className="px-4 py-2 text-left">Coupon Code</th>
            <th className="px-4 py-2 text-left">Coupon Name</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons?.coupons?.map((coupon, index) => (
            <tr key={coupon._id} className="border-b">
              <td className="px-4 py-2">#{index + 1}</td>
              <td className="px-4 py-2">{coupon.code}</td>
              <td className="px-4 py-2">{coupon.name}</td>
              <td className="px-4 py-2">{coupon.discount}%</td>
              <td className="px-4 py-2">{new Date(coupon.startDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(coupon.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 flex space-x-4">
                <button onClick={() => openEditModal(coupon)}>
                  <FaRegEdit className="text-green-500 text-2xl" />
                </button>
                <button onClick={() => openDeleteConfirmation(coupon)}>
                  <AiOutlineDelete className="text-red-500 text-2xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Banner />
          {/* Coupon Name Input */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Coupon Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Type here"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Coupon Code Input */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Coupon Code</label>
            <input
              {...register("code", { required: true })}
              type="text"
              placeholder="Type here"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Discount Input */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Discount (%)</label>
            <input
              {...register("discount", { required: true })}
              type="number"
              placeholder="e.g. 20"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Start Date and End Date Inputs */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                {...register("startDate", { required: true })}
                type="date"
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                {...register("endDate", { required: true })}
                type="date"
                className="w-full border rounded px-4 py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full">
            {modalType === "add" ? "Create" : "Update"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default CouponTable

