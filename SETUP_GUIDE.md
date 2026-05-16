# Prime Motors - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend Configuration

Copy `.env.example` to `.env` in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your actual values:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prime_motors
DB_USER=postgres
DB_PASSWORD=your_postgresql_password

# JWT
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d

# Email (optional - for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration

Copy `.env.example` to `.env` in the `frontend` folder:

```bash
cd frontend
cp .env.example .env
```

Update the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Setup PostgreSQL Database

1. Create a new database named `prime_motors`:
```sql
CREATE DATABASE prime_motors;
```

2. Initialize the database tables:
```bash
cd backend
npm run db:init
```

This will create all necessary tables and insert:
- Sample truck categories
- Admin user (email: `admin@primemotors.com`, password: `admin123`)

### 4. Start the Application

#### Option 1: Run both servers simultaneously (recommended)

From the root directory:
```bash
npm run dev
```

#### Option 2: Run servers separately

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## Default Admin Credentials

- Email: `admin@primemotors.com`
- Password: `admin123`

**Important:** Change the admin password after first login!

## Project Structure

```
prime-motors/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── trucks.js            # Truck management
│   │   ├── orders.js            # Order management
│   │   ├── cart.js              # Shopping cart
│   │   ├── users.js             # User management (admin)
│   │   ├── admin.js             # Admin dashboard
│   │   └── contact.js           # Contact form
│   ├── scripts/
│   │   └── initDb.js            # Database initialization
│   ├── uploads/                 # Truck images (create this folder)
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Main layout with header/footer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── CartContext.jsx  # Shopping cart state
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   ├── Trucks.jsx       # Truck listing
│   │   │   ├── TruckDetail.jsx  # Truck details
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Checkout.jsx     # Checkout page
│   │   │   ├── Dashboard.jsx     # Customer dashboard
│   │   │   ├── OrderDetail.jsx  # Order details
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminTrucks.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── utils/
│   │   │   └── axios.js         # API client
│   │   ├── App.jsx              # Main app with routing
│   │   └── index.js             # Entry point
│   ├── tailwind.config.js       # TailwindCSS configuration
│   └── package.json
├── package.json
└── README.md
```

## Features Implemented

### User Features
- ✅ User registration and login
- ✅ Browse trucks with search and filters
- ✅ View truck details with images
- ✅ Add trucks to cart
- ✅ Checkout process
- ✅ Order tracking with status updates
- ✅ Customer dashboard (profile, order history)
- ✅ Contact form

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Add/edit/delete trucks
- ✅ Manage orders (update status, tracking)
- ✅ Manage users (activate/deactivate, change roles)
- ✅ View sales reports

### Technical Features
- ✅ JWT authentication
- ✅ Role-based access control (customer/admin)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ RESTful API
- ✅ PostgreSQL database
- ✅ Image upload support (multer)

## Adding Trucks

1. Login as admin
2. Go to Admin → Manage Trucks
3. Click "Add Truck"
4. Fill in the truck details
5. Upload images (optional)
6. Click "Add Truck"

**Note:** For image uploads to work, create an `uploads` folder in the backend directory:
```bash
mkdir backend/uploads
```

## Payment Integration

The checkout page currently supports multiple payment methods (Credit Card, PayPal, Bank Transfer, Financing). To integrate actual payment processing:

1. Sign up for a Stripe account
2. Add your Stripe keys to the `.env` files
3. Implement Stripe checkout in the backend `/api/orders` route
4. Add Stripe Elements to the frontend checkout page

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check that the `prime_motors` database exists

### Port Already in Use
- Change the `PORT` in backend `.env` file
- Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that CORS middleware is properly configured in `server.js`

## Development Tips

### Adding New API Routes
1. Create route file in `backend/routes/`
2. Import and use in `backend/server.js`
3. Add corresponding frontend API calls in `src/utils/axios.js`

### Adding New Pages
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Layout.jsx`

### Resetting Database
```bash
cd backend
npm run db:init
```

## Security Notes

- Change default admin password immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use environment variables for sensitive data

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production database
3. Enable HTTPS
4. Set up proper CORS origins
5. Use process manager (PM2)

### Frontend
1. Run `npm run build`
2. Deploy the `build/` folder to a web server
3. Configure environment variables
4. Enable HTTPS

## Support

For issues or questions, check the code comments or review the API routes in `backend/routes/`.
