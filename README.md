# Canteen Management System

A modern, full-stack application for managing canteen operations, from food ordering and digital payments to stock and order verification.

## 🚀 Key Features

- **Multi-Role Authentication**: Specific dashboards for Customers, Admins, Chefs, and Scanners.
- **Digital Wallet**: Seamless payments with a built-in wallet system (Refill, Balance tracking, Deductions).
- **Customer Experience**: Beautiful menu browsing, interactive food tray, and personal order history.
- **Admin Control**: Comprehensive dashboard with live statistics, stock management (CRUD), and global order tracking.
- **Chef Workspace**: Dedicated view for preparing and managing incoming orders.
- **Security & Verification**: Order verification via scanning (Scanner role) to ensure accurate delivery.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Premium, modern design)
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **Extensions**: Flask-PyMongo, Flask-CORS
- **Auth**: Password hashing with Werkzeug

## 📁 Project Structure

```text
├── backend/            # Flask API, Database models, and Routes
│   ├── app/            # Core application logic
│   ├── run.py          # Entry point for the backend
│   └── requirements.txt
├── frontend/           # React frontend
│   ├── src/            # Components, Context, Pages, and Assets
│   └── package.json
└── package.json        # Root scripts for concurrent development
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB instance (Local or Atlas)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
*Create a `.env` file in the `backend` folder with your `MONGO_URI`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Running the Application
From the root directory:
```bash
npm start
```
This command uses `concurrently` to start both the Flask server (port 5000) and the Vite development server.

## 📸 Design Aesthetics
The application features a premium, responsive design with:
- Glassmorphism effects
- Smooth micro-animations
- Vibrant, curated color palettes
- Mobile-friendly layouts

---
*Built with ❤️ for efficient canteen operations.*