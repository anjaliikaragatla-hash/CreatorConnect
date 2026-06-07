import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowRight, Star, ShieldCheck, Zap, Users, Briefcase, DollarSign } from 'lucide-react';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/api/campaigns/open');
        // Get the latest 3 campaigns
        setCampaigns(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-600/10 border border-primary-500/20 px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary-400 fill-primary-400/20" />
            <span className="text-xs font-semibold text-primary-300">The Creator Economy Hub</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-display text-white leading-tight tracking-tight max-w-4xl mx-auto">
            Connecting Top Brands with{' '}
            <span className="bg-gradient-to-r from-primary-400 via-pink-400 to-indigo-400 text-transparent bg-clip-text">
              Visionary Creators
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Discover sponsorship campaigns, build professional media kits, and manage collaboration applications—all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/campaigns"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-xl flex items-center justify-center transition-all duration-200"
            >
              Explore Campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-y border-gray-850 bg-gray-950/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-extrabold text-white font-display">10K+</div>
              <div className="text-sm font-semibold text-gray-400 mt-2 uppercase tracking-wider">Active Influencers</div>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-gray-800">
              <div className="text-4xl lg:text-5xl font-extrabold text-white font-display">500+</div>
              <div className="text-sm font-semibold text-gray-400 mt-2 uppercase tracking-wider">Partner Brands</div>
            </div>
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-extrabold text-white font-display">$2.4M+</div>
              <div className="text-sm font-semibold text-gray-400 mt-2 uppercase tracking-wider">Payouts Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Campaigns Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white font-display">Featured Campaigns</h2>
              <p className="text-gray-400 mt-2">Apply to the latest collaboration opportunities right now.</p>
            </div>
            <Link to="/campaigns" className="mt-4 sm:mt-0 text-primary-400 hover:text-primary-300 font-bold flex items-center space-x-1.5 transition-colors">
              <span>View All Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6 animate-pulse h-64"></div>
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-gray-950 border border-gray-800 hover:border-primary-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs px-2.5 py-1 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                        {campaign.category?.name || 'Niche'}
                      </span>
                      <span className="text-sm font-semibold text-green-400">{campaign.budgetRange}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 truncate">{campaign.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-6">{campaign.description}</p>
                  </div>
                  <div className="border-t border-gray-850 pt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Min followers: <span className="font-semibold text-gray-300">{campaign.minFollowers.toLocaleString()}</span>
                    </div>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="px-3 py-1.5 bg-gray-900 border border-gray-800 text-xs font-semibold rounded-lg text-white hover:bg-gray-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-950/30 border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-400">No campaigns posted yet. Be the first to create one!</p>
              <Link to="/register" className="mt-4 inline-block text-primary-400 font-bold">Register as Brand &rarr;</Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-950/30 border-t border-gray-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-display">Why Choose CreatorConnect?</h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">We streamline the workflow from application proposal to approval, saving weeks of back-and-forth negotiations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-950 border border-gray-850 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build a Media Kit</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Showcase your social platforms, categories, follower counts, and previous collaborations in a stunning media kit.</p>
            </div>

            <div className="bg-gray-950 border border-gray-850 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Requirements</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Brands set clear criteria for followers, niches, and budgets. Creators only apply if they meet requirements.</p>
            </div>

            <div className="bg-gray-950 border border-gray-850 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Status</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Track all application states from Pending to Shortlisted, Accepted, or Rejected in a structured dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
