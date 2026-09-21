# 💊 MediSure — Smart Medicine Verification System

> **Verify Before You Trust.**

MediSure is a smart, mobile-friendly medicine verification platform designed to help users check the authenticity of medicines before purchasing or consuming them.

The system allows users to verify medicines using a **QR code / GTIN (Global Trade Item Number)** and provides an easy-to-understand verification result.

---

## 🚨 Problem Statement

Counterfeit and suspicious medicines can create serious risks for consumers. In many cases, customers do not have an easy way to verify whether a medicine is registered in a trusted database.

MediSure provides a simple digital verification system that connects medicine identification with a centralized database.

---

## 💡 Our Solution

MediSure allows a user to:

* 📷 Scan a medicine QR code
* 🔎 Search using a GTIN
* 💊 View registered medicine information
* ✅ Identify verified medicines
* ⚠️ Detect medicines that require manual verification
* 🚨 Flag medicines that are suspicious or not found
* 📱 Use the platform comfortably on mobile devices

---

## ✨ Key Features

### 👤 User Side

* Medicine verification through GTIN
* QR-code based medicine identification
* Medicine information display
* Clear verification status
* Manufacturer and medicine details
* Safety tips
* How-it-works section
* Responsive mobile-friendly interface

### 🛠️ Admin Panel

Administrators can manage the medicine database through:

* Add new medicines manually
* Scan medicine and fill GTIN
* Store medicine information
* Manage manufacturer details
* Manage strength and dosage form
* Manage net quantity
* View registered medicine records
* Maintain medicine database timestamps

---

## 🔍 Verification Status

MediSure provides simple verification results:

| Status                        | Meaning                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| 🟢 **Genuine**                | Medicine exists in the registered database                    |
| 🟡 **Needs Manual Check**     | Information requires additional verification                  |
| 🔴 **Suspicious / Not Found** | Medicine could not be verified through the available database |

> The system is intended as a digital verification aid and does not replace professional medical or regulatory verification.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   MediSure UI    │
                    │ HTML/CSS/JS       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Express API    │
                    │   Node.js        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    MongoDB       │
                    │ Medicine Database│
                    └──────────────────┘
                             ▲
                             │
                    ┌────────┴─────────┐
                    │   Admin Panel    │
                    └──────────────────┘
```

---

## 🧰 Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Design

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB

### Development Tools

* Visual Studio Code
* Git & GitHub
* MongoDB
* Render

---

## 📁 Project Structure

```text
MediSure/
│
├── admin/
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
│
├── assets/
│   ├── logo.png
│   └── hero-medicine.png
│
├── server/
│   └── server.js
│
├── index.html
├── style.css
├── mobile.css
├── script.js
│
├── package.json
├── package-lock.json
└── README.md
```

> File names may vary depending on the current version of the project.

---

## ⚙️ How It Works

### Step 1 — Identify Medicine

The user scans the medicine QR code or enters its GTIN.

### Step 2 — Send Verification Request

The frontend sends the medicine identifier to the backend API.

### Step 3 — Database Lookup

The backend searches the medicine database stored in MongoDB.

### Step 4 — Verify

The system compares the submitted identifier with registered medicine records.

### Step 5 — Display Result

The user receives a clear verification status along with available medicine information.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd MediSure
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

> Never upload your real `.env` file or database credentials to GitHub.

### 4. Start the Backend

```bash
node server.js
```

Or, if your project has a development script:

```bash
npm run dev
```

### 5. Open the Frontend

Open `index.html` in your browser or use a local development server such as VS Code Live Server.

---

## 🔐 Environment Variables

The project uses environment variables for sensitive configuration.

Example:

```env
MONGODB_URI=your_mongodb_uri
PORT=5000
```

For security:

```text
.env
```

should be included in `.gitignore`.

---

## 🗄️ Medicine Database

The medicine database stores information such as:

* GTIN
* Medicine Name
* Manufacturer
* Strength
* Dosage Form
* Net Quantity
* Created At
* Updated At

The database can be populated and managed through the admin panel.

---

## 🎯 Project Scope

The current version of MediSure focuses on:

* QR/GTIN-based medicine verification
* A centralized medicine database
* Admin-controlled medicine records
* Responsive user interface
* Backend API integration
* Basic medicine authenticity classification

The project currently uses its **own medicine database** rather than relying on an external medicine-verification API.

---

## 🔮 Future Enhancements

Possible future improvements include:

* 📦 Batch number verification
* 🔐 Secure authentication for administrators
* 🏭 Manufacturer verification
* 📍 Location-based reporting of suspicious medicines
* 📊 Admin analytics dashboard
* 🔗 Integration with verified pharmaceutical databases
* 🤖 AI-assisted counterfeit detection
* 📱 Dedicated Android/iOS application
* 🔔 Alerts for reported suspicious medicines
* 🧾 Medicine purchase verification history

---

## 🏆 Project Purpose

MediSure was developed as an academic/hackathon project to explore how technology can make medicine verification easier and more accessible to users.

> **Verify Before You Trust.**

---

## ⚠️ Disclaimer

MediSure is a prototype/project developed for educational and demonstration purposes.

The verification result is based on the information available in the MediSure database. It should not be considered a replacement for official pharmaceutical, regulatory, medical, or professional verification.

---

## 📄 License

This project is created for educational and project-development purposes.

---

### ⭐ If you find this project useful, consider giving the repository a star!
