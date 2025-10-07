#!/bin/bash

# -------------------------------
# CONFIG
# -------------------------------
REPO_URL="https://github.com/teshanbandara/mitraai-v2.git"
BRANCH="main"
# -------------------------------

# Go to project folder (assumes script is in project root)
cd "$(dirname "$0")"

echo "Step 1: Remove old Git history if exists..."
rm -rf .git

echo "Step 2: Ensure .env is ignored..."
echo ".env" >> .gitignore

echo "Step 3: Initialize new Git repository..."
git init

echo "Step 4: Add all files except .env..."
git add .

echo "Step 5: Commit files..."
git commit -m "Initial clean commit without .env"

echo "Step 6: Add remote..."
git remote add origin $REPO_URL

echo "Step 7: Rename branch to $BRANCH..."
git branch -M $BRANCH

echo "Step 8: Push to GitHub..."
git push -u origin $BRANCH

echo "✅ Done! Repository pushed cleanly without .env."
