import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  useGetSectionsQuery,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../features/questionnarie/questionnarieApi";
import Modal from "../Modals/Modal";

const Questionnaire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentSection, setCurrentSection] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [sectionQuestions, setSectionQuestions] = useState("");

  // RTK Query hooks
  const { data: sections = [], isLoading } = useGetSectionsQuery();
  const [addSection, { isLoading: isAdding }] = useAddSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  const openAddModal = () => {
    setModalType("add");
    setSectionName("");
    setSectionQuestions("");
    setIsModalOpen(true);
  };

  const openEditModal = (section) => {
    setModalType("edit");
    setCurrentSection(section);
    setSectionName(section.name);
    setSectionQuestions(section.numberOfQuestions.toString());
    setIsModalOpen(true);
  };

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Section name is required",
      });
      return;
    }

    try {
      await addSection({
        name: sectionName,
        numberOfQuestions: Number.parseInt(sectionQuestions, 10) || 10,
      }).unwrap();

      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Section added successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Failed to add section",
      });
    }
  };

  const handleEditSection = async () => {
    if (!sectionName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Section name is required",
      });
      return;
    }

    try {
      await updateSection({
        id: currentSection._id,
        name: sectionName,
        numberOfQuestions: Number.parseInt(sectionQuestions, 10),
      }).unwrap();

      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Section updated successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Failed to update section",
      });
    }
  };

  const handleDeleteSection = async (section) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete the section "${section.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSection(section._id).unwrap();
        Swal.fire(
          "Deleted!",
          `The section "${section.name}" has been deleted.`,
          "success"
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.data?.message || "Failed to delete section",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CAB91]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium text-black">Questionnaire</h1>
        <button
          onClick={openAddModal}
          className="bg-[#8CAB91] text-[#FAF1E6] px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          + Add new Section
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section._id}
            className="flex items-center justify-between bg-[#FFFDFA] p-4 rounded-lg shadow border border-[#8CAB91]"
          >
            <div>
              <h2 className="text-2xl font-medium text-black">
                {section.name}
              </h2>
              <p className="text-sm text-[#8CAB91]">
                {section.questionsAdded || 0}/{section.numberOfQuestions}{" "}
                Questions Added
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[#8CAB91]">
              <Link
                to={`/addQuestionnaire/previewQuestion/${section._id}`}
                className="hover:text-opacity-80 transition-colors"
              >
                <IoEyeOutline className="text-2xl" />
              </Link>
              <button
                onClick={() => handleDeleteSection(section)}
                className="hover:text-red-500 transition-colors"
              >
                <AiOutlineDelete className="text-2xl" />
              </button>
              <button
                onClick={() => openEditModal(section)}
                className="hover:text-opacity-80 transition-colors"
              >
                <FaRegEdit className="text-2xl" />
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sections found. Click "Add new Section" to create one.
          </div>
        )}
      </div>

      <Modal
        title={modalType === "add" ? "Add New Section" : "Edit Section"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="mb-4">
          <label className="block font-medium mb-1">Section Name</label>
          <input
            type="text"
            placeholder="Type here"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Number of Questions</label>
          <input
            type="number"
            placeholder="Type here"
            value={sectionQuestions}
            onChange={(e) => setSectionQuestions(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
            min="1"
          />
        </div>
        <button
          onClick={modalType === "add" ? handleAddSection : handleEditSection}
          disabled={isAdding || isUpdating}
          className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding || isUpdating ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {modalType === "add" ? "Adding..." : "Updating..."}
            </span>
          ) : modalType === "add" ? (
            "Publish"
          ) : (
            "Save Changes"
          )}
        </button>
      </Modal>
    </div>
  );
};

export default Questionnaire;
