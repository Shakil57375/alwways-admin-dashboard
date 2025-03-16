"use client"

import { useRef, useEffect, useState } from "react"
import JoditEditor from "jodit-react"

const SimpleEditor = ({ initialContent = "", onSave, loading = false }) => {
  const editorRef = useRef(null)
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
    }
  }, [initialContent])

  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <JoditEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        config={{
          placeholder: "Enter your content here...",
          buttons: "bold,italic,underline,|,ul,ol,|,image,link,|,undo,redo",
          height: 400,
        }}
      />

      <div className="flex justify-between p-3 bg-gray-50 rounded-b-lg border-t border-gray-200 mt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-[#8CAB91] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  )
}

export default SimpleEditor
