import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, X, Users, AlertCircle, FileText, CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';

const BrandDashboard = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for new campaign
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [deadline, setDeadline] = useState('');
  const [formError, setFormError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const campaignsRes = await api.get('/api/campaigns/brand');
      setCampaigns(campaignsRes.data);

      const appsRes = await api.get('/api/applications/brand');
      setApplications(appsRes.data);

      const categoriesRes = await api.get('/api/categories');
      setCategories(categoriesRes.data);
      if (categoriesRes.data.length > 0) {
        setCategoryId(categoriesRes.data[0].id.toString());
      }
    } catch (error) {
      console.error("Failed to load brand dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !description || !categoryId || !minFollowers || !budgetRange || !deliverables || !deadline) {
      setFormError('Please fill out all fields.');
      return;
    }

    try {
      await api.post('/api/campaigns', {
        title,
        description,
        categoryId: parseInt(categoryId),
        minFollowers: parseInt(minFollowers),
        budgetRange,
        deliverables,
        deadline
      });

      // Clear form
      setTitle('');
      setDescription('');
      setMinFollowers('');
      setBudgetRange('');
      setDeliverables('');
      setDeadline('');
      setShowModal(false);

      // Reload
      setLoading(true);
      await fetchDashboardData();
    } catch (error) {
      setFormError(error.response?.data?.toString() || 'Failed to create campaign. Please try again.');
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/api/applications/${appId}/status`, { status: newStatus });
      // Reload applications list
      const appsRes = await api.get('/api/applications/brand');
      setApplications(appsRes.data);
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'SHORTLISTED':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'ACCEPTED':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return '';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">Brand Portal Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage campaigns, review creator portfolios, and coordinate applications.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Post Campaign</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Campaigns</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-display">{campaigns.length}</div>
        </div>

        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Applicants</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-display">{applications.length}</div>
        </div>

        <div className="bg-gray-950 border border-gray-850 p-6 rounded-2xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shortlisted Creators</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2 font-display">
            {applications.filter(app => app.status === 'SHORTLISTED').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign management */}
        <div className="bg-gray-950 border border-gray-850 rounded-2xl p-6 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-white mb-6 font-display">My Campaigns</h2>

          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((c) => (
                <div key={c.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase">
                      {c.category?.name || 'Niche'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${c.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{c.title}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-3 border-t border-gray-850 pt-2">
                    <span>Budget: <span className="text-gray-300 font-semibold">{c.budgetRange}</span></span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{c.deadline}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No campaigns posted yet.</p>
              <button onClick={() => setShowModal(true)} className="text-xs font-bold text-primary-400 mt-2 hover:underline">
                Create one now &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Applications list */}
        <div className="bg-gray-950 border border-gray-850 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Creator Applications</h2>

          {applications.length > 0 ? (
            <div className="space-y-6 divide-y divide-gray-850">
              {applications.map((app) => (
                <div key={app.id} className="pt-6 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Creator details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/20 flex items-center justify-center font-bold text-primary-400 uppercase">
                        {app.creator.user.username.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/creators?creatorId=${app.creator.id}`} className="font-bold text-white hover:text-primary-400 transition-colors">
                          {app.creator.user.username}
                        </Link>
                        <div className="text-xs text-gray-500">
                          Followers: <span className="font-medium text-gray-300">{app.creator.followerCount.toLocaleString()}</span> • Engagement: <span className="font-medium text-gray-300">{app.creator.engagementRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/30 border border-gray-800 p-3.5 rounded-xl">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Proposal Message</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed font-sans">{app.proposalMessage}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      Applied to Campaign: <span className="font-semibold text-gray-300">{app.campaign.title}</span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col items-end justify-between gap-4 h-full">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>

                    {app.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="p-2 border border-gray-850 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                          className="px-3 py-2 border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-bold transition-all"
                        >
                          Shortlist
                        </button>
                      </div>
                    )}

                    {app.status === 'SHORTLISTED' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="p-2 border border-gray-850 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                          className="px-3 py-2 border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No applications received yet for your campaigns.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Post Campaign */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white font-display">Create Collaboration Campaign</h3>
              <p className="text-sm text-gray-400 mt-1">Fill out parameters to publish your collaboration listing.</p>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="e.g. Summer Fashion Reels Collaboration"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Niche Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-gray-950 text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Min Followers Required</label>
                  <input
                    type="number"
                    required
                    value={minFollowers}
                    onChange={(e) => setMinFollowers(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Budget Range</label>
                  <input
                    type="text"
                    required
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="e.g. $500 - $1000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Describe your campaign goals..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deliverables</label>
                <input
                  type="text"
                  required
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="e.g. 1 Instagram Reel, 2 Stories"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-850 hover:bg-gray-800 text-gray-300 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 text-sm transition-all"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard;
