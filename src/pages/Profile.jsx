import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Settings, Bell, Shield, Camera, Save, X } from 'lucide-react';
import { logoutUser, updateProfile } from '../features/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  console.log('Profile Page User Data:', user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    phoneNumber: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Helper to format image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    let cleanPath = path.trim().replace(/^`|`$/g, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    
    if (cleanPath.startsWith('http')) return cleanPath;
    
    let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';
    baseUrl = baseUrl.replace(/\/api\/v1\/?$/, ''); 
    
    const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    let finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    return `${finalBaseUrl}${finalPath}`;
  };

  // Sync formData and previewUrl when user data is available or changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
      });
      setPreviewUrl(getImageUrl(user.profilePhoto));
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('location', formData.location);
    data.append('phoneNumber', formData.phoneNumber);
    if (profilePhoto) {
      data.append('profilePhoto', profilePhoto);
      data.append('profilePic', profilePhoto); // Dual field name support
      data.append('avatar', profilePhoto);     // Triple support
    }

    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', description: 'Change your personal information' },
    { icon: MapPin, label: 'My Addresses', description: 'Manage your delivery locations' },
    { icon: Bell, label: 'Notifications', description: 'Control your alert preferences' },
    { icon: Shield, label: 'Security', description: 'Update password and security settings' },
    { icon: Settings, label: 'Preferences', description: 'Language and theme settings' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-100 rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-secondary-900 dark:bg-secondary-950 p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/10 overflow-hidden bg-secondary-800 flex items-center justify-center shadow-2xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-white">{user?.firstName?.charAt(0) || user?.email?.charAt(0)}</span>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors border-4 border-secondary-900"
                >
                  <Camera size={20} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="text-center sm:text-left space-y-3 flex-grow">
              {!isEditing ? (
                <>
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <p className="text-secondary-400 flex items-center text-sm font-bold">
                      <Mail className="h-4 w-4 mr-2 text-primary-500" /> {user?.email}
                    </p>
                    {user?.phoneNumber && (
                      <p className="text-secondary-400 flex items-center text-sm font-bold">
                        <Phone className="h-4 w-4 mr-2 text-primary-500" /> {user?.phoneNumber}
                      </p>
                    )}
                    {user?.location && (
                      <p className="text-secondary-400 flex items-center text-sm font-bold">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500" /> {user?.location}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Edit Profile</h2>
                  <p className="text-secondary-400 text-sm">Update your personal information and photo.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Settings className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSubmit} loading={loading} className="bg-primary-500 hover:bg-primary-600">
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </div>

        {/* Form Content */}
        <div className="p-8 sm:p-12">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                icon={User}
                placeholder="Sanan"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                icon={User}
                placeholder="Nawaz"
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                icon={Phone}
                placeholder="03127766200"
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                icon={MapPin}
                placeholder="Lahore"
              />
            </form>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item, idx) => (
                  <button 
                    key={idx}
                    className="flex items-start p-6 rounded-2xl hover:bg-secondary-50 transition-all border border-slate-200 group text-left shadow-sm hover:shadow-md"
                  >
                    <div className="bg-primary-500/10 p-4 rounded-2xl mr-5 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      <item.icon className="h-6 w-6 text-primary-500 group-hover:text-inherit" />
                    </div>
                    <div>
                      <h3 className="font-black text-secondary-900 dark:text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 py-5 rounded-2xl text-red-600 hover:bg-red-50 font-black transition-all border-2 border-red-100"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="text-lg">Logout Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
