import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaBookmark, 
  FaHistory, 
  FaBell, 
  FaCog, 
  FaLock, 
  FaSignOutAlt,
  FaEdit,
  FaCamera
} from 'react-icons/fa';
import { authAPI, userAPI } from "../src/services/api";

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '',
    joinDate: '',
    watchTime: '0h 0m',
    bookmarks: 0,
    avatar: null
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        console.log('Fetching user profile...');
        const token = localStorage.getItem('token');
        console.log('Current token:', token);
        
        const response = await authAPI.getProfile();
        console.log('Profile response:', response);
        
        if (response && response.data) {
          setUser({
            ...response.data,
            joinDate: new Date(response.data.createdAt).toLocaleDateString()
          });
          setFormData({
            name: response.data.name || '',
            email: response.data.email || ''
          });
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(formData);
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await authAPI.uploadAvatar(formData);
        setUser(prev => ({
          ...prev,
          avatar: response.data.avatarUrl
        }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-700/50 rounded-lg p-6 hover:bg-zinc-700/70 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-lg">
                  <FaBookmark className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Bookmarks</p>
                  <p className="text-2xl font-bold text-white">{user.bookmarks}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-700/50 rounded-lg p-6 hover:bg-zinc-700/70 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <FaHistory className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Watch Time</p>
                  <p className="text-2xl font-bold text-white">{user.watchTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-700/50 rounded-lg p-6 hover:bg-zinc-700/70 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <FaUser className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Member Since</p>
                  <p className="text-xl font-bold text-white">{user.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-700/50 rounded-lg p-6 hover:bg-zinc-700/70 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FaBell className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Notifications</p>
                  <p className="text-2xl font-bold text-white">On</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-zinc-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="w-12 h-12 text-zinc-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                      <FaCamera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-zinc-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Personal Information</h4>
                      <p className="text-sm text-zinc-400">Update your name and email</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-md text-white transition-colors flex items-center gap-2"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Password</h4>
                      <p className="text-sm text-zinc-400">Update your password</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-md text-white transition-colors flex items-center gap-2">
                      <FaLock className="w-3.5 h-3.5" />
                      Change
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Sign out of all devices</h4>
                      <p className="text-sm text-zinc-400">Sign out from all active sessions</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors flex items-center gap-2">
                      <FaSignOutAlt className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="content p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-800/50 rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden border-4 border-white/10">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="w-16 h-16 text-zinc-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors group-hover:opacity-100 opacity-0">
                  <FaCamera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-zinc-400">{user.email}</p>
                <div className="flex gap-4 mt-3 justify-center md:justify-start">
                  <span className="text-sm text-zinc-400 flex items-center gap-1">
                    <FaUser className="w-3.5 h-3.5" />
                    Member since {user.joinDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-zinc-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
                }`}
              >
                Account Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
