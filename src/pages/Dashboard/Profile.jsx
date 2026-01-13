import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaArrowUp } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import {
  useGetUserProfileQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
} from '../../features/user/userApi';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const [selectedTab, setSelectedTab] = useState('editProfile');
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const profilePicture = watch('profilePicture');
  const { auth, setAuth } = useContext(AuthContext);

  // RTK Query - Get Profile
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetUserProfileQuery();
  console.log(profileData);
  // RTK Query Mutations
  const [updateAdminProfile, { isLoading: isUpdatingProfile }] =
    useUpdateAdminProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  // Pre-populate form with fetched profile data
  useEffect(() => {
    if (profileData) {
      const userData = profileData;

      setValue(
        'userName',
        `${userData.firstname || ''} ${userData.lastname || ''}`.trim()
      );
      setValue('email', userData.email || '');
      setValue('contact', userData.mobile || '');
      setValue('address', userData.location || '');

      // Set existing profile picture as preview
      if (userData.profilePicture) {
        setPreviewImage(userData.profilePicture);
      }

      // Update auth context with fresh profile data
      if (setAuth) {
        setAuth(userData);
        localStorage.setItem('auth', JSON.stringify(userData));
      }
    }
  }, [profileData, setValue, setAuth]);

  // Fallback to auth context if profile data is still loading
  useEffect(() => {
    if (!profileData && auth) {
      setValue(
        'userName',
        `${auth.firstname || ''} ${auth.lastname || ''}`.trim()
      );
      setValue('email', auth.email || '');
      setValue('contact', auth.mobile || '');
      setValue('address', auth.location || '');

      if (auth.profilePicture) {
        setPreviewImage(auth.profilePicture);
      }
    }
  }, [auth, profileData, setValue]);

  // Update the preview image when profilePicture changes
  useEffect(() => {
    if (profilePicture && profilePicture.length > 0) {
      const file = profilePicture[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  }, [profilePicture]);

  // Handle profile form submission
  const handleProfileSubmit = async (data) => {
    try {
      // Create form data to send to backend
      const formData = new FormData();

      // Only append profile picture if a new one is selected
      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append('profilePicture', data.profilePicture[0]);
      }

      // Create userData object with all text fields
      const userData = {
        userName: data.userName,
        email: data.email,
        contact: data.contact,
        address: data.address,
      };

      // Append userData as JSON string
      formData.append('userData', JSON.stringify(userData));

      // Call the mutation
      const response = await updateAdminProfile(formData).unwrap();

      // Refetch profile data to get updated information
      await refetch();

      toast.success(response.message || 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  // Handle password change form submission
  const handlePasswordSubmit = async (data) => {
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }

    try {
      // Create FormData similar to profile update
      const formData = new FormData();

      const passwordData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      // Append as userData JSON string
      formData.append('userData', JSON.stringify(passwordData));

      const response = await changePassword(formData).unwrap();

      toast.success(response.message || 'Password updated successfully!');

      // Reset password form
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  // Get display data (prefer profileData, fallback to auth)
  const displayData = profileData || auth;

  if (isLoadingProfile) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg w-[750px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg w-[750px] mx-auto">
      <h1 className="text-2xl font-medium text-black">
        Admin Profile (Super Admin)
      </h1>

      {/* Admin Info Header */}
      <div className="mt-6 bg-[#8CAB91] rounded-lg p-6 text-white flex items-center space-x-4 justify-center">
        <div className="relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Admin Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-24 h-24 flex flex-col items-center justify-center text-white border-2 border-gray-300 rounded-full bg-gray-100">
              <FaImage className="text-3xl text-gray-400" />
            </div>
          )}
          {/* Upload Button */}
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
          >
            <FaArrowUp />
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            {...register('profilePicture')}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {displayData?.firstname} {displayData?.lastname}
          </h2>
          <p>{displayData?.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b space-x-6 items-center justify-center">
        <button
          className={`pb-2 transition-colors ${
            selectedTab === 'editProfile'
              ? 'border-b-2 border-[#8CAB91] text-[#8CAB91]'
              : 'text-gray-600 hover:text-[#8CAB91]'
          }`}
          onClick={() => setSelectedTab('editProfile')}
        >
          Edit Profile
        </button>
        <button
          className={`pb-2 transition-colors ${
            selectedTab === 'changePassword'
              ? 'border-b-2 border-[#8CAB91] text-[#8CAB91]'
              : 'text-gray-600 hover:text-[#8CAB91]'
          }`}
          onClick={() => setSelectedTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {/* Form Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <AnimatePresence mode="wait">
          {selectedTab === 'editProfile' && (
            <motion.div
              key="editProfile"
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <form
                className="px-20"
                onSubmit={handleSubmit(handleProfileSubmit)}
              >
                <h2 className="text-xl font-medium mb-4 text-center">
                  Edit Your Profile
                </h2>
                <div className="mb-4">
                  <label className="block font-medium mb-1">User Name</label>
                  <input
                    type="text"
                    placeholder="Mr. John"
                    {...register('userName', { required: true })}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    {...register('email', { required: true })}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Contact No</label>
                  <input
                    type="text"
                    placeholder="+99007007007"
                    {...register('contact')}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="79/A Joker Vila, Gotham City"
                    {...register('address')}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#8CAB91] text-white rounded-lg p-5 hover:bg-[#7a9a7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {selectedTab === 'changePassword' && (
            <motion.div
              key="changePassword"
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <form
                className="px-20"
                onSubmit={handleSubmit(handlePasswordSubmit)}
              >
                <h2 className="text-xl font-medium mb-4 text-center">
                  Change Password
                </h2>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...register('currentPassword', { required: true })}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    {...register('newPassword', {
                      required: true,
                      minLength: 6,
                    })}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword', { required: true })}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8CAB91]"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#8CAB91] text-white rounded-lg p-5 hover:bg-[#7a9a7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Changing...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminProfile;
