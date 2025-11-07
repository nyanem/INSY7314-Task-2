# INSY7314 Task 2 – International Payments Portal 

**What it does:** Shows whether your code builds successfully
**Purpose:** Runs automated tests and checks every time you push code
**Status indicators:**
Green "passing" = All tests pass, code is stable
Red "failing" = Tests failed, needs fixing
**Benefit:** Ensures code quality and catches bugs early
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/nyanem/INSY7314-Task-2/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/nyanem/INSY7314-Task-2/tree/main) 

**What it does:** Analyzes code quality and security
**Checks for:**
Bugs and defects
Security vulnerabilities
Code smells (maintainability issues)
Technical debt
Security hotspots
**Status indicators:**
"Passed" = Code meets quality standards
"Failed" = Quality issues need attention
**Benefit:** Maintains high code quality and security throughout development
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nyanem_INSY7314-Task-2&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=nyanem_INSY7314-Task-2)


This repository contains the **International Banking System** — a secure, full-stack web application for international payment processing. Built using **React (frontend)**, **Node.js/Express (backend)**, and **MongoDB Atlas (cloud database)**, the system implements robust authentication, payment processing, and employee verification functionalities with enterprise-grade security measures.

---

## Demo Video

Watch the full walkthrough: 

---

## How to Run the Website

### **Prerequisites**

Ensure you have the following installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git**
- **Visual Studio Code**

### **Step 1: Clone the Repository**
```bash
git clone SIT IN GITHUB LINK: https://github.com/nyanem/INSY7314-Task-2.git
cd INSY7314-Task-2
```

### **Step 2: Backend Setup**

#### Navigate to backend directory:
```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

#### Create `.env` file:
Create a `.env` file in the `backend` folder with:
```env
PORT=5000
ATLAS_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_ORIGIN=https://localhost:3000
SEED_EMPLOYEES=true
```

#### Generate HTTPS certificates:
The project requires SSL certificates for HTTPS. Place them in `backend/keys/`:
- `privatekey.pem`
- `certificate.pem`

#### Start the backend server:
```bash
npm start
```

 **Success output:**
```
MongoDB connected
Employee seeding completed.
Secure server running on https://localhost:5000
```

### **Step 3: Frontend Setup**

#### Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the frontend:
```bash
npm start
```

 **Success:** Browser opens at `https://localhost:3000`

---

## Login Details

### **Customer Account**
To test the customer portal, register a new account through the registration page:
- Navigate to `https://localhost:3000/register`
- Fill in your details (full name, ID number, account number, password)
- After registration, login with your credentials

### **Employee Account** (Pre-seeded)
For employee portal access (payment verification):

| Field    | Value                           |
|----------|---------------------------------|
| Email    | `samantha.jones@paysmart.com`   |
| Password | `SamanthaJones!23`              |

**Note:** Employee accounts are automatically seeded when `SEED_EMPLOYEES=true` in your `.env` file.

---

## Main Features

### **1. Customer Portal**
- **User Registration & Authentication**
  - Secure account creation with encrypted data storage
  - Argon2 password hashing
  - JWT-based authentication with HTTP-only cookies
  
- **Dashboard**
  - View account balance and debit card details
  - Recent payment history (last 3 transactions)
  - Quick access to payment features

- **International Payment Processing**
  - Multi-step payment form with validation
  - Support for VISA and Mastercard
  - Multiple currency support (ZAR, USD, EUR, GBP, JPY)
  - SWIFT code verification
  - Real-time payment preview and confirmation
  - Session timeout protection (5 minutes)

- **Payment History & Tracking**
  - View all past transactions
  - Payment status tracking (Pending, Accepted, Rejected)
  - Detailed payment information with masked sensitive data

### **2. Employee Portal**
- **Secure Employee Authentication**
  - Role-based access control
  - Separate authentication system from customers
  
- **Payment Verification Dashboard**
  - View pending payments requiring verification
  - Approve or reject customer payments
  - Track processed payments history
  - Real-time payment status updates

### **3. Security Features**
- HTTPS/TLS 1.3 encryption
- Helmet.js security headers
- CORS protection
- Rate limiting (DDoS prevention)
- MongoDB injection prevention
- XSS attack protection
- HTTP Parameter Pollution (HPP) prevention
- Data encryption at rest
- Secure cookie handling
- Input validation and sanitization

---

## Technologies & Methods

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| React Router | 6.30.1 | Client-side routing |
| Axios | 1.12.2 | HTTP client for API requests |
| Stripe.js | 8.1.0 | Payment processing integration |
| React Testing Library | 16.3.0 | Component testing |
| Jest | 30.0.0 | JavaScript testing framework |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | 4.18.2 | Web framework |
| MongoDB Atlas | - | Cloud database |
| Mongoose | 8.19.0 | MongoDB ODM |
| Argon2 | 0.44.0 | Password hashing |
| bcrypt | 6.0.0 | Secondary encryption |
| JWT | 9.0.2 | Token-based authentication |
| Helmet | 8.1.0 | Security headers |
| Express Rate Limit | 8.1.0 | DDoS protection |
| Zod | 4.1.12 | Schema validation |
| Stripe | 19.1.0 | Payment gateway |
| UUID | 13.0.0 | Unique ID generation |
| Morgan | 1.10.1 | HTTP request logger |

### **Security Middleware**
- `express-mongo-sanitize` - NoSQL injection prevention
- `xss-clean` - XSS attack prevention
- `hpp` - HTTP Parameter Pollution prevention
- `cookie-parser` - Secure cookie handling
- `cors` - Cross-Origin Resource Sharing control

### **Development Tools**
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code quality and consistency
- **CircleCI** - Continuous integration
- **SonarCloud** - Code quality analysis

### **Programming Languages**
- **JavaScript (ES6+)** - Full-stack development
- **JSX** - React component markup
- **CSS3** - Styling and animations

### **Key Methods & Patterns**
- **RESTful API** architecture
- **MVC** (Model-View-Controller) pattern
- **JWT Authentication** with refresh tokens
- **Encryption at rest** (AES-256)
- **TLS 1.3** for data in transit
- **Middleware** pattern for request processing
- **Schema validation** (Zod, Express Validator)
- **Error handling** with custom middleware
- **Component-based** UI architecture
- **State management** with React hooks

---

## Project Structure

```
INSY7314-Task-2/
│
├── backend/
│   ├── controllers/         # Business logic handlers
│   │   ├── authController.mjs
│   │   ├── employeeController.mjs
│   │   ├── onboardingController.mjs
│   │   └── paymentController.mjs
│   ├── middleware/          # Express middleware
│   │   ├── employeeAuth.mjs
│   │   └── secure.mjs
│   ├── models/              # MongoDB schemas
│   │   ├── Customer.mjs
│   │   ├── Employee.mjs
│   │   └── Payment.mjs
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.mjs
│   │   ├── employeeRoutes.mjs
│   │   ├── onboardingRoutes.mjs
│   │   └── paymentRoutes.mjs
│   ├── utils/               # Helper functions
│   │   ├── encryption.mjs
│   │   ├── maskPan.mjs
│   │   ├── sanitize.mjs
│   │   └── seedEmployees.mjs
│   ├── validation/          # Input validation schemas
│   │   └── paymentSchema.mjs
│   ├── keys/                # SSL certificates
│   │   ├── certificate.pem
│   │   └── privatekey.pem
│   ├── server.mjs           # Express server entry point
│   ├── package.json
│   └── .env                 # ⚠️ Not in repo
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── AboutUs.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Index.js
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── PaymentForm.js
│   │   │   ├── PaymentHistory.js
│   │   │   ├── Register.js
│   │   │   ├── timer.js
│   │   │   └── TrackPayments.js
│   │   ├── assets/          # Images and static files
│   │   ├── data/
│   │   │   └── payment.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── package.json
└── README.md
```

---

## API Endpoints

### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new customer | No |
| POST | `/login` | Customer login | No |
| POST | `/login/employee` | Employee login | No |
| GET | `/me` | Get current user info | Yes (Customer) |

### **Payment Routes** (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/createPayment` | Create new payment | Yes (Customer) |
| GET | `/` | Get all payments | Yes (Customer) |
| GET | `/myPayments` | Get user's payments | Yes (Customer) |
| GET | `/:id` | Get payment by ID | Yes (Customer) |

### **Employee Routes** (`/api/employees`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/pendingPayments` | Get payments awaiting verification | Yes (Employee) |
| POST | `/verifyPayment` | Approve/reject payment | Yes (Employee) |
| GET | `/processedPayments` | Get verified payments | Yes (Employee) |

### **Onboarding Routes** (`/api/onboarding`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/start` | Get started page | No |
| GET | `/features` | View features | No |
| GET | `/contact` | Contact information | No |

---

## Security Features

### **Data Protection**
- **Encryption at Rest:** AES-256 encryption for sensitive data
- **Encryption in Transit:** TLS 1.3 HTTPS only
- **Password Hashing:** Argon2 algorithm (memory-hard)
- **Data Masking:** PAN masking for card numbers and SWIFT codes

### **Authentication & Authorization**
- JWT tokens with HTTP-only cookies
- Role-based access control (Customer/Employee)
- Session management with automatic timeout
- Secure token generation and validation

### **Attack Prevention**
- **Rate Limiting:** 50 requests/15min for auth, 200 requests/15min for API
- **XSS Protection:** Input sanitization and content security policy
- **CSRF Protection:** SameSite cookies and origin validation
- **NoSQL Injection:** MongoDB query sanitization
- **DDoS Protection:** Express rate limiting
- **HPP Protection:** Parameter pollution prevention

### **HTTP Security Headers**
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- Referrer-Policy

---


---
