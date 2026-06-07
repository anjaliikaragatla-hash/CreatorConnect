import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, Users, Award, ChevronLeft, Send, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(null);

  // Application Modal state
  const [showModal, setShowModal] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const campaignRes = await api.get(`/api/campaigns/${id}`);
        setCampaign(campaignRes.data);

        if (user && user.role === 'CREATOR') {
          // Fetch creator profile to check requirements
          const profileRes = await api.get('/api/profiles/creator');
          setCreatorProfile(profileRes.data);

          // Check if already applied
          const appsRes = await api.get('/api/applications/creator');
          const exists = appsRes.data.some((app) => app.campaign.id === parseInt(id));
          setAlreadyApplied(exists);
        }
      } catch (error) {
        console.error("Failed to load campaign details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, [id, user]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    if (!proposalMessage.trim()) {
      setSubmitError('Please write a proposal message.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/api/applications', {
        campaignId: campaign.id,
        proposalMessage
      });
      setSubmitSuccess('Application submitted successfully!');
      setAlreadyApplied(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (error) {
      setSubmitError(error.response?.data?.toString() || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-6 w-24 bg-gray-900 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-900 rounded-3xl"></div>
          <div className="h-64 bg-gray-900 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Campaign Not Found</h2>
        <Link to="/campaigns" className="text-primary-400 mt-2 block">Back to Campaigns</Link>
      </div>
    );
  }

  // Meets follower requirement checks
  const meetsRequirements = creatorProfile ? creatorProfile.followerCount >= campaign.minFollowers : true;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Back button */}
      <Link to="/campaigns" className="inline-flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Campaign Info */}
        <div className="lg:col-span-2 space-y-8 bg-gray-950 border border-gray-850 p-6 sm:p-8 rounded-3xl">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="text-xs px-2.5 py-1 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                {campaign.category?.name || 'Niche'}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${campaign.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {campaign.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display">{campaign.title}</h1>
            <p className="text-xs text-gray-400 mt-2">
              Sponsored by <span className="font-semibold text-gray-300">{campaign.brand.companyName}</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Campaign Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-850 pt-6">
            <h3 className="text-lg font-bold text-white font-display">Required Deliverables</h3>
            <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl flex items-start space-x-3">
              <Award className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed font-sans">{campaign.deliverables}</p>
            </div>
          </div>
        </div>

        {/* Campaign Requirements sidebar */}
        <div className="space-y-6 bg-gray-950 border border-gray-850 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white font-display border-b border-gray-850 pb-3">Requirements & Budget</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Estimated Budget</div>
                <div className="font-bold text-white text-base font-display">{campaign.budgetRange}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Minimum Followers</div>
                <div className="font-bold text-white text-base font-display">{campaign.minFollowers.toLocaleString()}+</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Application Deadline</div>
                <div className="font-bold text-white text-base font-display">{campaign.deadline}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-850 pt-6">
            {!user ? (
              <Link
                to="/login"
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 flex items-center justify-center transition-all duration-200"
              >
                Sign In to Apply
              </Link>
            ) : user.role === 'BRAND' ? (
              <button
                disabled
                className="w-full py-3 bg-gray-900 border border-gray-800 text-gray-500 font-bold rounded-xl text-sm cursor-not-allowed"
              >
                Brands Cannot Apply
              </button>
            ) : alreadyApplied ? (
              <button
                disabled
                className="w-full py-3 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-xl text-sm cursor-not-allowed"
              >
                Already Applied
              </button>
            ) : !meetsRequirements ? (
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl text-sm cursor-not-allowed"
                >
                  Requirements Not Met
                </button>
                <p className="text-[10px] text-red-400 text-center leading-relaxed">
                  Requires {campaign.minFollowers.toLocaleString()} followers, you currently have {creatorProfile?.followerCount.toLocaleString()}.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 flex items-center justify-center transition-all duration-200"
              >
                Apply for Collaboration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Apply Collaboration */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white font-display">Apply for Campaign</h3>
              <p className="text-sm text-gray-400 mt-1">Submit your proposal directly to the brand.</p>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Proposal / Pitch Message</span>
                </label>
                <textarea
                  required
                  rows="4"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm leading-relaxed"
                  placeholder="Introduce yourself and explain why you're a great fit for this campaign. Mention your content ideas, statistics, and deliverables strategy..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 border border-gray-850 hover:bg-gray-850 text-gray-300 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 text-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Pitch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
