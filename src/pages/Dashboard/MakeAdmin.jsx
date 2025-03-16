import { useState } from "react";
import Modal from "../Modals/Modal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import {
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
} from "../../features/admin/adminApi";

const MakeAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // RTK Query hooks
  const { data: admins = [], isLoading } = useGetAllAdminsQuery();
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  // Handle Add New Admin
  const handleAddAdmin = async () => {
    if (!name || !lastName || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    const fullName = `${name} ${lastName}`;

    try {
      await createAdmin({
        name: fullName,
        email,
        password,
      }).unwrap();

      toast.success("Admin created successfully!");
      setIsModalOpen(false);
      resetFields();
    } catch (error) {
      toast.error(error.data?.message || "Failed to create admin");
    }
  };

  // Handle Admin Deletion
  const handleConfirmDelete = async () => {
    if (!currentAdmin?._id) return;

    try {
      await deleteAdmin(currentAdmin._id).unwrap();
      toast.success("Admin deleted successfully!");
      setIsConfirmationOpen(false);
      setCurrentAdmin(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete admin");
    }
  };

  // Reset input fields
  const resetFields = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#8CAB91]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-medium text-black">Make Admin</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#8CAB91] text-[#FAF1E6] py-2 px-3 rounded-lg"
        >
          + Make Admin
        </button>
      </div>

      {/* Admin Table */}
      <div className="mt-6 bg-white">
        <table className="w-full border-collapse border rounded-lg">
          <thead>
            <tr className="bg-white border-b">
              <th className="px-4 py-2 text-left">S.ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">User Type</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.admins?.map((admin, index) => (
              <tr key={admin._id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{admin.firstname}</td>
                <td className="px-4 py-2">{admin.lastname}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2 text-green-600">{admin.role}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setCurrentAdmin(admin);
                      setIsConfirmationOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Make Admin Modal */}
      <Modal
        title="Make Admin"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="mb-4">
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Type here"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Type here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">User Type</label>
          <input
            type="text"
            value="Admin"
            disabled
            className="w-full border rounded px-4 py-2 bg-gray-100"
          />
        </div>
        <button
          onClick={handleAddAdmin}
          className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full"
        >
          Publish
        </button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MakeAdmin;
