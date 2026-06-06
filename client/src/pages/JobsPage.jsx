import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter } from 'lucide-react';
import api from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'technology', 'design', 'marketing', 'writing', 'customer-service'];
  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'freelance'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedCategory, selectedType, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
      // Mock data
      setJobs([
        {
          _id: '1',
          title: 'Senior React Developer',
          company: 'TechCorp Kenya',
          category: 'technology',
          type: 'full-time',
          salary: '150,000 - 200,000',
          location: 'Nairobi',
          description: 'We are looking for an experienced React developer to join our team.',
          requirements: ['3+ years React experience', 'TypeScript knowledge', 'Experience with Node.js'],
          postedAt: '2024-01-20T10:00:00Z',
          applicants: 45,
          logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        },
        {
          _id: '2',
          title: 'UI/UX Designer',
          company: 'DesignHub',
          category: 'design',
          type: 'contract',
          salary: '80,000 - 120,000',
          location: 'Remote',
          description: 'Create beautiful and intuitive user interfaces for our clients.',
          requirements: ['Figma expertise', 'Portfolio required', '3+ years experience'],
          postedAt: '2024-01-19T14:30:00Z',
          applicants: 32,
          logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        },
        {
          _id: '3',
          title: 'Digital Marketing Specialist',
          company: 'Growth Agency',
          category: 'marketing',
          type: 'full-time',
          salary: '100,000 - 150,000',
          location: 'Mombasa',
          description: 'Drive digital marketing campaigns and manage social media presence.',
          requirements: ['Google Ads experience', 'SEO knowledge', 'Analytics proficiency'],
          postedAt: '2024-01-18T09:00:00Z',
          applicants: 28,
          logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        },
        {
          _id: '4',
          title: 'Content Writer',
          company: 'ContentPro',
          category: 'writing',
          type: 'freelance',
          salary: '20,000 - 50,000',
          location: 'Remote',
          description: 'Write engaging content for blogs, websites, and social media.',
          requirements: ['Excellent writing skills', 'SEO knowledge', 'Research abilities'],
          postedAt: '2024-01-17T16:00:00Z',
          applicants: 56,
          logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        },
      ]);
    }
  };

  const [filteredJobs, setFilteredJobs] = useState([]);

  const filterJobs = () => {
    let filtered = jobs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((j) => j.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((j) => j.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter((j) =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Jobs & Freelancing</h1>
          <p className="text-gray-400">Find your next opportunity</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedType === type
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No jobs found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredJobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium capitalize">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>KES {job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{timeAgo(job.postedAt)}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{job.applicants} applicants</span>
                    <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JobsPage;
