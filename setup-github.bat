@echo off
echo ========================================
echo EduText Hub - GitHub & Vercel Setup
echo ========================================
echo.
echo This script will:
echo 1. Initialize Git
echo 2. Commit all files
echo 3. Push to GitHub
echo.
echo FIRST: Install Git from https://git-scm.com/download/win if not already installed
echo THEN: Create a GitHub account at https://github.com/signup
echo.
pause

echo.
echo Step 1: Checking Git installation...
git --version
if %errorlevel% neq 0 (
  echo.
  echo ERROR: Git is not installed!
  echo Please install from: https://git-scm.com/download/win
  echo Then run this script again.
  pause
  exit /b 1
)

echo.
echo Step 2: Enter your GitHub username:
set /p GITHUB_USER=GitHub Username: 

echo.
echo Step 3: Enter your GitHub email (same as GitHub account):
set /p GITHUB_EMAIL=GitHub Email: 

echo.
echo Configuring Git...
git config --global user.name "%GITHUB_USER%"
git config --global user.email "%GITHUB_EMAIL%"

echo.
echo Step 4: Initializing repository...
git init
git add .
git commit -m "Initial commit: EduText Hub - educational platform with textbooks and exams"
git branch -M main

echo.
echo Step 5: Enter your repository URL from GitHub
echo (Get this from: https://github.com/YOUR_USERNAME/edutext-hub)
echo Format: https://github.com/YOUR_USERNAME/edutext-hub.git
set /p REPO_URL=Repository URL: 

echo.
echo Pushing to GitHub...
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Import your edutext-hub repository
echo 4. Click Deploy
echo.
echo Your app will be live in seconds!
echo.
pause
