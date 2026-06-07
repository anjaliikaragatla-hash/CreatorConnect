import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Calendar, DollarSign, Users } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minFollowers, setMinFollowers] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignsRes = await api.get('/api/campaigns/open');
        setCampaigns(campaignsRes.data);

        const categoriesRes = await api.get('/api/categories');
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load campaigns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === '' || (c.category && c.category.id.toString() === selectedCategory);

    const matchesFollowers = minFollowers === '' || c.minFollowers <= parseInt(minFollowers);

    return matchesSearch && matchesCategory && matchesFollowers;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-gray-900 w-1/4 rounded-lg"></div>
        <div className="h-12 bg-gray-900 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-gray-900 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-display">Campaign Opportunities</h1>
        <p className="text-gray-400 mt-1">Discover sponsorships, search by niche, and apply for collaborations.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-gray-950 border border-gray-850 p-4 sm:p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search Campaigns</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="Search by title, brand..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Filter Niche</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-gray-950 text-white">{c.name}</option>
            ))}
          </select>
        </div>

        {/* Follower Count Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">My Follower Count</label>
          <input
            type="number"
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            placeholder="Show campaigns requiring <= this"
          />
        </div>
      </div>

      {/* Campaigns list */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => (
            <div
              key={c.id}
              className="bg-gray-950 border border-gray-850 hover:border-primary-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] px-2.5 py-1 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                    {c.category?.name || 'Niche'}
                  </span>
                  <span className="text-sm font-semibold text-green-400 font-display">{c.budgetRange}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 truncate">{c.title}</h3>
                <div className="text-xs text-gray-500 font-medium mb-3">Posted by {c.brand.companyName}</div>
                <p className="text-sm text-gray-400 line-clamp-3 mb-6 leading-relaxed">{c.description}</p>
              </div>

              <div className="border-t border-gray-850 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Min Followers: <span className="font-semibold text-gray-300">{c.minFollowers.toLocaleString()}</span></span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Deadline: <span className="font-semibold text-gray-300">{c.deadline}</span></span>
                  </span>
                </div>
                <Link
                  to={`/campaigns/${c.id}`}
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 text-xs font-semibold rounded-xl text-white flex items-center justify-center transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-950/30 border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-400">No campaigns match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
