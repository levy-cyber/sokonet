# SokoNet Architecture

## Overview

SokoNet is designed as a modular fintech marketplace ecosystem with three main deliverables:

- `client/` - web dashboard and marketplace front-end
- `server/` - API backend with authentication, payments, escrow, wallet, delivery, jobs, and notifications
- `mobile/` - React Native Expo mobile application for Android and iOS

## Key Backend Services

- User authentication and role-based access control
- Marketplace product listings with seller stores
- Escrow payment workflows for buyer-seller protection
- Wallet and transaction tracking with MPesa and Stripe integration structure
- Rider delivery assignment and tracking
- Job marketplace and application workflow
- Real-time messaging and notifications with Socket.io
- Analytics dashboard for admin users

## Deployment Targets

- Web app: Vercel / Netlify
- API backend: Render / Railway
- Database: MongoDB Atlas
- Mobile app: Expo EAS build for Android APK

## Environment Variables

- `MONGO_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `MPESA_API_KEY`
- `MPESA_API_SECRET`
- `FRONTEND_URL`
- `MOBILE_URL`
