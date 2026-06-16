# SokoNet User Guide

This guide explains how to use the enhanced features of the SokoNet platform.

## Table of Contents

1. [Super Admin System](#super-admin-system)
2. [Support System](#support-system)
3. [Dynamic Wallet Balance](#dynamic-wallet-balance)
4. [Registration Limits](#registration-limits)
5. [Secure Account Deletion](#secure-account-deletion)
6. [Services Marketplace](#services-marketplace)
7. [Jobs Hub System](#jobs-hub-system)
8. [Dashboard Activity Summary](#dashboard-activity-summary)
9. [Chat System Improvements](#chat-system-improvements)

## Super Admin System

### Overview
The Super Admin has full unrestricted control over the platform, including users, products, jobs, chats, transactions, settings, and reports.

### Access
- **Login URL**: `/admin-login`
- **Credentials**: 
  - Email: `admin@netsoko.co.ke`
  - Password: `bignetsoko@9625white`

### Features

#### User Management
- View all registered users
- Activate/deactivate user accounts
- Ban/unban users
- View user details and activity

#### Product Management
- Approve/reject product listings
- Feature/unfeature products
- Remove inappropriate products
- View product analytics

#### Platform Analytics
- View platform-wide statistics
- Monitor revenue and transactions
- Track user growth and engagement
- Generate reports

#### System Settings
- Configure platform settings
- Manage payment gateways
- Update system notifications
- Control feature flags

### Admin Dashboard
Navigate to `/admin` after login to access the admin dashboard with:
- Overview statistics
- User management panel
- Product moderation queue
- Transaction monitoring
- System health status

## Support System

### Overview
The support system allows users to submit support tickets and communicate with the support team.

### Access
- **Support Page**: `/support`
- **Support Button**: Click the headphones icon in the navbar

### Creating a Support Ticket

1. Click the headphones icon in the navbar or navigate to `/support`
2. Click "+ New" button
3. Fill in the ticket details:
   - **Subject**: Brief description of your issue
   - **Category**: Account, Payment, Order, Product, Technical, or Other
   - **Priority**: Low, Medium, High, or Urgent
   - **Message**: Detailed description of your issue
4. Click "Submit Ticket"

### Managing Tickets

#### Viewing Your Tickets
- All your tickets are listed in the left panel
- Tickets show status (Open, In Progress, Resolved, Closed)
- Click on a ticket to view details and conversation history

#### Replying to Tickets
- Select a ticket from the list
- Type your reply in the input field
- Click the send button or press Enter
- Support team will be notified of your reply

#### Ticket Status
- **Open**: Ticket is awaiting support response
- **In Progress**: Support team is actively working on it
- **Resolved**: Issue has been resolved
- **Closed**: Ticket is closed (can be reopened if needed)

### Support Team Access
Support staff can access all tickets via the admin dashboard to:
- View all user tickets
- Reply to tickets
- Update ticket status
- Assign priority levels

## Dynamic Wallet Balance

### Overview
Your wallet balance updates in real-time after all transactions including deposits, withdrawals, purchases, and refunds.

### Viewing Your Balance

#### In Navbar
- Your current balance is displayed in the navbar
- Updates automatically after transactions
- Shows in KES (Kenyan Shillings)

#### In Wallet Page
- Navigate to `/wallet`
- View detailed balance information
- Check transaction history
- See pending transactions

### Real-time Updates
- Balance updates immediately after:
  - Successful M-Pesa deposit
  - Bank transfer deposit
  - Purchase payment
  - Withdrawal
  - Refund
  - P2P transfer

### Transaction History
View all your transactions in the wallet page:
- **Type**: Deposit, Withdrawal, Purchase, Refund, Transfer
- **Amount**: Transaction amount in KES
- **Status**: Pending, Completed, Failed
- **Date**: Transaction timestamp
- **Reference**: Transaction reference number

## Registration Limits

### Overview
To prevent abuse, the system limits registrations to maximum 2 accounts per phone number and email address.

### Registration Process

1. Navigate to `/register`
2. Fill in registration details:
   - Name
   - Email
   - Phone number
   - Password
   - Role selection
3. Click "Register"

### Limit Enforcement

#### Email Limit
- Maximum 2 accounts per email address
- Error message: "Maximum 2 accounts allowed per email address"

#### Phone Limit
- Maximum 2 accounts per phone number
- Error message: "Maximum 2 accounts allowed per phone number"

### Error Handling
If you exceed the limit:
1. You'll see a clear error message
2. Registration will not proceed
3. Contact support if you need additional accounts

## Secure Account Deletion

### Overview
Account deletion requires OTP verification via email or phone to prevent accidental deletions.

### Deleting Your Account

1. Navigate to `/settings`
2. Scroll to "Account" section
3. Click "Delete Account"
4. Read the warning message carefully
5. Choose verification method (email or phone)
6. Click "Request Deletion"

### OTP Verification

1. You'll receive a 6-digit OTP code
2. Enter the OTP in the verification field
3. Click "Confirm Deletion"
4. Account will be permanently deleted

### Important Notes

- **Permanent Action**: Account deletion is irreversible
- **Data Loss**: All your data will be permanently deleted
- **Wallet Balance**: Ensure you withdraw funds before deletion
- **Active Orders**: Complete or cancel active orders before deletion
- **Admin Review**: Deletion events are logged for admin review

### Deletion Process

1. **Request**: User requests deletion
2. **OTP Verification**: User verifies identity with OTP
3. **Soft Delete**: Account is marked as deleted
4. **Data Cleanup**: Data is removed after retention period
5. **Admin Log**: Deletion is logged for audit

## Services Marketplace

### Overview
Browse and book professional services from verified providers including freelancers, riders, technicians, consultants, and service providers.

### Access
- **Services Marketplace**: `/services`

### Browsing Services

1. Navigate to `/services`
2. Use search to find specific services
3. Filter by category:
   - Home Services
   - Tech Support
   - Business Services
   - Education
   - Health & Wellness
   - Other
4. View service details including:
   - Provider profile and rating
   - Service title and description
   - Pricing
   - Location
   - Availability status
   - Skills and experience

### Booking a Service

1. Click on a service card
2. Review service details
3. Click "Book Service"
4. Select date and time
5. Confirm booking
6. Payment processed via wallet or M-Pesa

### Service Provider Features

#### Listing Your Services
1. Navigate to `/services/mine`
2. Click "Add Service"
3. Fill in service details:
   - Title
   - Description
   - Category
   - Pricing
   - Location
   - Skills
   - Images
   - Availability
4. Click "Create Service"

#### Managing Services
- Edit service details
- Update availability status
- View booking requests
- Manage service ratings

### Service Categories

- **Home Services**: Plumbing, electrical, cleaning, repairs
- **Tech Support**: Computer repair, software installation, networking
- **Business Services**: Consulting, accounting, marketing
- **Education**: Tutoring, training, courses
- **Health & Wellness**: Fitness training, nutrition, therapy
- **Other**: Custom services

## Jobs Hub System

### Overview
Post jobs, apply for opportunities, and manage job applications with notifications and status tracking.

### Access
- **Jobs Hub**: `/jobs`

### Browsing Jobs

1. Navigate to `/jobs`
2. Use search to find specific jobs
3. Filter by category:
   - Logistics
   - Agriculture
   - Software Development
   - Writing
   - Design
   - Marketing
   - Manual Labor
   - Finance
   - Healthcare
   - Education
   - Other
4. View job details:
   - Job title and description
   - Budget/salary
   - Location
   - Skills required
   - Deadline
   - Number of applications
   - Employer profile

### Applying for Jobs

1. Click on a job listing
2. Review job details
3. Click "Apply Now"
4. Fill in application:
   - Your bid amount
   - Cover letter
   - Relevant skills
   - Additional information
5. Click "Submit Application"
6. Employer will be notified

### Managing Applications

#### Viewing Your Applications
- Navigate to `/jobs`
- View "My Posted Jobs" section
- See all applications to your jobs
- Track application status

#### Application Status
- **Applied**: Application submitted
- **Shortlisted**: Employer is considering you
- **Hired**: You've been selected for the job
- **Rejected**: Application was not successful

### Posting Jobs

1. Navigate to `/jobs`
2. Click "Post Job" (if available)
3. Fill in job details:
   - Title
   - Description
   - Budget
   - Category
   - Location
   - Skills required
   - Deadline
   - Contact details
4. Click "Post Job"

### Managing Your Jobs

#### Job Actions
- **Edit**: Update job details
- **Pause**: Temporarily stop accepting applications
- **Close**: Permanently close job listing
- **Remove**: Delete job posting

#### Application Management
- View all applications
- Review applicant profiles
- Update application status
- Send messages to applicants

### Notifications

You'll receive notifications for:
- New job applications
- Application status updates
- Job posting responses
- Messages from employers/applicants

## Dashboard Activity Summary

### Overview
The dashboard provides a comprehensive summary of your account activity including wallet balance, transactions, products, services, jobs, applications, messages, and notifications.

### Access
- **Dashboard**: `/` (home page)

### Dashboard Components

#### Wallet Summary
- Current balance in KES
- Recent transactions
- Quick deposit/withdraw buttons

#### Activity Stats
- Products posted
- Services listed
- Jobs posted
- Job applications submitted
- Unread messages
- Unread notifications

#### Recent Activity
- Recent products
- Recent jobs
- Recent notifications
- Account status

#### Role-Specific Views
Dashboard adapts based on your active role:
- **Buyer**: Orders, wishlist, cart
- **Seller**: Products, orders, analytics
- **Service Provider**: Services, bookings
- **Rider**: Deliveries, earnings
- **Freelancer**: Jobs, applications

### Real-time Updates
- Dashboard updates automatically
- WebSocket integration for live data
- Refresh on role change
- Transaction notifications

## Chat System Improvements

### Overview
Enhanced chat system with public and private messaging, encryption, read receipts, online status, file sharing, and user blocking.

### Access
- **Chat Page**: `/chat`

### Public Chat

#### Features
- Real-time messaging visible to all users
- Emoji support
- Image sharing
- File attachments
- Admin moderation

#### Using Public Chat
1. Navigate to `/chat`
2. Toggle to "Public Mode"
3. Type your message
4. Press Enter or click send
5. Message appears in public chatroom

### Private Chat

#### Features
- End-to-end encryption
- Real-time messaging
- Read receipts
- Online status indicators
- File sharing
- User blocking
- Conversation history

#### Starting a Private Chat
1. Navigate to `/chat`
2. Select a conversation from the list
3. Type your message
4. Press Enter or click send
5. Message is delivered securely

#### Chat Features

**Online Status**
- Green dot: User is online
- Gray dot: User is offline
- Updates in real-time

**Read Receipts**
- Double check: Message read
- Single check: Message delivered
- No check: Message sent

**File Sharing**
- Click attachment icon
- Select file to share
- File is uploaded and sent

**User Blocking**
- Open conversation menu
- Select "Block User"
- User can no longer message you

### Chat Moderation

Admins can:
- Remove inappropriate messages
- Ban users from public chat
- Monitor chat activity
- Set chat rules

### Notifications

You'll receive notifications for:
- New messages
- Message read receipts
- Online status changes
- File attachments

## Getting Help

### Support
- Click the headphones icon in the navbar
- Create a support ticket
- Describe your issue
- Support team will respond

### Documentation
- API Documentation: `/docs/API_DOCUMENTATION.md`
- Setup Guide: `/docs/SETUP_GUIDE.md`
- User Guide: `/docs/USER_GUIDE.md` (this file)

### Contact
- Email: support@sokonet.co.ke
- Phone: Available in support system

## Tips for Best Experience

1. **Keep Your Profile Updated**: Ensure your contact information is current
2. **Use Strong Passwords**: Protect your account with secure passwords
3. **Enable Notifications**: Stay updated with platform activities
4. **Verify Transactions**: Check your wallet balance regularly
5. **Read Service/Job Details**: Understand requirements before applying
6. **Communicate Clearly**: Be specific in messages and applications
7. **Report Issues**: Use the support system for problems
8. **Stay Safe**: Never share sensitive information in chat

## Platform Rules

1. **One Account Per Person**: Respect registration limits
2. **No Spam**: Don't send unsolicited messages
3. **Respect Others**: Be polite in all communications
4. **Accurate Information**: Provide truthful details in listings
5. **Timely Responses**: Respond to messages and applications promptly
6. **Fair Pricing**: Set reasonable prices for products/services
7. **Professional Conduct**: Maintain professionalism in all interactions

## Account Security

- Never share your password
- Enable two-factor authentication when available
- Log out from shared devices
- Report suspicious activity immediately
- Keep your contact information updated
- Review your account settings regularly
