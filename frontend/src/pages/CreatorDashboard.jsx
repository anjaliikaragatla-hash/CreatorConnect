import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, CheckCircle, Clock, Check, AlertCircle, AlertTriangle } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePercentage, setProfilePercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await api.get('/api/profiles/creator');
        const profileData = profileRes.data;
        setProfile(profileData);

        // Calculate completion percentage
        let score = 0;
        if (profileData.bio) score += 15;
        if (profileData.profilePicture) score += 15;
        if (profileData.category) score += 15;
        if (profileData.followerCount > 0) score += 15;
        if (profileData.engagementRate > 0) score += 15;
        if (profileData.instagramLink || profileData.youtubeLink || profileData.pinterestLink || profileData.linkedinLink) score += 15;
        if (profileData.collaborations) score += 10;
        setProfilePercentage(score);

        // Fetch applications
        const appsRes = await api.get('/api/applications/creator');
        setApplications(appsRes.data);

        // Fetch campaigns to make recommendations
        const campaignsRes = await api.get('/api/campaigns/open');
        const openCampaigns = campaignsRes.data;

        // Recommendations matching category or follower requirements
        const recommendations = openCampaigns.filter(c => {
          // Check if already applied
          const alreadyApplied = appsRes.data.some(app => app.campaign.id === c.id);
          if (alreadyApplied) return false;

          // Match category
          const categoryMatch = profileData.category && c.category && c.category.id === profileData.category.id;
          // Match follower requirements
          const followerMatch = profileData.followerCount >= c.minFollowers;

          return categoryMatch || followerMatch;
        });

        setRecommendedCampaigns(recommendations.slice(0, 4));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full font-bold uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Shortlisted</span>
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-bold uppercase">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-bold uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-gray-900 w-1/4 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-900 rounded-2xl"></div>
          <div className="h-32 bg-gray-900 rounded-2xl"></div>
          <div className="h-32 bg-gray-900 rounded-2xl"></div>
        </div>
        <div className="h-64 bg-gray-900 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">Hello, {user.username} 👋</h1>
          <p className="text-gray-400 mt-1">Here is a summary of your collaborations and recommendations.</p>
        </div>
        <Link
          to="/profile"
          className="px-4 py-2 border border-gray-800 hover:border-gray-700 bg-gray-900 hover:bg-gray-800 text-sm font-semibold rounded-lg text-gray-300 hover:text-white transition-all duration-200"
        >
          Edit Media Kit
        </Link>
      </div>

      {/* Profile completion block */}
      {profilePercentage < 100 && (
        <div className="bg-gradient-to-r from-primary-950/40 to-indigo-950/30 border border-primary-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start space-x-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span>Complete Your Media Kit Profile ({profilePercentage}%)</span>
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl">
              Complete profiles are 4x more likely to be accepted by brands. Add bio, social links, follower statistics, and categories to reach 100%.
            </p>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <div className="w-full bg-gray-900 rounded-full h-3.5 border border-gray-800">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${profilePercentage}%` }}
              ></div>
            </div>
            <Link to="/profile" className="text-xs font-bold text-primary-400 hover:text-primary-300 block text-right">
              Finish Profile Setup &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Applications</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-display">{applications.length}</div>
        </div>

        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shortlisted / Accepted</div>
          <div className="text-3xl font-extrabold text-green-400 mt-2 font-display">
            {applications.filter(app => app.status === 'SHORTLISTED' || app.status === 'ACCEPTED').length}
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Audience Follower Reach</div>
          <div className="text-3xl font-extrabold text-primary-400 mt-2 font-display">
            {profile?.followerCount ? profile.followerCount.toLocaleString() : '0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Applications list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-950 border border-gray-850 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 font-display">Applied Campaigns</h2>

            {applications.length > 0 ? (
              <div className="divide-y divide-gray-850">
                {applications.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-base">{app.campaign.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Brand: <span className="text-gray-300 font-medium">{app.campaign.brand.companyName}</span> • Applied: {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 italic line-clamp-1">"{app.proposalMessage}"</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-sm font-semibold text-gray-300">{app.campaign.budgetRange}</div>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">You haven't applied to any campaign yet.</p>
                <Link to="/campaigns" className="mt-4 inline-block text-primary-400 hover:text-primary-300 font-bold text-sm">
                  Find campaigns now &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended campaigns */}
        <div className="space-y-6">
          <div className="bg-gray-950 border border-gray-850 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 font-display flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span>Recommendations</span>
            </h2>

            {recommendedCampaigns.length > 0 ? (
              <div className="space-y-4">
                {recommendedCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl hover:border-primary-500/20 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] px-2 py-0.5 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                        {campaign.category?.name || 'Niche'}
                      </span>
                      <span className="text-xs font-semibold text-green-400">{campaign.budgetRange}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate">{campaign.title}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 mb-3">{campaign.description}</p>
                    <div className="flex items-center justify-between border-t border-gray-850 pt-2.5">
                      <span className="text-[10px] text-gray-500">Min: {campaign.minFollowers.toLocaleString()} followers</span>
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-gray-400">No matching campaigns found right now. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
