import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiDollarSign, FiClock, FiCheckCircle, FiPlus, FiStar, FiFilter, FiSearch, FiArrowRight, FiFileText, FiUsers, FiTrendingUp } from 'react-icons/fi';
import StatCard from '../components/StatCard';

const JobsPage = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Mock jobs data
    setAvailableJobs([
      {
        id: 1,
        title: 'E-commerce Website Development',
        description: 'Looking for an experienced React developer to build a full e-commerce platform with payment integration.',
        budget: 150000,
        category: 'Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        duration: '4 weeks',
        client: 'Tech Startup Kenya',
        clientId: 'client1',
        postedDate: new Date(Date.now() - 86400000),
        proposals: 5,
        status: 'open'
      },
      {
        id: 2,
        title: 'Mobile App UI Design',
        description: 'Design a modern, user-friendly UI for a fitness tracking mobile app.',
        budget: 75000,
        category: 'Design',
        skills: ['Figma', 'UI/UX', 'Mobile'],
        duration: '2 weeks',
        client: 'Fitness Kenya',
        clientId: 'client2',
        postedDate: new Date(Date.now() - 172800000),
        proposals: 12,
        status: 'open'
      },
      {
        id: 3,
        title: 'Content Writing - Tech Blog',
        description: 'Write 10 SEO-optimized articles about technology trends and digital transformation.',
        budget: 30000,
        category: 'Writing',
        skills: ['Content Writing', 'SEO', 'Tech'],
        duration: '1 week',
        client: 'Digital Media',
        clientId: 'client3',
        postedDate: new Date(Date.now() - 259200000),
        proposals: 8,
        status: 'open'
      },
      {
        id: 4,
        title: 'Data Analysis Dashboard',
        description: 'Create interactive dashboards using Python for sales data visualization.',
        budget: 120000,
        category: 'Data',
        skills: ['Python', 'Data Visualization', 'Analytics'],
        duration: '3 weeks',
        client: 'Retail Corp',
        clientId: 'client4',
        postedDate: new Date(Date.now() - 432000000),
        proposals: 3,
        status: 'open'
      }
    ]);

    setMyProposals([
      {
        id: 1,
        jobId: 1,
        proposedAmount: 135000,
        coverLetter: 'I have extensive experience with e-commerce development and can deliver within the timeline.',
        status: 'pending',
        submittedDate: new Date(Date.now() - 43200000)
      }
    ]);

    setActiveProjects([
      {
        id: 1,
        title: 'Website Redesign',
        client: 'Local Business',
        budget: 85000,
        progress: 65,
        deadline: new Date(Date.now() + 1209600000),
        status: 'in_progress'
      },
      {
        id: 2,
        title: 'Mobile App Development',
        client: 'Startup Inc',
        budget: 150000,
        progress: 30,
        deadline: new Date(Date.now() + 2592000000),
        status: 'in_progress'
      }
    ]);

    setTotalEarnings(285000);
  }, []);

  const categories = ['All', 'Development', 'Design', 'Writing', 'Data', 'Marketing', 'Other'];

  const submitProposal = (jobId) => {
    const job = availableJobs.find(j => j.id === jobId);
    if (job) {
      const newProposal = {
        id: myProposals.length + 1,
        jobId: job.id,
        proposedAmount: job.budget * 0.9, // 10% discount
        coverLetter: 'I am interested in this project and confident I can deliver high-quality work.',
        status: 'pending',
        submittedDate: new Date()
      };
      setMyProposals([newProposal, ...myProposals]);
      setAvailableJobs(prev => prev.filter(j => j.id !== jobId));
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <StatCard title="Total Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={FiDollarSign} trend="+32.2%" trendUp={true} />
        <StatCard title="Active Projects" value={activeProjects.length} icon={FiBriefcase} trend="+15.7%" trendUp={true} />
        <StatCard title="Pending Proposals" value={myProposals.filter(p => p.status === 'pending').length} icon={FiFileText} trend="+8.3%" trendUp={true} />
        <StatCard title="Average Rating" value="4.7/5.0" icon={FiStar} trend="+2.3%" trendUp={true} />
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
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full border border-brand/20">
                      {job.category}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <FiClock />
                      {job.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{job.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-300 text-sm flex items-center gap-1">
                      <FiUsers />
                      {job.client}
                    </span>
                    <span className="text-gray-500 text-sm">• {job.proposals} proposals</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="text-right">
                    <p className="text-brand font-bold text-xl">KES {job.budget.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Project budget</p>
                  </div>
                  <button
                    onClick={() => submitProposal(job.id)}
                    className="flex items-center justify-center gap-2 bg-brand text-black font-semibold px-6 py-3 rounded-lg hover:bg-brand/90 transition-all"
                  >
                    <span>Submit Proposal</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Active Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">My Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {activeProjects.map((project) => (
            <div key={project.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm">{project.client}</p>
                </div>
                <span className="text-brand font-bold text-lg">KES {project.budget.toLocaleString()}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <FiClock />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => alert(`Project Details:\n\nTitle: ${project.title}\nClient: ${project.client}\nBudget: KES ${project.budget.toLocaleString()}\nProgress: ${project.progress}%\nDeadline: ${new Date(project.deadline).toLocaleDateString()}`)}
                  className="text-brand hover:text-brand/80 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* My Proposals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">My Proposals</h2>
        <div className="space-y-4">
          {myProposals.map((proposal) => {
            const job = availableJobs.find(j => j.id === proposal.jobId) || { title: 'Unknown Job' };
            return (
              <div key={proposal.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proposal.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : proposal.status === 'accepted'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {proposal.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                    <p className="text-gray-400 text-sm">{proposal.coverLetter}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand font-bold text-lg">KES {proposal.proposedAmount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Proposed amount</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default JobsPage;