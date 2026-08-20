# 📚 Smart Study Planner

### AI-Powered Academic Planning & Productivity Platform

<p align="center">

<a href="https://smart-study-planner-jx84-bay.vercel.app/">
<img src="https://img.shields.io/badge/🚀_Live_Demo-Smart_Study_Planner-7C3AED?style=for-the-badge" alt="Live Demo"/>
</a>

<a href="https://github.com/Ayush-Gupta1243/smart-study-planner">
<img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub"/>
</a>

</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square\&logo=vite\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square\&logo=express\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square\&logo=tailwindcss\&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square\&logo=clerk\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square\&logo=javascript\&logoColor=black)

</p>

---

## 🚀 Live Demo

### 👉 [Open Smart Study Planner](https://smart-study-planner-jx84-bay.vercel.app/)

> Generate a personalized study plan based on your subjects, available study hours, difficulty levels, and examination dates.

---

## 🌟 Overview

**Smart Study Planner** is a modern academic productivity platform designed to help students organize their preparation intelligently.

Instead of manually creating complicated timetables, students can provide their subject information, available study time, difficulty levels, and examination dates. The application then generates a structured, prioritized study schedule.

The platform combines **intelligent scheduling, analytics, visualization, authentication, file processing, and export functionality** into a single student-focused application.

### 🎯 Core Idea

> **Give your subjects. Set your available time. Let Smart Study Planner organize the preparation.**

---

# ✨ Features

## 🧠 Intelligent Study Planning

Automatically generates a personalized day-by-day study schedule based on:

* 📚 Subject workload
* ⏱️ Daily available study hours
* 🧠 Subject difficulty
* 📅 Examination dates
* 🎯 Required preparation hours
* ⚡ Exam urgency

The scheduling engine prioritizes subjects according to difficulty and how close their examination dates are.

---

## 📊 Smart Dashboard

A centralized dashboard provides an overview of the generated preparation plan.

It displays:

* Total subjects
* Study workload
* Planned sessions
* Preparation statistics
* Upcoming exams
* Schedule warnings

---

## 📅 Day-by-Day Study Plan

The generated plan can be viewed chronologically.

Example:

```text
20 August
├── Mathematics      2h
└── Computer Science 2h

21 August
├── Physics          2h
└── Mathematics      2h

22 August
├── Computer Science 2h
└── Chemistry        2h
```

---

## 📈 Visual Analytics

Interactive analytics help students understand their preparation.

The application provides visual insights into:

* Subject workload
* Study-hour distribution
* Difficulty levels
* Schedule allocation
* Overall preparation structure

---

## 📂 Subject File Upload

Students can upload a `.txt` file containing their subjects instead of entering them manually.

### Format

```text
Subject Name, Total Hours, Difficulty, Exam Date
```

### Example

```text
Mathematics, 20, Hard, 2026-09-10
Physics, 15, Medium, 2026-09-15
Chemistry, 10, Easy, 2026-09-20
Computer Science, 18, Hard, 2026-09-12
```

The backend validates and parses the uploaded file before generating the study plan.

---

## ⚠️ Schedule Warnings

The planner detects subjects that may not receive enough preparation time before their examination.

For example:

```text
⚠️ Mathematics may not complete before exam on 2026-09-10
```

This helps students identify potential preparation gaps early.

---

## 📤 Export Study Plans

Generated schedules can be exported for offline use.

Supported formats include:

* 📄 PDF
* 📊 CSV

Useful for:

* Printing
* Sharing
* Offline study
* Personal records

---

## 🔐 Authentication

The application uses **Clerk** for authentication.

Authentication provides:

* Secure sign-in
* Sign-up
* User sessions
* Protected application access
* User account management

Unauthenticated users are presented with the authentication screen before accessing the study planner.

---

## 🌙 Modern UI

The application features a modern student-focused interface with:

* Dark futuristic design
* Responsive layout
* Smooth animations
* Interactive cards
* Data visualization
* Toast notifications
* Theme support
* Mobile-friendly interface

---

# 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │       Student         │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │     Clerk Auth        │
                         │   Sign In / Sign Up   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────┐
                  │         React Frontend            │
                  │             + Vite                │
                  ├──────────────────────────────────┤
                  │ • Dashboard                       │
                  │ • Study Plan                      │
                  │ • Analytics                        │
                  │ • File Upload                      │
                  │ • Export                           │
                  │ • Theme Management                 │
                  └───────────────┬──────────────────┘
                                  │
                              REST API
                                  │
                                  ▼
                  ┌──────────────────────────────────┐
                  │         Express Backend           │
                  ├──────────────────────────────────┤
                  │ • File Processing                  │
                  │ • Subject Parsing                  │
                  │ • Priority Calculation             │
                  │ • Schedule Generation              │
                  │ • Validation                       │
                  └───────────────┬──────────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  Personalized Plan   │
                       │ + Analytics + Alerts  │
                       └──────────────────────┘
```

---

# ⚙️ Scheduling Algorithm

The planner uses two major factors for calculating subject priority.

### Difficulty Weight

| Difficulty | Weight |
| ---------- | -----: |
| Easy       |      1 |
| Medium     |      2 |
| Hard       |      3 |

### Priority Calculation

The scheduler combines difficulty and exam urgency:

```text
Priority = (Difficulty × 0.6) + (Urgency × 0.4)
```

Higher-priority subjects receive study time first.

The scheduler also considers:

* Remaining study hours
* Daily study limit
* Session duration
* Examination dates
* Available preparation days

---

# 🛠️ Technology Stack

## Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| React 19        | UI development      |
| Vite            | Build & development |
| Tailwind CSS    | Styling             |
| Framer Motion   | Animations          |
| Recharts        | Analytics & charts  |
| Lucide React    | Icons               |
| React Hot Toast | Notifications       |
| jsPDF           | PDF generation      |
| jsPDF AutoTable | PDF tables          |
| PapaParse       | CSV processing      |

The frontend package includes React, Vite, Tailwind CSS, Framer Motion, Recharts, jsPDF, PapaParse and related UI libraries.

## Backend

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express.js | REST API              |
| Multer     | File upload           |
| CORS       | API communication     |
| dotenv     | Environment variables |

The Express backend provides health, upload, sample-data and study-plan generation endpoints.

## Authentication

| Technology | Purpose                          |
| ---------- | -------------------------------- |
| Clerk      | Authentication & user management |

---

# 📂 Project Structure

```text
smart-study-planner/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   └── Analytics.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ExportBar.jsx
│   │   │       ├── Hero.jsx
│   │   │       ├── StatCard.jsx
│   │   │       ├── StudyPlanView.jsx
│   │   │       └── UploadPanel.jsx
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── exportUtils.js
│   │   │   └── scheduler.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── sample_subjects.txt
├── vercel.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js 18+
* npm
* Git

Check installation:

```bash
node --version
npm --version
git --version
```

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Ayush-Gupta1243/smart-study-planner.git
```

```bash
cd smart-study-planner
```

---

## 2️⃣ Install Frontend

```bash
cd frontend
npm install
```

---

## 3️⃣ Configure Clerk

Create:

```text
frontend/.env.local
```

Add your Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

> Never expose your Clerk Secret Key in frontend code or commit it to GitHub.

---

## 4️⃣ Install Backend

Open another terminal:

```bash
cd backend
npm install
```

---

# ▶️ Run Locally

## Start Backend

```bash
cd backend
npm start
```

Backend:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔌 API Reference

## Health Check

```http
GET /api/health
```

Returns:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

## Upload Subject File

```http
POST /api/upload
```

Accepts a `.txt` subject file.

Maximum file size:

```text
5 MB
```

---

## Generate Study Plan

```http
POST /api/generate
```

Example:

```json
{
  "subjects": [
    {
      "name": "Mathematics",
      "totalHours": 20,
      "difficulty": "Hard",
      "examDate": "2026-09-10"
    }
  ],
  "config": {
    "startDate": "2026-08-20",
    "dailyHours": 4,
    "sessionLength": 2
  }
}
```

---

## Sample Dataset

```http
GET /api/sample
```

Returns sample subject data for testing.

---

# 🧪 Example Workflow

```text
                 START
                   │
                   ▼
            🔐 Sign In / Sign Up
                   │
                   ▼
            📂 Add Subject Data
                   │
                   ▼
            ⚙️ Set Preferences
                   │
                   ▼
          🧠 Generate Study Plan
                   │
                   ▼
             📊 Dashboard
              /          \
             /            \
            ▼              ▼
      📅 Study Plan    📈 Analytics
            │              │
            └──────┬───────┘
                   ▼
              📤 Export
                   │
                   ▼
                  END
```

---

# 📊 Example Input

```text
Mathematics,20,Hard,2026-09-10
Physics,15,Medium,2026-09-15
Chemistry,10,Easy,2026-09-20
Computer Science,18,Hard,2026-09-12
English,8,Easy,2026-09-25
```

The scheduler processes this information and distributes available study hours across the preparation period.

---

# ☁️ Deployment

The project is deployed and available online:

### 🌐 Production

**[🚀 Launch Smart Study Planner](https://smart-study-planner-jx84-bay.vercel.app/)**

Deployment architecture:

```text
GitHub
   │
   ▼
Vercel
   │
   ├── React + Vite Frontend
   │
   └── Express Backend
          │
          ▼
       REST APIs
```

---

# 🔮 Roadmap

The project can evolve into a complete academic productivity ecosystem.

### Authentication & Accounts

* [x] Clerk authentication
* [ ] Persistent user profiles
* [ ] Cloud-saved study plans
* [ ] User preferences

### Productivity

* [ ] Task completion tracking
* [ ] Daily study reminders
* [ ] Study streaks
* [ ] Exam countdown
* [ ] Calendar integration

### Intelligence

* [ ] AI study recommendations
* [ ] Adaptive schedule regeneration
* [ ] Automatic workload balancing
* [ ] Personalized learning insights

### Platform

* [ ] PWA support
* [ ] Mobile application
* [ ] Cloud synchronization
* [ ] Offline mode
* [ ] Notification system

---

# 🤝 Contributing

Contributions are welcome!

### Fork the repository

```bash
git clone https://github.com/Ayush-Gupta1243/smart-study-planner.git
```

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Make changes

Test everything locally.

### Commit

```bash
git add .
git commit -m "Add: your feature"
```

### Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Bug Reports

Found an issue?

Please open a GitHub issue with:

```text
Problem:
Expected behaviour:
Actual behaviour:
Steps to reproduce:
Screenshots:
Environment:
```

---

# 🎯 Project Vision

Students often know **what** they need to study but struggle with **when**, **how much**, and **what to prioritize**.

Smart Study Planner aims to solve this by converting academic workload into an actionable preparation strategy.

### The vision:

> **Less time planning. More time learning.**

---

# 👨‍💻 Author

## Ayush Gupta

**B.Tech Computer Science & Engineering**

GitHub:
https://github.com/Ayush-Gupta1243

Project:
https://github.com/Ayush-Gupta1243/smart-study-planner

Live Application:
https://smart-study-planner-jx84-bay.vercel.app/

---

# 📄 License

This project is currently developed as an educational, academic and portfolio project.

License terms can be updated as the project evolves.

---

<div align="center">

## 📚 Smart Study Planner

### Plan Smarter • Study Better • Achieve More

**Built with React, Vite, Express & Clerk**

⭐ If you find this project useful, consider giving it a star!

</div>
