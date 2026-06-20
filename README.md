# EduText Hub

This project is an educational website with textbooks, exam practice, user registration, login, and activity tracking.

## Files
- `ongoing.html` - main website page
- `ongoing.css` - styling for the site
- `ongoing.js` - frontend logic for navigation, login, and fetching content
- `server.js` - Node.js backend to handle registration, login, textbooks, exams, and activity storage
- `package.json` - Node dependency definition
- `data/users.json` - stored user accounts
- `data/activities.json` - stored user activities

## Setup
1. Install Node.js (https://nodejs.org/) if not already installed.
2. Open a terminal in this folder.
3. Run:
   ```bash
   npm install
   npm start
   ```
4. Open your browser to `http://localhost:3000`.

## Features
- Multi-level learning sections: Primary, Secondary, Tertiary, Polytechnic
- Textbook browsing and exam practice
- User registration and login
- Backend storage of user accounts and activities
- Simple exam quiz experience with score feedback
- Persistent cart storage and simulated checkout with purchase records
- Logged-in order history page for completed purchases
- Add new textbooks through the Books page submission form
