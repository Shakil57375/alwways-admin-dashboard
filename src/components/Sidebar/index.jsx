import { useEffect, useRef, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { FiShoppingBag } from "react-icons/fi"
import { GoChecklist } from "react-icons/go"
import { MdDashboard } from "react-icons/md"
import { TiUserAddOutline } from "react-icons/ti"
import { ImPower } from "react-icons/im"
import { IoMdSettings } from "react-icons/io"
import { BiLogOut } from "react-icons/bi"
import { useDispatch } from "react-redux"
import { userLoggedOut } from "../../features/auth/authSlice"
import LogoIcon from "../../images/logo/logo.png"

// SidebarLinkGroup component for dropdown menus
const SidebarLinkGroup = ({ children, activeCondition }) => {
  const [open, setOpen] = useState(activeCondition)

  const handleClick = () => {
    setOpen(!open)
  }

  return <li>{children(handleClick, open)}</li>
}

// NavItem component to reduce repetition
const NavItem = ({ to, icon: Icon, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 md:px-8 font-medium text-[#364636] duration-300 ease-in-out ${
            isActive
              ? "bg-[#8CAB91] !text-white before:content-[''] before:absolute before:top-0 before:left-0 md:before:left-2 before:h-full before:w-1 md:before:w-3 before:bg-[#FAF1E6]"
              : "hover:bg-[#8CAB91] hover:text-white"
          }`
        }
      >
        <Icon className="text-xl md:text-2xl" />
        <span className="text-sm md:text-base">{children}</span>
      </NavLink>
    </li>
  )
}

// DropdownItem component for dropdown menu items
const DropdownItem = ({ to, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "group relative flex items-center gap-2.5 hover:!bg-[#8CAB91] hover:!text-white px-8 md:px-16 py-2 font-medium text-[#364636] text-sm md:text-base duration-300 ease-in-out " +
          (isActive &&
            "!bg-[#8CAB91] !text-white before:content-[''] before:absolute before:top-0 before:left-0 md:before:left-2 before:h-full before:w-1 md:before:w-3 before:bg-[#FAF1E6]")
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const { pathname } = location
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const trigger = useRef(null)
  const sidebar = useRef(null)

  // For logout functionality
  const handleLogout = () => {
    dispatch(userLoggedOut())
  }

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded")
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  )

  // Close sidebar on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
      setSidebarOpen(false)
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  })

  // Close sidebar if the Esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  })

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded")
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded")
    }
  }, [sidebarExpanded])

  // Navigation items data
  const navItems = [
    { to: "/", icon: MdDashboard, label: "Dashboard" },
    { to: "/orderManagement", icon: FiShoppingBag, label: "Order Management" },
    { to: "/addQuestionnaire", icon: GoChecklist, label: "Add Questionnaire" },
    { to: "/makeAdmin", icon: TiUserAddOutline, label: "Make Admin" },
  ]

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 z-50 flex h-screen w-64 md:w-72.5 flex-col overflow-y-hidden bg-[#FAF1E6] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-4 md:px-6 py-4 lg:py-6">
        <NavLink to="/" className="flex items-center">
          <img src={LogoIcon || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-3 py-4">
          <ul className="mb-6 flex flex-col gap-1">
            {/* Main Navigation Items */}
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavItem>
            ))}

            {/* Subscription Dropdown */}
            <SidebarLinkGroup activeCondition={pathname === "/subscription" || pathname.includes("/subscription")}>
              {(handleClick, open) => (
                <>
                  <NavLink
                    to="#"
                    className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 md:px-8 font-medium text-[#364636] duration-300 ease-in-out hover:bg-[#8CAB91] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                    }}
                  >
                    <ImPower className="text-xl md:text-2xl" />
                    <span className="text-sm md:text-base">Subscription</span>
                    <svg
                      className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 fill-current transition-transform ${
                        open && "rotate-180"
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                        fill=""
                      />
                    </svg>
                  </NavLink>
                  {/* Dropdown Menu */}
                  <div className={`transform overflow-hidden transition-all duration-300 ${!open && "hidden"}`}>
                    <ul className="mt-2 mb-4 flex flex-col gap-2">
                      <DropdownItem to="/subscription/subscription">Subscription</DropdownItem>
                      <DropdownItem to="/subscription/couponCode">Coupon code</DropdownItem>
                    </ul>
                  </div>
                </>
              )}
            </SidebarLinkGroup>

            {/* Settings Dropdown */}
            <SidebarLinkGroup activeCondition={pathname === "/settings" || pathname.includes("/settings")}>
              {(handleClick, open) => (
                <>
                  <NavLink
                    to="#"
                    className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 md:px-8 font-medium text-[#364636] duration-300 ease-in-out hover:bg-[#8CAB91] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                    }}
                  >
                    <IoMdSettings className="text-xl md:text-2xl" />
                    <span className="text-sm md:text-base">Settings</span>
                    <svg
                      className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 fill-current transition-transform ${
                        open && "rotate-180"
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                        fill=""
                      />
                    </svg>
                  </NavLink>
                  {/* Dropdown Menu */}
                  <div className={`transform overflow-hidden transition-all duration-300 ${!open && "hidden"}`}>
                    <ul className="mt-2 mb-4 flex flex-col gap-2">
                      <DropdownItem to="/settings/termsAndConditions">Terms & condition</DropdownItem>
                      <DropdownItem to="/settings/privacyAndPolicy">Privacy policy</DropdownItem>
                    </ul>
                  </div>
                </>
              )}
            </SidebarLinkGroup>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="absolute bottom-8 left-0 right-0 mx-auto flex items-center justify-center gap-2 cursor-pointer px-4 md:px-8 py-2  rounded-md transition-colors"
          onClick={handleLogout}
        >
          <BiLogOut className="text-red-500 text-xl md:text-2xl rotate-180" />
          <p className="text-[#364636] text-sm md:text-base font-medium">Logout</p>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

