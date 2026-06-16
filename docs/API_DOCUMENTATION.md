# SokoNet API Documentation

## Base URL

```
Production: https://sokonet-api.onrender.com/api
Development: http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Auth Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "password": "password123",
  "role": "buyer"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Admin Login (Super Admin / Support)
```http
POST /auth/admin-login
Content-Type: application/json

{
  "email": "admin@netsoko.co.ke",
  "password": "bignetsoko@9625white"
}
```

#### Request Account Deletion
```http
POST /auth/request-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "method": "email"
}
```

#### Confirm Account Deletion (with OTP)
```http
POST /auth/confirm-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+254798765432"
}
```

### Product Endpoints

#### Get All Products
```http
GET /products
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `search`: Search term

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product (Seller only)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "description": "Product description",
  "price": 185000,
  "category": "electronics",
  "stock": 15,
  "images": ["image_url_1", "image_url_2"]
}
```

#### Update Product (Seller only)
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 180000,
  "stock": 20
}
```

#### Delete Product (Seller only)
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Nairobi, Kenya",
  "paymentMethod": "mpesa"
}
```

#### Get My Orders
```http
GET /orders/my
Authorization: Bearer <token>
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <token>
```

#### Track Order
```http
GET /orders/:id/track
Authorization: Bearer <token>
```

### Wallet Endpoints

#### Get Wallet Balance
```http
GET /wallet
Authorization: Bearer <token>
```

#### Get Transaction History
```http
GET /wallet/transactions
Authorization: Bearer <token>
```

#### Deposit Funds
```http
POST /wallet/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "method": "mpesa"
}
```

#### Withdraw Funds
```http
POST /wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 20000,
  "method": "mpesa"
}
```

#### Transfer Funds
```http
POST /wallet/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user_id",
  "amount": 5000
}
```

### Escrow Endpoints

#### Get All Escrow Transactions
```http
GET /escrow
Authorization: Bearer <token>
```

#### Get Escrow by ID
```http
GET /escrow/:id
Authorization: Bearer <token>
```

#### Release Escrow Funds
```http
PUT /escrow/:id/release
Authorization: Bearer <token>
```

#### Refund Escrow Funds
```http
PUT /escrow/:id/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Product not as described"
}
```

### Rider Endpoints

#### Get Rider Dashboard
```http
GET /riders/dashboard
Authorization: Bearer <token>
```

#### Accept Delivery
```http
PUT /riders/deliveries/:id/accept
Authorization: Bearer <token>
```

#### Complete Delivery
```http
PUT /riders/deliveries/:id/complete
Authorization: Bearer <token>
```

#### Update Rider Location
```http
PUT /riders/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": -1.2921,
  "longitude": 36.8219,
  "orderId": "order_id"
}
```

### Message Endpoints

#### Get Conversations
```http
GET /messages/conversations
Authorization: Bearer <token>
```

#### Get Messages with User
```http
GET /messages/:userId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user_id",
  "content": "Hello!"
}
```

### Job Endpoints

#### Get All Jobs
```http
GET /jobs
```

Query Parameters:
- `category`: Filter by category
- `location`: Filter by location
- `search`: Search term
- `status`: Filter by status (Open, Paused, Closed, In_Progress)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### Get Job by ID
```http
GET /jobs/:id
Authorization: Bearer <token>
```

#### Get My Posted Jobs
```http
GET /jobs/mine
Authorization: Bearer <token>
```

#### Create Job (Any authenticated user)
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior React Developer",
  "description": "Job description",
  "budget": 150000,
  "category": "Software Development",
  "location": "Nairobi",
  "skills": ["React", "Node.js", "TypeScript"],
  "deadline": "2024-12-31"
}
```

#### Update Job (Job owner only)
```http
PUT /jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Job Title",
  "budget": 200000
}
```

#### Pause Job (Job owner only)
```http
PUT /jobs/:id/pause
Authorization: Bearer <token>
```

#### Close Job (Job owner only)
```http
PUT /jobs/:id/close
Authorization: Bearer <token>
```

#### Delete Job (Job owner only)
```http
DELETE /jobs/:id
Authorization: Bearer <token>
```

#### Apply for Job
```http
POST /jobs/:id/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am interested in this position...",
  "bidAmount": 135000,
  "skills": ["React", "Node.js"],
  "profileInfo": "Additional information about yourself"
}
```

#### Update Application Status (Job owner only)
```http
PUT /jobs/:id/applications/:appId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Shortlisted"
}
```

### Services Endpoints

#### Get All Services
```http
GET /services
```

Query Parameters:
- `category`: Filter by category
- `search`: Search term
- `availability`: Filter by availability (available, busy)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### Get Service by ID
```http
GET /services/:id
```

#### Get My Services (Service Provider only)
```http
GET /services/mine
Authorization: Bearer <token>
```

#### Create Service (Service Provider only)
```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Plumbing Repair",
  "description": "Expert plumbing services for homes and businesses",
  "category": "Home Services",
  "pricing": 2500,
  "pricingType": "fixed",
  "location": "Nairobi",
  "skills": ["Plumbing", "Pipe Repair"],
  "images": ["image_url_1"],
  "availability": "available"
}
```

#### Update Service (Service Provider only)
```http
PUT /services/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricing": 3000,
  "availability": "busy"
}
```

#### Delete Service (Service Provider only)
```http
DELETE /services/:id
Authorization: Bearer <token>
```

### Support Endpoints

#### Create Support Ticket
```http
POST /support/ticket
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Payment Issue",
  "category": "Payment",
  "priority": "high",
  "message": "I made a deposit but it's not reflecting in my wallet"
}
```

#### Get My Support Tickets
```http
GET /support/tickets
Authorization: Bearer <token>
```

#### Get All Support Tickets (Admin/Support only)
```http
GET /support/tickets/all
Authorization: Bearer <token>
```

#### Get Support Ticket by ID
```http
GET /support/ticket/:id
Authorization: Bearer <token>
```

#### Reply to Support Ticket
```http
POST /support/ticket/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Thank you for reporting this issue. We are looking into it."
}
```

#### Update Ticket Status (Admin/Support only)
```http
PUT /support/ticket/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"
}
```

### Dashboard Endpoints

#### Get Dashboard Summary
```http
GET /dashboard/summary
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "walletBalance": 50000,
    "currency": "KES",
    "recentTransactions": [...],
    "productsPosted": 5,
    "servicesListed": 3,
    "jobsPosted": 2,
    "jobApplicationsSubmitted": 10,
    "unreadMessages": 3,
    "unreadNotifications": 5,
    "accountStatus": "active",
    "recentProducts": [...],
    "recentJobs": [...],
    "recentNotifications": [...],
    "user": {...}
  }
}
```

#### Get Live Wallet Balance
```http
GET /dashboard/wallet-balance
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "balance": 50000,
  "currency": "KES"
}
```

### Shop Endpoints

#### Get My Shop (Seller only)
```http
GET /shops/my
Authorization: Bearer <token>
```

#### Get Shop Products (Seller only)
```http
GET /shops/my/products
Authorization: Bearer <token>
```

#### Update Shop (Seller only)
```http
PUT /shops/my
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Store",
  "description": "Store description",
  "location": "Nairobi, Kenya"
}
```

### Admin Endpoints (Super Admin only)

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

#### Get Company Till Balance
```http
GET /admin/till
Authorization: Bearer <token>
```

#### Deposit to Company Till
```http
POST /admin/till/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100000,
  "description": "Manual deposit"
}
```

#### User Actions
```http
PUT /users/:userId/:action
Authorization: Bearer <token>
```

Actions: `activate`, `deactivate`, `ban`, `unban`

#### Product Actions
```http
PUT /products/:productId/:action
Authorization: Bearer <token>
```

Actions: `approve`, `reject`, `feature`, `unfeature`

### Analytics Endpoints (Admin only)

#### Get Platform Analytics
```http
GET /analytics
Authorization: Bearer <token>
```

#### Get Revenue Analytics
```http
GET /analytics/revenue
Authorization: Bearer <token>
```

Query Parameters:
- `period`: 7d, 30d, 90d

#### Get User Analytics
```http
GET /analytics/users
Authorization: Bearer <token>
```

## Socket.io Events

### Client → Server

#### Join Room
```javascript
socket.emit('join', userId)
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  senderId: 'user_id',
  receiverId: 'user_id',
  content: 'Hello!'
})
```

#### Update Rider Location
```javascript
socket.emit('updateRiderLocation', {
  riderId: 'rider_id',
  orderId: 'order_id',
  latitude: -1.2921,
  longitude: 36.8219
})
```

#### Join Order Room
```javascript
socket.emit('joinOrder', orderId)
```

### Server → Client

#### Message Received
```javascript
socket.on('messageReceived', (message) => {
  // Handle new message
})
```

#### Message Sent
```javascript
socket.on('messageSent', (message) => {
  // Handle sent message confirmation
})
```

#### Rider Location Update
```javascript
socket.on('riderLocationUpdate', (location) => {
  // Handle rider location update
})
```

#### Notification
```javascript
socket.on('notification', (notification) => {
  // Handle new notification
})
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to prevent abuse:
- 100 requests per minute per IP
- 1000 requests per hour per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## Pagination

List endpoints support pagination:

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Webhooks

### M-Pesa Callback
```http
POST /wallet/mpesa-callback
```

### Stripe Webhook
```http
POST /wallet/stripe-webhook
```

## Testing

Use the provided test environment for development:
```
Base URL: http://localhost:5000/api
```

## Support

For API support, contact the development team or open an issue on GitHub.
