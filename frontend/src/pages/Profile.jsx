import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Building, AlertCircle, CheckCircle, Sparkles, Send, FileText } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Creator fields
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [pinterestLink, setPinterestLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0.0);
  const [collaborations, setCollaborations] = useState('');

  // Brand fields
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user.role === 'CREATOR') {
          const profileRes = await api.get('/api/profiles/creator');
          const p = profileRes.data;
          setBio(p.bio || '');
          setProfilePicture(p.profilePicture || '');
          setInstagramLink(p.instagramLink || '');
          setYoutubeLink(p.youtubeLink || '');
          setPinterestLink(p.pinterestLink || '');
          setLinkedinLink(p.linkedinLink || '');
          setFollowerCount(p.followerCount || 0);
          setEngagementRate(p.engagementRate || 0.0);
          setCollaborations(p.collaborations || '');
          if (p.category) {
            setCategoryId(p.category.id.toString());
          }

          const categoriesRes = await api.get('/api/categories');
          setCategories(categoriesRes.data);
          if (categoriesRes.data.length > 0 && !p.category) {
            setCategoryId(categoriesRes.data[0].id.toString());
          }
        } else {
          const profileRes = await api.get('/api/profiles/brand');
          const p = profileRes.data;
          setCompanyName(p.companyName || '');
          setLogo(p.logo || '');
          setDescription(p.description || '');
          setIndustry(p.industry || '');
          setWebsite(p.website || '');
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const handleCreatorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.put('/api/profiles/creator', {
        bio,
        profilePicture,
        instagramLink,
        youtubeLink,
        pinterestLink,
        linkedinLink,
        categoryId: categoryId ? parseInt(categoryId) : null,
        followerCount: parseInt(followerCount),
        engagementRate: parseFloat(engagementRate),
        collaborations
      });
      setMessage('Creator Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.toString() || 'Failed to update profile.');
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.put('/api/profiles/brand', {
        companyName,
        logo,
        description,
        industry,
        website
      });
      setMessage('Company Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.toString() || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-10 bg-gray-900 w-1/3 rounded-lg mx-auto"></div>
        <div className="h-96 bg-gray-900 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white font-display">
          {user.role === 'CREATOR' ? 'Creator Media Kit Profile' : 'Company Profile Settings'}
        </h1>
        <p className="text-gray-400 mt-1">
          {user.role === 'CREATOR' ? 'Manage your bio, socials, follower counts, and niches.' : 'Manage company name, logo, industry, and description.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-gray-950 border border-gray-850 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {user.role === 'CREATOR' ? (
          // Creator profile editor form
          <form onSubmit={handleCreatorSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-2 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span>Niche & Metrics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category Niche</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-gray-950 text-white">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Follower Count</label>
                <input
                  type="number"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="e.g. 15000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Engagement Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="e.g. 4.25"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-2 pt-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-primary-400" />
              <span>Bio & Avatar</span>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Profile Avatar URL</label>
                <input
                  type="text"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter external image URL (HTTPS)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Biography</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Write a brief professional bio explaining your audience style..."
                ></textarea>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-2 pt-4 flex items-center space-x-2">
              <Send className="w-5 h-5 text-primary-400" />
              <span>Social Media Channels</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Instagram Link</label>
                <input
                  type="url"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">YouTube Link</label>
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="https://youtube.com/c/yourchannel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pinterest Link</label>
                <input
                  type="url"
                  value={pinterestLink}
                  onChange={(e) => setPinterestLink(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="https://pinterest.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">LinkedIn Link</label>
                <input
                  type="url"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-2 pt-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-400" />
              <span>Showcase Collaborations</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Past Collaboration Showcase</label>
              <textarea
                rows="3"
                value={collaborations}
                onChange={(e) => setCollaborations(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Mention past brand names, campaigns types, and success metrics (e.g. Nike sponsorship, reached 100k views)..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all duration-200"
            >
              Save Profile Details
            </button>
          </form>
        ) : (
          // Brand profile editor form
          <form onSubmit={handleBrandSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-2 flex items-center space-x-2">
              <Building className="w-5 h-5 text-primary-400" />
              <span>Company Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Logo URL</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter company logo URL"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Industry Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="e.g. Apparel, Consumer Electronics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Describe what your brand does and collaboration style..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all duration-200"
            >
              Save Company Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
