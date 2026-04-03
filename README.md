# 🎬 Cine-Hall - Premium Movie Booking System

Cine-Hall is a state-of-the-art web application designed for modern cinema theaters. It provides a seamless experience for both administrators to manage screenings and users to book their favorite movies with a premium interactive interface.

## ✨ Key Features

### 🍿 For Users
- **Dynamic Movie Catalog**: Browse the latest films with rich visuals and detailed descriptions.
- **Interactive Seat Selection**: A 3D-inspired, responsive seat picker with real-time availability.
- **Smart Session Grouping**: Easily find screenings by date and time with an intuitive tabbed interface.
- **Stripe Integrated Payments**: Secure checkout flow for instant seat reservation.
- **Digital Tickets**: Access your booking history with stylized "E-Pass" tickets, including QR codes.
- **PDF Downloads**: Generate and download official PDF tickets for offline use.

### 🛡️ For Administrators
- **Comprehensive Dashboard**: Manage the entire theater ecosystem from one central hub.
- **Movie Management**: Full CRUD operations for films, including poster uploads and metadata.
- **Room/Salle Configuration**: Define custom layouts with rows and seat counts.
- **Session Scheduling**: Precise control over screening times, languages, and pricing (Normal/VIP).

## 🚀 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Material UI Icons.
- **Animations**: Framer Motion & Custom CSS Keyframes.
- **State Management**: React Hooks (useState, useEffect, useParams).
- **Backend**: Laravel API (PHP).
- **Payments**: Stripe API.
- **Feedback**: React Hot Toast for real-time notifications.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend Laravel Server running on `http://localhost:8000`

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your API base URL:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📸 Design Philosophy
The UI follows a "Premium Dark" aesthetic, using a deep neutral palette with vibrant yellow-400 highlights to evoke the classic cinema feeling. Every interaction is enhanced with subtle micro-animations and smooth transitions to ensure a high-end user experience.

---
*Created with ❤️ by Imad Elmasoudy*
