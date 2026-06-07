import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { Search, Globe, AlertCircle, FileText } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon, PinterestIcon } from '../components/SocialIcons';

const CreatorProfiles = () => {
  const [creators, setCreators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Search/Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatorsRes = await api.get('/api/profiles/creators');
        setCreators(creatorsRes.data);

        const categoriesRes = await api.get('/api/categories');
        setCategories(categoriesRes.data);

        // Check query param for specific creator (e.g. from applicant link)
        const creatorIdParam = searchParams.get('creatorId');
        if (creatorIdParam) {
          const match = creatorsRes.data.find(c => c.id.toString() === creatorIdParam);
          if (match) {
            setSelectedCreator(match);
          }
        }
      } catch (error) {
        console.error("Failed to load creators directory", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      c.user.username.toLowerCase().includes(search.toLowerCase()) ||
      (c.bio && c.bio.toLowerCase().includes(search.toLowerCase())) ||
      (c.collaborations && c.collaborations.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === '' || (c.category && c.category.id.toString() === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-gray-900 w-1/4 rounded-lg"></div>
        <div className="h-12 bg-gray-900 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
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
        <h1 className="text-3xl font-extrabold text-white font-display">Creator Directory</h1>
        <p className="text-gray-400 mt-1">Browse influencer portfolios, stats, and niches for brand partnerships.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-gray-950 border border-gray-850 p-4 sm:p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search Creators</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-800 bg-gray-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="Search by name, bio, history..."
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
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCreator(c)}
                  className={`bg-gray-950 border rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    selectedCreator?.id === c.id ? 'border-primary-500 bg-primary-500/[0.02]' : 'border-gray-850 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/20 flex items-center justify-center font-bold text-primary-400 uppercase">
                        {c.user.username.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{c.user.username}</h3>
                        {c.category && (
                          <span className="text-[10px] px-2 py-0.5 bg-primary-600/10 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                            {c.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {c.bio || 'No bio written yet.'}
                    </p>
                  </div>

                  <div className="border-t border-gray-850 pt-4 mt-6 flex items-center justify-between text-xs text-gray-400">
                    <div>
                      Followers: <span className="font-bold text-gray-300">{c.followerCount.toLocaleString()}</span>
                    </div>
                    <div>
                      Engagement: <span className="font-bold text-gray-300">{c.engagementRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-950/30 border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-400">No creators found matching search criteria.</p>
            </div>
          )}
        </div>

        {/* Portfolio view / Sidebar Details */}
        <div className="lg:col-span-1">
          {selectedCreator ? (
            <div className="bg-gray-950 border border-gray-850 rounded-3xl p-6 space-y-6 sticky top-24">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-primary-600/20 border-2 border-primary-500/30 mx-auto flex items-center justify-center font-extrabold text-2xl text-primary-400 uppercase">
                  {selectedCreator.user.username.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">{selectedCreator.user.username}</h3>
                  <p className="text-sm text-gray-400">{selectedCreator.user.email}</p>
                </div>
                {selectedCreator.category && (
                  <span className="inline-block text-xs px-2.5 py-1 bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-full font-bold uppercase">
                    {selectedCreator.category.name}
                  </span>
                )}
              </div>

              {/* Statistics row */}
              <div className="grid grid-cols-2 gap-4 border-y border-gray-850 py-4 text-center">
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Followers</div>
                  <div className="text-lg font-bold text-white font-display mt-0.5">
                    {selectedCreator.followerCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Engagement</div>
                  <div className="text-lg font-bold text-white font-display mt-0.5">
                    {selectedCreator.engagementRate}%
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                  {selectedCreator.bio || 'No bio written yet.'}
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Social Links</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedCreator.instagramLink ? (
                    <a
                      href={selectedCreator.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-pink-500/20 hover:bg-pink-500/5 text-gray-300 hover:text-pink-400 transition-all"
                    >
                      <InstagramIcon className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  ) : (
                    <span className="flex items-center space-x-1.5 p-2 bg-gray-950 border border-gray-900 rounded-lg text-gray-600 select-none">
                      <InstagramIcon className="w-4 h-4" />
                      <span>Instagram</span>
                    </span>
                  )}

                  {selectedCreator.youtubeLink ? (
                    <a
                      href={selectedCreator.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500/20 hover:bg-red-500/5 text-gray-300 hover:text-red-400 transition-all"
                    >
                      <YoutubeIcon className="w-4 h-4" />
                      <span>YouTube</span>
                    </a>
                  ) : (
                    <span className="flex items-center space-x-1.5 p-2 bg-gray-950 border border-gray-900 rounded-lg text-gray-600 select-none">
                      <YoutubeIcon className="w-4 h-4" />
                      <span>YouTube</span>
                    </span>
                  )}

                  {selectedCreator.linkedinLink ? (
                    <a
                      href={selectedCreator.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500/20 hover:bg-blue-500/5 text-gray-300 hover:text-blue-400 transition-all"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <span className="flex items-center space-x-1.5 p-2 bg-gray-950 border border-gray-900 rounded-lg text-gray-600 select-none">
                      <LinkedinIcon className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </span>
                  )}

                  {selectedCreator.pinterestLink ? (
                    <a
                      href={selectedCreator.pinterestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500/20 hover:bg-red-500/5 text-gray-300 hover:text-red-400 transition-all"
                    >
                      <PinterestIcon className="w-4 h-4" />
                      <span>Pinterest</span>
                    </a>
                  ) : (
                    <span className="flex items-center space-x-1.5 p-2 bg-gray-950 border border-gray-900 rounded-lg text-gray-600 select-none">
                      <PinterestIcon className="w-4 h-4" />
                      <span>Pinterest</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Collaborations */}
              <div className="space-y-2 border-t border-gray-850 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Previous Collaborations</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans whitespace-pre-line">
                  {selectedCreator.collaborations || 'No collaborations listed yet.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-950 border border-gray-850 border-dashed rounded-3xl p-8 text-center text-gray-500 h-64 flex flex-col items-center justify-center sticky top-24">
              <AlertCircle className="w-8 h-8 mb-2 text-gray-600" />
              <p className="text-sm">Select a creator card to view their full portfolio media kit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfiles;
