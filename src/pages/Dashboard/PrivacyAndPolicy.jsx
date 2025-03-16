// pages/PrivacyAndPolicy.jsx
import React from "react"
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor"

const PrivacyAndPolicy = () => {
  return (
    <div className="p-6">
      <p className="text-3xl font-bold mb-8 text-black">Privacy and Policy</p>
      <RichTextEditor type="privacy" />
    </div>
  )
}

export default PrivacyAndPolicy