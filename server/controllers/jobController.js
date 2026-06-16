const Job = require('../models/Job');
const User = require('../models/User');
const Message = require('../models/Message');
const notificationService = require('../services/notificationService');

// @desc    Get all open jobs (platform-wide)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search, category, location, status = 'Open', page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.find(query)
      .populate('employer', 'name avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);
    res.json({ success: true, count: jobs.length, total, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get job details by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name avatar rating email phone')
      .populate('applications.applicant', 'name avatar email phone rating');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get my posted jobs
// @route   GET /api/jobs/mine
// @access  Private
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate('applications.applicant', 'name avatar email phone rating')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a job listing (any authenticated user)
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  const { title, description, budget, salary, category, location, skills, deadline, contactDetails } = req.body;

  if (!title || !description || !budget || !category) {
    return res.status(400).json({ success: false, message: 'Title, description, budget, and category are required' });
  }

  try {
    const employer = await User.findById(req.user._id);
    const job = await Job.create({
      employer: req.user._id,
      title, description, budget, salary, category,
      location: location || 'Remote',
      skills: skills || [],
      deadline: deadline ? new Date(deadline) : undefined,
      contactDetails: contactDetails || {
        phone: employer.phone,
        email: employer.email,
      },
    });

    const populated = await Job.findById(job._id).populate('employer', 'name avatar rating');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update job listing (employer only)
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('employer', 'name avatar rating');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Pause a job listing
// @route   PUT /api/jobs/:id/pause
// @access  Private
const pauseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    job.status = 'Paused';
    await job.save();
    res.json({ success: true, message: 'Job paused', data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Close a job listing
// @route   PUT /api/jobs/:id/close
// @access  Private
const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    job.status = 'Closed';
    await job.save();
    res.json({ success: true, message: 'Job closed', data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ success: true, message: 'Job listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Apply for a job listing
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = async (req, res) => {
  const { coverLetter, bidAmount, skills, profileInfo } = req.body;
  if (!coverLetter || !bidAmount) {
    return res.status(400).json({ success: false, message: 'Please specify cover letter and bid amount' });
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Job is no longer open for applications' });
    }

    const alreadyApplied = job.applications.some(app => app.applicant.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const applicant = await User.findById(req.user._id);

    job.applications.push({
      applicant: req.user._id,
      coverLetter,
      bidAmount,
      skills: skills || [],
      profileInfo: profileInfo || '',
      contactDetails: {
        phone: applicant.phone,
        email: applicant.email,
      },
    });
    await job.save();

    // Notify Employer via notification
    await notificationService.createNotification(
      job.employer,
      'New Job Application',
      `${applicant.name} applied for your job: "${job.title}" — Bid: KES ${bidAmount}`,
      'Job',
      `/jobs/${job._id}`
    );

    // Also send a private message to the employer with applicant details
    await Message.create({
      sender: req.user._id,
      receiver: job.employer,
      content: `📋 New Application for "${job.title}"\n\nApplicant: ${applicant.name}\nPhone: ${applicant.phone}\nEmail: ${applicant.email}\nBid: KES ${bidAmount}\n\nCover Letter:\n${coverLetter}`,
      isPublic: false,
    });

    res.json({ success: true, message: 'Application submitted successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/:id/applications/:appId
// @access  Private
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage applications for this job' });
    }

    const application = job.applications.id(req.params.appId);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    if (status === 'Hired') job.status = 'In_Progress';
    await job.save();

    await notificationService.createNotification(
      application.applicant,
      'Job Application Update',
      `Your application for "${job.title}" status: ${status}`,
      'Job',
      `/jobs/${job._id}`
    );

    res.json({ success: true, message: `Application updated to: ${status}`, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJobs, getJobById, getMyJobs,
  createJob, updateJob, pauseJob, closeJob, deleteJob,
  applyForJob, updateApplicationStatus,
};
