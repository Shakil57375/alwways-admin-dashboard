import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import { AuthContext } from '../../context/AuthContext';
import { useGetUserProfileQuery } from '../../features/user/userApi';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetUserProfileQuery();
  console.log(profileData);
  const { auth } = useContext(AuthContext);
  console.log(auth);
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="/profile"
      >
        <span className="h-12 w-12 rounded-full">
          <img src={profileData?.profilePicture} alt="User" />
        </span>

        <span className="hidden text-right lg:block">
          <span className="block text-lg font-medium text-[#364636] ">
            {auth?.firstname} {auth?.lastname}
          </span>
        </span>
      </Link>
    </ClickOutside>
  );
};

export default DropdownUser;
