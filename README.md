# VESatikaa Collections

A premium luxury fashion boutique e-commerce web application.

## Features

- **Modern User Interface:** Beautiful, responsive UI built with React and Tailwind CSS.
- **AI Virtual Try-On:** Integrated with the IDM-VTON API, allowing users to upload a photo and virtually try on clothing items.
- **User Authentication:** Secure user registration, login, and profile management using JSON Web Tokens (JWT).
- **Admin Dashboard:** Comprehensive dashboard for administrators to manage products, view orders, and manage users.
- **Shopping Cart:** Full-featured shopping cart allowing users to add/remove items and adjust quantities.
- **Secure Payments:** Integrated with Razorpay for secure checkout processing.
- **Automated Emails:** Built-in Nodemailer integration for automated inquiry responses and notifications.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop devices.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Razorpay
- **Email:** Nodemailer

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up your environment variables. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_google_app_password
   ```

### Running the Application

You can run the backend and frontend servers simultaneously using the development scripts.

**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License.
