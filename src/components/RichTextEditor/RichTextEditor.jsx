// components/RichTextEditor/RichTextEditor.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import {
  useFetchPoliciesQuery,
  useUpdatePoliciesMutation,
} from "../../features/settings/settingsApi";

const RichTextEditor = ({ type = "terms" }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch policies
  const { data: policies, isLoading: isFetching } = useFetchPoliciesQuery();
  const [updatePolicies, { isLoading: isUpdating }] =
    useUpdatePoliciesMutation();

  // Set initial content based on type
  useEffect(() => {
    if (policies) {
      setContent(
        type === "terms" ? policies.termsAndConditions : policies.privacyPolicy
      );
    }
  }, [policies, type]);

  // Editor configuration
  const config = {
    readonly: !isEditMode,
    toolbarSticky: true,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "eraser",
      "superscript",
      "subscript",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "table",
      "link",
      "image",
      "hr",
      "|",
      "undo",
      "redo",
      "fullsize",
    ],
    buttonsXS: [
      "bold",
      "italic",
      "underline",
      "align",
      "ul",
      "ol",
      "undo",
      "redo",
    ],
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    toolbarInline: false,
    height: 500,
    width: "100%",
    placeholder: "Start typing here...",
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const handleSave = async () => {
    try {
      const updatedData =
        type === "terms"
          ? { termsAndConditions: content }
          : { privacyPolicy: content };

      await updatePolicies(updatedData).unwrap();
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {type === "terms" ? "Terms and Conditions" : "Privacy Policy"}
        </h3>
        <button
          onClick={toggleEditMode}
          className="px-3 py-1 bg-[#8CAB91] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          {isEditMode ? "View " : "Edit "}
        </button>
      </div>

      {isFetching ? (
        <div className="p-4">Loading...</div>
      ) : (
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
          onChange={(newContent) => {}}
          className="border border-gray-300"
        />
      )}

      {isEditMode && (
        <div className="flex justify-end p-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#8CAB91] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
