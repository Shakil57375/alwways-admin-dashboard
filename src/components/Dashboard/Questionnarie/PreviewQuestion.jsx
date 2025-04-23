import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetSectionsQuery,
  useGetQuestionsBySectionQuery,
} from "../../../features/questionnarie/questionnarieApi";
import Modal from "../../../pages/Modals/Modal";

const PreviewQuestions = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newQuestionsEn, setNewQuestionsEn] = useState([""]);
  const [newQuestionsEs, setNewQuestionsEs] = useState([""]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editedQuestionTextEn, setEditedQuestionTextEn] = useState("");
  const [editedQuestionTextEs, setEditedQuestionTextEs] = useState("");

  // RTK Query hooks
  const { data: sections = [] } = useGetSectionsQuery();
  const section = sections.find((sec) => sec._id === sectionId);
  const { data: questions = [], isLoading: isLoadingQuestions } =
    useGetQuestionsBySectionQuery(sectionId);
  const [addQuestion, { isLoading: isAddingQuestion }] =
    useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdatingQuestion }] =
    useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  // Generate random episodeIndex
  const generateEpisodeIndex = () => {
    return Math.floor(Math.random() * 1000);
  };

  // Add a new question modal
  const openAddModal = () => {
    setNewQuestionsEn([""]);
    setNewQuestionsEs([""]);
    setIsAddModalOpen(true);
  };

  // Edit question modal
  const openEditModal = (question) => {
    setCurrentQuestion(question);
    setEditedQuestionTextEn(question.text.en);
    setEditedQuestionTextEs(question.text.es);
    setIsEditModalOpen(true);
  };

  // Handle adding questions
  const handleAddQuestion = async () => {
    const validQuestionsEn = newQuestionsEn.filter((q) => q.trim() !== "");
    const validQuestionsEs = newQuestionsEs.filter((q) => q.trim() !== "");

    if (
      validQuestionsEn.length === 0 ||
      validQuestionsEs.length === 0 ||
      validQuestionsEn.length !== validQuestionsEs.length
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter at least one question in both English and Spanish",
      });
      return;
    }

    try {
      const questionsData = {
        sectionId,
        questions: validQuestionsEn.map((q, idx) => ({
          en: q,
          es: validQuestionsEs[idx],
        })),
      };

      await addQuestion(questionsData).unwrap();

      setIsAddModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          validQuestionsEn.length > 1
            ? "Questions added successfully!"
            : "Question added successfully!",
      });
    } catch (error) {
      console.error("Error adding questions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Failed to add question(s)",
      });
    }
  };

  // Handle editing a question
  const handleEditQuestion = async () => {
    if (!editedQuestionTextEn.trim() || !editedQuestionTextEs.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Question text is required in both English and Spanish",
      });
      return;
    }

    try {
      await updateQuestion({
        id: currentQuestion._id,
        sectionId,
        episodeIndex: generateEpisodeIndex(),
        text: { en: editedQuestionTextEn, es: editedQuestionTextEs },
      }).unwrap();

      setIsEditModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Question updated successfully!",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Failed to update question",
      });
    }
  };

  // Delete a question with confirmation
  const handleDeleteQuestion = async (question) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteQuestion(question?._id).unwrap();

        Swal.fire("Deleted!", "The question has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting question:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.data?.message || "Failed to delete question",
        });
      }
    }
  };

  // Add more question inputs
  const addMoreQuestionInput = () => {
    setNewQuestionsEn([...newQuestionsEn, ""]);
    setNewQuestionsEs([...newQuestionsEs, ""]);
  };

  // Handle question input change
  const handleQuestionInputChangeEn = (index, value) => {
    const updatedQuestions = [...newQuestionsEn];
    updatedQuestions[index] = value;
    setNewQuestionsEn(updatedQuestions);
  };

  const handleQuestionInputChangeEs = (index, value) => {
    const updatedQuestions = [...newQuestionsEs];
    updatedQuestions[index] = value;
    setNewQuestionsEs(updatedQuestions);
  };

  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CAB91]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleBack}
            className="text-lg bg-[#8CAB91] p-2 rounded-full hover:bg-opacity-90 transition-colors"
          >
            <IoMdArrowRoundBack className="text-white text-2xl" />
          </button>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#8CAB91] text-[#FAF1E6] px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          + Add New Question
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className="flex items-center justify-between bg-[#FAF1E6] p-4 rounded-xl shadow border border-[#8CAB91]"
          >
            <div>
              <p className="text-black text-2xl font-medium">
                {index + 1}. {question.text.en}
              </p>
              <p className="text-black text-lg">{question.text.es}</p>
            </div>
            <div className="flex items-center space-x-4 text-[#212121]">
              <button
                onClick={() => openEditModal(question)}
                className="hover:text-[#8CAB91] transition-colors"
              >
                <FaRegEdit className="text-2xl" />
              </button>
              <button
                onClick={() => handleDeleteQuestion(question)}
                className="hover:text-red-500 transition-colors"
              >
                <AiOutlineDelete className="text-2xl" />
              </button>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions found. Click "Add New Question" to create one.
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      <Modal
        title="Add New Question"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <div className="space-y-4">
          {newQuestionsEn.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type question here (English)"
                  value={q}
                  onChange={(e) =>
                    handleQuestionInputChangeEn(index, e.target.value)
                  }
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                />
                {index === newQuestionsEn.length - 1 && (
                  <button
                    onClick={addMoreQuestionInput}
                    className="bg-[#8CAB91] text-white px-2 py-1 rounded hover:bg-opacity-90 transition-colors"
                  >
                    +
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Type question here (Spanish)"
                value={newQuestionsEs[index]}
                onChange={(e) =>
                  handleQuestionInputChangeEs(index, e.target.value)
                }
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddQuestion}
          disabled={isAddingQuestion}
          className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full mt-4 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingQuestion ? (
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
              Adding...
            </span>
          ) : (
            "Publish"
          )}
        </button>
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        title="Edit Question"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="mb-4">
          <label className="block font-medium mb-1">Question (English)</label>
          <input
            type="text"
            placeholder="Edit question here (English)"
            value={editedQuestionTextEn}
            onChange={(e) => setEditedQuestionTextEn(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Question (Spanish)</label>
          <input
            type="text"
            placeholder="Edit question here (Spanish)"
            value={editedQuestionTextEs}
            onChange={(e) => setEditedQuestionTextEs(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
          />
        </div>
        <button
          onClick={handleEditQuestion}
          disabled={isUpdatingQuestion}
          className="bg-[#8CAB91] text-white px-4 py-2 rounded-lg w-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingQuestion ? (
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
              Updating...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </Modal>
    </div>
  );
};

export default PreviewQuestions;
