const StatCard = ({ icon, value, description, growth, growthIcon, currency }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#8CAB91]">{icon}</div>
        {growth && (
          <div className="flex items-center text-green-600">
            {growthIcon}
            <span className="ml-1 text-sm">{growth}</span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <h3 className="text-3xl font-bold">
          {currency && <span>{currency}</span>}
          {value}
        </h3>
      </div>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

export default StatCard

