import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import login_image from "../../images/login/login_page_logo.png"
import { AuthContext } from "../../context/AuthContext"
import { useForgotPasswordMutation } from "../../features/auth/authApi"

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setOtpEmail } = useContext(AuthContext)

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    try {
      await forgotPassword(email).unwrap()
      setOtpEmail(email) // Store email for later use
      toast.success("Verification code sent to your email")
      navigate("/auth/verifyOTP")
    } catch (err) {
      setError(err.data?.message || "Failed to send verification code")
      toast.error(err.data?.message || "Failed to send verification code")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDFA]">
      <div className="flex flex-col md:flex-row items-center rounded-lg p-8 w-full h-[500px] max-w-7xl">
        {/* Logo Section */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-0">
          <img src={login_image || "/placeholder.svg"} alt="Logo" className="w-[483px] h-[280px] mb-4" />
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full max-w-md">
          <h2 className="text-5xl font-medium mb-4 text-[#364636] text-center">Forgot Password</h2>
          <p className="text-[#364636] mb-6 text-sm font-medium text-center">
            Please enter your registered email to receive a verification code
          </p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full p-3 border-2 border-[#8CAB91] bg-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-[430px] h-12 py-4 px-8 bg-[#8CAB91] text-[#FAF1E6] hover:text-white rounded-3xl text-base flex items-center justify-center ${
                isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-105 duration-200"
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                "Confirm"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordForm

