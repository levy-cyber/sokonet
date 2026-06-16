import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiDollarSign, FiClock, FiCheckCircle, FiPlus, FiStar, FiFilter, FiSearch, FiArrowRight, FiFileText, FiUsers, FiTrendingUp } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import api from '../services/api';

const JobsPage = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchMyJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setAvailableJobs(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
      setAvailableJobs([]);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/jobs/mine');
      setMyJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      setMyJobs([]);
    }
  };

  const categories = ['All', 'Logistics', 'Agriculture', 'Software Development', 'Writing', 'Design', 'Marketing', 'Manual Labor', 'Finance', 'Healthcare', 'Education', 'Other'];

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setBidAmount(job.budget * 0.9); // Default to 90% of budget
    setShowApplyModal(true);
  };

  const submitProposal = async () => {
    if (!selectedJob || !coverLetter || !bidAmount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.post(`/jobs/${selectedJob._id}/apply`, {
        coverLetter,
        bidAmount: parseFloat(bidAmount),
      });
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      setBidAmount('');
      setSelectedJob(null);
      fetchJobs(); // Refresh jobs list
      fetchMyJobs(); // Refresh my jobs
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit application: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats from real data
  const totalApplications = myJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  const activeJobsCount = myJobs.filter(job => job.status === 'Open' || job.status === 'In_Progress').length;
  const myApplications = availableJobs.filter(job => 
    job.applications?.some(app => app.applicant?._id === 'current_user_id')
  ).length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Find Jobs</h1>
        <p className="text-gray-400 text-sm lg:text-base">Browse freelance opportunities and submit proposals</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard title="My Jobs Posted" value={myJobs.length} icon={FiBriefcase} trend="+15.7%" trendUp={true} />
        <StatCard title="Active Jobs" value={activeJobsCount} icon={FiClock} trend="+12.3%" trendUp={true} />
        <StatCard title="Total Applications" value={totalApplications} icon={FiFileText} trend="+8.3%" trendUp={true} />
        <StatCard title="Open Opportunities" value={availableJobs.filter(j => j.status === 'Open').length} icon={FiTrendingUp} trend="+22.1%" trendUp={true} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-brand text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Available Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Available Jobs</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full border border-brand/20">
                        {job.category}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FiClock />
                        {job.location}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{job.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-300 text-sm flex items-center gap-1">
                        <FiUsers />
                        {job.employer?.name || 'Employer'}
                      </span>
                      <span className="text-gray-500 text-sm">• {job.applications?.length || 0} proposals</span>
                    </div>
                    {job.deadline && (
                      <div className="text-gray-400 text-sm mb-2">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {job.skills?.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-right">
                      <p className="text-brand font-bold text-xl">KES {job.budget?.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Project budget</p>
                    </div>
                    {job.status === 'Open' && (
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="flex items-center justify-center gap-2 bg-brand text-black font-semibold px-6 py-3 rounded-lg hover:bg-brand/90 transition-all"
                      >
                        <span>Apply Now</span>
                        <FiArrowRight />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* My Posted Jobs */}
      {myJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">My Posted Jobs</h2>
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div key={job._id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'Open' ? 'bg-green-500/20 text-green-400' :
                        job.status === 'Paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        job.status === 'In_Progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-gray-400 text-sm">{job.applications?.length || 0} applications</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{job.description}</p>
                    {job.deadline && (
                      <div className="text-gray-400 text-sm">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-brand font-bold text-lg">KES {job.budget?.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Budget</p>
                  </div>
                </div>
                {job.applications && job.applications.length > 0 && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-white mb-3">Applications</h4>
                    <div className="space-y-2">
                      {job.applications.map((app) => (
                        <div key={app._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img src={app.applicant?.avatar} alt={app.applicant?.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-white text-sm font-medium">{app.applicant?.name}</p>
                              <p className="text-gray-400 text-xs">Bid: KES {app.bidAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'Applied' ? 'bg-yellow-500/20 text-yellow-400' :
                            app.status === 'Shortlisted' ? 'bg-blue-500/20 text-blue-400' :
                            app.status === 'Hired' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Apply for Job</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-white font-semibold">{selectedJob.title}</p>
                <p className="text-brand font-bold">KES {selectedJob.budget?.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Your Bid Amount (KES)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're the best fit for this job..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={submitProposal}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;