# INSY7314 Task 2 – International Payments Portal 

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/nyanem/INSY7314-Task-2/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/nyanem/INSY7314-Task-2/tree/main) 

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=your_project_key&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your_project_key)

This repository contains the **International Banking System** — a full-stack web application built using **React (frontend)**, **Node.js/Express (backend)**, and **MongoDB Atlas (cloud database)**.  

The project implements onboarding and authentication functionalities, ensuring data security and modern web development best practices.

---

##  Project Structure

<pre>
INSY7314-Task-2/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── keys/
│   │   ├── certificate.pem
│   │   └── privatekey.pem
│   ├── server.mjs
│   ├── package.json
│   └── .env (⚠️ not included in repo)
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env (optional)
│
└── README.md
</pre>


---

##  Getting Started

### **1. Prerequisites**

Make sure the following are installed on your system:
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- npm (comes with Node)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for cloud database access)
- Git
- Visual Studio Code (recommended IDE)

---

##  Backend Setup

### **Step 1: Navigate to the backend directory**
cd backend

### **Step 2: Install Dependencies**
npm install

### **Step 3: Create .env file**
Important: The .env file is not pushed to GitHub for security reasons.
You need to create your own .env file in the backend folder with the following content:
PORT=5000
ATLAS_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your secret key> 

### **Step 4: HTTPS Keys**
This project uses self-signed SSL certificates for secure local connections.
backend/keys/privatekey.pem
backen/keys/certificate.pem

### **Step 5: Run the backend**
npm start

If successful you should see: 
[dotenv] injecting env
MongoDB connected
Server running on https://localhost:5000

---

## Frontend Setup

### **Step 1: Navigate to the frontend directory**
cd ../frontend

### **Step 2: Install dependencies**
npm install

### **Step 3: Start the frontend**
npm start
If successful you should see: 
https://localhost:3000

---

##  Connecting Frontend and Backend

The frontend communicates with the backend API through the following endpoints:

| Route                | Method   | Description             |
| -------------------- | -------- | ----------------------- |
| `/api/auth/register` | POST     | Register a new user     |
| `/api/auth/login`    | POST     | Authenticate user login |
| `/api/onboarding`    | GET/POST | Onboarding process      |

##  Database 
The application uses MongoDB Atlas as its cloud database.
Collections include:
Customers – for client registration and onboarding process
Payments – for authentication data

## Youtube Video

https://www.youtube.com/watch?v=amEYyRhcyNA 

## Authors
- Team: PaySmart Group
- Module: INSY7314
- Institution: Varsity College, Cape Town
- Database: MongoDB Atlas
- Frontend: React.js
- Backend: Node.js (Express)
- Version Control: GitHub + CircleCI
  
This readme file was AI generated. 
