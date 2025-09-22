# ProFit Supplements - Full Stack Setup Guide

## Overview
This is a complete e-commerce website for ProFit Supplements with a Node.js/Express backend API and a responsive frontend built with HTML, CSS, JavaScript, and Bootstrap.

## Project Structure
```
profit-supplements/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth and other middleware
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # Static website files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── img/               # Images and assets
│   ├── fonts/             # Font files
│   ├── *.html             # HTML pages
│   └── mail.php           # Contact form PHP (legacy)
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Features

### Backend API Features
- **User Authentication**: JWT-based registration, login, profile management
- **Product Management**: CRUD operations, search, filtering, inventory tracking
- **Order System**: Shopping cart, order processing, status tracking
- **Blog Management**: Article creation, categories, search functionality
- **Contact System**: Contact form processing with email notifications
- **Admin Panel**: Product, order, blog, and contact management
- **Security**: Rate limiting, CORS, input validation, password hashing

### Frontend Features
- **Responsive Design**: Mobile-first Bootstrap layout
- **Product Catalog**: Filtering, sorting, search, detailed product pages
- **Shopping Cart**: Add/remove items, quantity management, checkout
- **User Accounts**: Registration, login, profile management
- **Blog Section**: Article reading, categories, search
- **Contact Forms**: Contact page, newsletter subscription
- **Interactive Elements**: Hover animations, cursor effects

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd profit-supplements
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/profit-supplements

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email Configuration (for contact form)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@profitsupplements.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod

# Or if using MongoDB service
sudo systemctl start mongod
```

#### Start Backend Server
```bash
npm run dev
# or for production
npm start
```

The API server will be running at `http://localhost:5000`

### 3. Frontend Setup

#### Option A: Simple HTTP Server (Recommended for Development)
```bash
# Navigate to the frontend directory (project root)
cd ..

# Install a simple HTTP server globally
npm install -g http-server

# Start the server
http-server -p 3000 -c-1

# The website will be available at http://localhost:3000
```

#### Option B: Python HTTP Server
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

#### Option C: Live Server (VS Code Extension)
If using VS Code, install the "Live Server" extension and right-click on `index.html` to start.

### 4. Database Setup

The application will automatically create the necessary collections when you start using it. However, you can seed some initial data:

#### Create Admin User (Optional)
Make a POST request to create an admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@profitsupplements.com",
    "password": "admin123"
  }'
```

Then update the user role to admin in MongoDB:
```javascript
// In MongoDB shell
use profit-supplements
db.users.updateOne(
  { email: "admin@profitsupplements.com" },
  { $set: { role: "admin" } }
)
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Product Endpoints
- `GET /api/products` - Get products with filtering/pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Order Endpoints
- `POST /api/orders/create` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Blog Endpoints
- `GET /api/blog` - Get blog posts with filtering
- `GET /api/blog/featured` - Get featured posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:id` - Update blog post (admin only)
- `DELETE /api/blog/:id` - Delete blog post (admin only)

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (admin only)
- `PUT /api/contact/:id/respond` - Respond to contact (admin only)

## Frontend JavaScript Modules

### Core Modules
- `js/api.js` - API client and shopping cart functionality
- `js/auth.js` - Authentication forms and user management
- `js/products.js` - Product display and management
- `js/contact.js` - Contact forms and FAQ

### Usage Examples

#### User Authentication
```javascript
// Login
await api.login({ email: 'user@example.com', password: 'password' });

// Register
await api.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Check if authenticated
if (api.isAuthenticated()) {
  // User is logged in
}
```

#### Product Management
```javascript
// Load products
await productManager.loadProducts();

// Add to cart
cart.addItem(product, quantity);

// Get cart total
const total = cart.getTotal();
```

#### Contact Form
```javascript
// Submit contact form
await api.submitContactForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  subject: 'Product Inquiry',
  message: 'I have a question about your protein powders.',
  category: 'product-inquiry'
});
```

## Configuration

### Backend Configuration
Edit `backend/.env` file for:
- Database connection
- JWT secret
- Email settings
- CORS settings
- File upload limits

### Frontend Configuration
Edit `js/api.js` to change:
- API base URL
- Default settings
- UI preferences

## Security Considerations

### Production Deployment
1. **Environment Variables**: Use secure values for JWT_SECRET and database credentials
2. **HTTPS**: Enable SSL/TLS in production
3. **CORS**: Restrict CORS to your domain only
4. **Rate Limiting**: Configure appropriate rate limits
5. **Input Validation**: All inputs are validated on both client and server
6. **Password Security**: Passwords are hashed with bcrypt

### Email Security
- Use app-specific passwords for Gmail
- Consider using professional email services like SendGrid or Mailgun for production

## Troubleshooting

### Common Issues

#### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

#### Frontend can't connect to API
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in `js/api.js`

#### Email not sending
- Check email credentials in `.env`
- Verify Gmail app password if using Gmail
- Check firewall/network restrictions

#### Database connection issues
- Verify MongoDB is running
- Check MongoDB connection string
- Ensure database user has proper permissions

### Debug Mode
Start backend with debug logging:
```bash
NODE_ENV=development npm run dev
```

### Log Files
Check console output for error messages and API responses.

## Development

### Code Structure
- Use ES6+ features in frontend JavaScript
- Follow RESTful API conventions
- Implement proper error handling
- Use Bootstrap components for UI consistency

### Adding New Features
1. Backend: Add routes in `backend/routes/`
2. Frontend: Add JavaScript in appropriate module
3. Update API documentation
4. Test all functionality

## Deployment

### Backend Deployment (Heroku example)
```bash
# Add Heroku remote
heroku create profit-supplements-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_connection_string

# Deploy
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Netlify example)
```bash
# Build and deploy frontend
npm run build  # if you have a build process
netlify deploy --prod --dir=.
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support, please contact: support@profitsupplements.com