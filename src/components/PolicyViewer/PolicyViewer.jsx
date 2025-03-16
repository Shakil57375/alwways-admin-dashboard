const PolicyViewer = ({ content, title }) => {
    if (!content) {
      return (
        <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No {title} content available.</p>
        </div>
      )
    }
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="policy-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }
  
  export default PolicyViewer
  
  