'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';

export default function EditProfileSection({ user }) {
  const [username, setUsername] = useState(user?.username || '');
  const [profileImage, setProfileImage] = useState(user?.profileImageURL || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setIsUsernameChanged(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
      setIsAvatarChanged(true);
    }
  };

const handleUsernameChangeSubmit = async () => {
  try {
    const res = await axios.post('/api/users/change-username', {
      username,
      userId: user.id,
    });

    if (res.data?.success) {
      toast.success('Username updated successfully!');
      setIsUsernameChanged(false);
    } else {
      toast.error(res.data?.message || 'Something went wrong');
    }
  } catch (err) {
    if (err.response?.status === 409) {
      toast.error('Username already taken');
    } else {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  }
};


const handleAvatarUpload = async () => {
  if (!selectedFile) {
    toast.error('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('userId', user.id); 

  try {
    const res = await axios.post('/api/users/change-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data?.success) {
      toast.success('Avatar updated successfully!');
      setIsAvatarChanged(false);
    } else {
      toast.error(res.data?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (error.response?.status === 409) {
      toast.error('Avatar already exists');
    } else {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  }
};

  return (
    <form className="bg-[#1e1e2e] p-6 rounded-2xl shadow-lg text-white mt-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      {/* Profile Image Upload */}
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={profileImage}
          alt="Profile Preview"
          width={64}
          height={64}
          className="rounded-full border-2 border-purple-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm file:bg-purple-600 file:text-white file:px-3 file:py-1 file:rounded-full file:cursor-pointer"
        />
      </div>

      {/* Avatar Submit Button */}
      <button
        type="button"
        disabled={!isAvatarChanged}
        onClick={handleAvatarUpload}
        className={`w-full py-2 rounded-lg font-semibold mb-6 ${
          isAvatarChanged ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed'
        }`}
      >
        Save Avatar
      </button>

      {/* Username Input */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm mb-1 text-gray-300">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className="w-full px-4 py-2 rounded-lg bg-[#2c2c3a] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Username Submit Button */}
      <button
        type="button"
        disabled={!isUsernameChanged}
        onClick={handleUsernameChangeSubmit}
        className={`w-full py-2 rounded-lg font-semibold ${
          isUsernameChanged ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed'
        }`}
      >
        Save Username
      </button>
    </form>
  );
}
