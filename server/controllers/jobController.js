const Job = require('../models/Job');
const notificationService = require('../services/notificationService');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' }).populate('employer', 'name avatar');
    res.json({ success: true, count: jobs.length, data: jobs });
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
      .populate('employer', 'name avatar rating')
      .populate('applications.applicant', 'name avatar email phone');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a job listing
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  const { title, description, budget, category, location } = req.body;

  try {
    const job = await Job.create({
      employer: req.user._id,
      title,
      description,
      budget,
      category,
      location,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Apply for a job listing
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = async (req, res) => {
  const { coverLetter, bidAmount } = req.body;

  if (!coverLetter || !bidAmount) {
    return res.status(400).json({ success: false, message: 'Please specify cover letter and bid amount' });
  }

  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Job is no longer open for applications' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      (app) => app.applicant.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    job.applications.push({
      applicant: req.user._id,
      coverLetter,
      bidAmount,
    });

    await job.save();

    // Notify Employer
    await notificationService.createNotification(
      job.employer,
      'New Job Application',
      `Someone applied for your job listing: "${job.title}" bidding KES ${bidAmount}`,
      'Job',
      `/jobs/${job._id}`
    );

    res.json({ success: true, message: 'Application submitted successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update application status (Employer hires/rejects)
// @route   PUT /api/jobs/:id/applications/:appId
// @access  Private
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body; // 'Shortlisted', 'Hired', 'Rejected'

  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check authorization: Only employer can change application statuses
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage applications for this job' });
    }

    const application = job.applications.id(req.params.appId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;

    if (status === 'Hired') {
      job.status = 'In_Progress';
    }

    await job.save();

    // Notify applicant
    await notificationService.createNotification(
      application.applicant,
      'Job Application Status Update',
      `Your application for "${job.title}" was updated to: ${status}`,
      'Job',
      `/jobs/${job._id}`
    );

    res.json({ success: true, message: `Application status updated to: ${status}`, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  updateApplicationStatus,
};
