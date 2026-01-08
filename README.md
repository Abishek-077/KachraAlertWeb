# KachraAlert Web ♻️🚨
A modern smart waste-management web application that helps citizens report waste issues and helps admins broadcast alerts, manage schedules, and track community reports.

---

## ✨ Overview
KachraAlert Web is built to streamline waste reporting and public announcements. Citizens can submit waste reports and follow updates, while admins can create broadcasts/announcements and manage operations through a clean dashboard.

---
## ✅ Key Features

### Citizen (User)
- 🔐 Authentication (Login / Signup)
- 🗑️ Create waste reports (category, location, message, optional media if supported)
- 📌 View report status (e.g., pending / in_progress / resolved)
- 🔔 Receive announcements / alerts
- ⚙️ Settings (theme, onboarding reset if enabled)

  ### Admin
- 📢 Create & manage announcements (broadcasts)
- 🗓️ Manage schedules (pickup schedules / notices)
- 📊 Dashboard overview (reports + announcements + trends)
- 🛡️ Role-based access control (admin-only routes)

---

## 🧱 Tech Stack (Recommended / Typical Setup)
**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod (validation)
- Axios / Fetch API


**Backend**
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- JWT Auth (Access/Refresh depending on setup)
- Clean Architecture structure

**Database**
- MongoDB Atlas / Local MongoDB

---

## 🗂️ Repository Structure

This repo typically uses a **two-folder setup**:
