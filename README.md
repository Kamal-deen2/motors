# Prime Motors - Truck Dealership Website

A full-featured e-commerce truck dealership website built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication (registration, login, password recovery)
- Truck browsing with advanced search and filtering
- Shopping cart and checkout system
- Payment integration (Stripe, PayPal)
- Order tracking with real-time status updates
- Customer dashboard for profile and order management
- Admin panel for truck, user, and order management
- Responsive design for mobile, tablet, and desktop
- Secure authentication with JWT

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- shadcn/ui components
- React Router
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Nodemailer (email notifications)

## Installation

1. Install dependencies:
```bash
npm run install:all
```

2. Configure environment variables:
- Copy `.env.example` to `.env` in both `backend` and `frontend` folders
- Update with your database credentials and API keys

3. Initialize database:
```bash
cd backend
npm run db:init
```

4. Start development servers:
```bash
npm run dev
```

## Project Structure

```
prime-motors/
├── backend/          # Node.js/Express API
├── frontend/         # React application
└── README.md
```

## Usage

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:5000
- Admin panel accessible at /admin
