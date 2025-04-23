import { useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "../ClickOutside.jsx";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../features/questionnarie/questionnarieApi"; // Adjust the path as needed

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch notifications using RTK Query, destructure the inner notifications array
  const { data: { notifications: notificationList = [] } = {}, isLoading } = useGetNotificationsQuery();

  // Hook to mark notification as read
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

  // Count unread notifications for the badge
  const unreadCount = notificationList.filter((notification) => notification.status === "unread").length;

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateNotificationStatus(notificationId).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Handle opening the dropdown and marking all as read
  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
    if (unreadCount > 0) {
      notificationList.forEach((notification) => {
        if (notification.status === "unread") {
          handleMarkAsRead(notification._id);
        }
      });
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={handleDropdownOpen}
          to="#"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 shadow-lg"
        >
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#8CAB91] text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}

          {/* Bell Icon */}
          <IoIosNotificationsOutline className="text-2xl text-[#5E5E5E]" />
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notifications
              </h5>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8CAB91]"></div>
              </div>
            ) : notificationList.length === 0 ? (
              <div className="px-4.5 py-3 text-center text-gray-500">
                No notifications found.
              </div>
            ) : (
              <ul className="flex h-auto flex-col overflow-y-auto">
                {notificationList.map((notification) => (
                  <li key={notification._id}>
                    <Link
                      className={`flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 ${
                        notification.status === "unread" ? "bg-gray-100" : ""
                      }`}
                      to="#"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <p className="text-sm">
                        <span
                          className={`${
                            notification.status === "unread"
                              ? "text-black font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </span>{" "}
                        {notification.userId && (
                          <span className="text-gray-600">
                            (User: {notification.userId.firstname}{" "}
                            {notification.userId.lastname})
                          </span>
                        )}
                      </p>

                      <p className="text-xs">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;