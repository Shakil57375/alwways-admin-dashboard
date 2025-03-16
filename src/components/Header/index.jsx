import { Link } from "react-router-dom"
import DropdownNotification from "./DropdownNotification.jsx"
import DropdownUser from "./DropdownUser.jsx"
import LogoIcon from "../../images/logo/logo.png"
import { useSelector } from "react-redux"
import { selectUser } from "../../features/auth/authSlice.js"

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector(selectUser)

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-sm md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
          >
            <span className="relative block h-6 w-6 cursor-pointer">
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-full rounded-sm bg-black transition-all duration-200 ${sidebarOpen ? "top-2.5 rotate-45" : ""}`}
              ></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-full rounded-sm bg-black transition-all duration-200 ${sidebarOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-full rounded-sm bg-black transition-all duration-200 ${sidebarOpen ? "top-[-3px] -rotate-45" : ""}`}
              ></span>
            </span>
          </button>

          {/* Logo for mobile */}
          <Link className="flex-shrink-0 lg:hidden" to="/">
            <img src={LogoIcon || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Middle section - can be used for search or other elements */}
        <div className="hidden md:block">{/* Optional: Add search or other elements here */}</div>

        {/* Right section - notifications and user dropdown */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification Menu Area */}
            <DropdownNotification />
          </ul>

          {/* User Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  )
}

export default Header

