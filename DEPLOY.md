# Deploy EduText Hub to GitHub & Hosting

## Step 1: Initialize Git & Push to GitHub

### Prerequisites
- Install Git: https://git-scm.com/download/win
- Create GitHub account: https://github.com/signup

### Commands (copy-paste into PowerShell)

1. **Navigate to your project folder:**
   ```powershell
   cd "c:\Users\user\Desktop\ifechi work folder\personal work\ongoing"
   ```

2. **Initialize Git:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: EduText Hub - educational platform with textbooks and exams"
   git branch -M main
   ```

3. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it: `edutext-hub`
   - Click "Create repository"
   - Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/edutext-hub.git`)

4. **Push to GitHub** (replace URL with yours):
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/edutext-hub.git
   git push -u origin main
   ```

---

## Step 2: Deploy to Hosting

Choose ONE of these platforms:

### Option A: Render (Recommended)

1. **Go to** https://render.com and sign up with GitHub
2. **Create a new Web Service:**
   - Connect your GitHub repo
   - Select `edutext-hub`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Add `PORT` (Render sets it automatically)
3. **Deploy!** Render will give you a live URL like `https://edutext-hub.onrender.com`

### Option B: Railway

1. **Go to** https://railway.app and sign in with GitHub
2. **Create new project → Deploy from GitHub**
3. **Select your `edutext-hub` repo**
4. **Set environment variables:**
   - Add `PORT=3000` (Railway auto-assigns)
5. **Deploy!** You get a live URL

### Option C: Heroku (older, but still works)

1. **Go to** https://www.heroku.com and create account
2. **Install Heroku CLI** from https://devcenter.heroku.com/articles/heroku-cli
3. **Run in PowerShell:**
   ```powershell
   heroku login
   heroku create edutext-hub
   git push heroku main
   heroku open
   ```

---

## Step 3: Update Homepage (Optional)

Once hosted, your live URL will be visible. You can update the homepage to show the live server address instead of `localhost:3000`.

---

## Need Help?

- **Git issues?** Run: `git status` to check your repo status
- **Node modules not installed?** Run: `npm install` in your project folder
- **Port conflicts?** Change port in `.env` file

Good luck! 🚀
