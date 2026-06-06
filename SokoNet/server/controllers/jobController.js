import Job from '../models/Job.js';

export const postJob = async (req, res) => {
  const { title, description, company, location, salary, type, requirements } = req.body;

  if (!title || !description || !company) {
    return res.status(400).json({ message: 'Title, description, and company are required.' });
  }

  const job = await Job.create({
    title,
    description,
    company,
    location: location || 'Nairobi',
    salary: salary || 'Competitive',
    type: type || 'full-time',
    requirements: requirements || [],
    postedBy: req.user._id,
  });

  res.status(201).json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email role');
  res.json(jobs);
};

export const applyJob = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found.' });
  }

  const existingApplication = job.applicants.find((applicant) => applicant.user.equals(req.user._id));
  if (existingApplication) {
    return res.status(400).json({ message: 'You have already applied for this job.' });
  }

  job.applicants.push({ user: req.user._id, message: message || '' });
  await job.save();

  res.json({ message: 'Application submitted successfully.', jobId: job._id });
};
