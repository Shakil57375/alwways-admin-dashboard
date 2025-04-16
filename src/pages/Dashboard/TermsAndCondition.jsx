// pages/TermsAndCondition.jsx
import React from "react"
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor"

const TermsAndCondition = () => {
  return (
    <div className="p-6">
      <p className="text-3xl font-bold mb-8 text-black ">Terms and Conditions</p>
      <RichTextEditor type="terms" />
    </div>
  )
}

export default TermsAndCondition