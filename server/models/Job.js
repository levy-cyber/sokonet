const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Please add a cover letter'],
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    skills: [{ type: String }],
    profileInfo: {
      type: String,
    },
    contactDetails: {
      phone: String,
      email: String,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Hired', 'Rejected'],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    budget: {
      type: Number,
      required: [true, 'Please specify a budget'],
    },
    salary: {
      type: String, // e.g. "KES 50,000 - 80,000/month" or "Negotiable"
    },
    currency: {
      type: String,
      default: 'KES',
    },
    category: {
      type: String,
      required: [true, 'Please select a job category'],
      enum: ['Logistics', 'Agriculture', 'Software Development', 'Writing', 'Design', 'Marketing', 'Manual Labor', 'Finance', 'Healthcare', 'Education', 'Other'],
    },
    skills: [{ type: String }],
    location: {
      type: String,
      default: 'Remote',
    },
    deadline: {
      type: Date,
    },
    contactDetails: {
      phone: String,
      email: String,
      whatsapp: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Paused', 'In_Progress', 'Completed', 'Closed'],
      default: 'Open',
    },
    applications: [applicationSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
