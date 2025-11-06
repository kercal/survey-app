# 🚀 Deployment Guide: Survey App to Vercel + Neon

This guide will walk you through deploying the survey-app to Vercel with Neon PostgreSQL database.

---

## 📋 Prerequisites

- GitHub account (you already have this - `kercal/survey-app`)
- Email address for signing up to Neon and Vercel
- About 15-20 minutes

---

## Part 1: Set Up Neon PostgreSQL Database

### Step 1.1: Create Neon Account

1. Go to **https://neon.tech**
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - **GitHub** (recommended - fastest)
   - OR Email/Google
4. Complete the sign-up process

### Step 1.2: Create a New Project

1. After signing in, you'll see the Neon dashboard
2. Click **"Create a project"** button (or **"New Project"**)
3. Fill in the project details:
   - **Project name**: `survey-app` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., `US East (Ohio)` or `EU (Frankfurt)`)
   - **PostgreSQL version**: `15` (default is fine)
   - **Database name**: `survey_app` (or leave default)
4. Click **"Create project"**

### Step 1.3: Get Your Connection String

1. After the project is created, you'll see the **Neon dashboard**
2. Look for a section called **"Connection Details"** or **"Connection string"**
3. You'll see something like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
4. **IMPORTANT**: Click the **"Copy"** button next to the connection string
5. **Save this connection string** - you'll need it in Part 2!

   > 💡 **Tip**: The connection string format is:
   > `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
   > 
   > Make sure it includes `?sslmode=require` at the end!

### Step 1.4: Test Your Database (Optional but Recommended)

You can test the connection locally before deploying:

1. Open your terminal
2. Navigate to the survey-app directory:
   ```bash
   cd /Users/kerem/projects/solution-scripts/mini_apps/survey-app
   ```
3. Create a `.env.local` file:
   ```bash
   echo 'DATABASE_URL="your_neon_connection_string_here"' > .env.local
   ```
   (Replace `your_neon_connection_string_here` with the actual string from Step 1.3)
4. Test the connection:
   ```bash
   npx prisma db pull
   ```
   If it works, you'll see: `✔ Introspected 0 models and wrote them into schema.prisma`

---

## Part 2: Deploy to Vercel

### Step 2.1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account
5. Complete the sign-up process

### Step 2.2: Import Your GitHub Repository

1. After signing in, you'll see the Vercel dashboard
2. Click **"Add New..."** button (top right)
3. Select **"Project"** from the dropdown
4. You'll see a list of your GitHub repositories
5. Find **`kercal/survey-app`** and click **"Import"**

### Step 2.3: Configure Project Settings

After clicking "Import", you'll see the **"Configure Project"** page:

#### Project Name
- **Project Name**: `survey-app` (or leave default)
- This will be your app URL: `https://survey-app-xxxxx.vercel.app`

#### Root Directory
- **IMPORTANT**: Click **"Edit"** next to "Root Directory"
- Set it to: `.` (just a dot, meaning root of the repo)
- Since your repo is already just the survey-app, this should be correct

#### Framework Preset
- Vercel should auto-detect **"Next.js"**
- If not, select **"Next.js"** from the dropdown

#### Build and Output Settings
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `.next` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

### Step 2.4: Add Environment Variables

**BEFORE clicking "Deploy"**, you need to add environment variables:

1. Scroll down to the **"Environment Variables"** section
2. Click **"Add"** or the **"+"** button
3. Add the following variables one by one:

   **Variable 1:**
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your Neon connection string from Part 1, Step 1.3
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click **"Save"**

   **Variable 2:**
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: Leave this **empty for now** - we'll update it after deployment
   - **Environment**: Select all three (Production, Preview, Development)
   - Click **"Save"**

   > 💡 **Note**: After deployment, you'll get a URL like `https://survey-app-xxxxx.vercel.app`. 
   > You'll need to come back and update `NEXT_PUBLIC_APP_URL` with that URL.

### Step 2.5: Deploy!

1. Scroll to the bottom of the page
2. Click the big **"Deploy"** button
3. Wait for the deployment to complete (usually 2-3 minutes)
4. You'll see a progress screen with build logs

### Step 2.6: Get Your Deployment URL

1. After deployment completes, you'll see **"Congratulations!"** message
2. Click **"Visit"** or copy the URL (e.g., `https://survey-app-xxxxx.vercel.app`)
3. **Save this URL** - you'll need it in the next steps!

---

## Part 3: Update Environment Variables and Run Migrations

### Step 3.1: Update NEXT_PUBLIC_APP_URL

1. Go back to your Vercel dashboard
2. Click on your **`survey-app`** project
3. Go to **"Settings"** tab (top navigation)
4. Click **"Environment Variables"** in the left sidebar
5. Find `NEXT_PUBLIC_APP_URL` and click **"Edit"** (or the three dots → Edit)
6. Update the value to your deployment URL (e.g., `https://survey-app-xxxxx.vercel.app`)
7. Make sure all environments are selected
8. Click **"Save"**
9. **Redeploy**: Go to **"Deployments"** tab → Click the three dots on the latest deployment → **"Redeploy"**

### Step 3.2: Run Database Migrations

You need to run Prisma migrations to create the database tables. You have two options:

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```
   (This will open a browser window to authenticate)

3. Link your project:
   ```bash
   cd /Users/kerem/projects/solution-scripts/mini_apps/survey-app
   vercel link
   ```
   - Select your account
   - Select the `survey-app` project
   - Confirm the settings

4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```
   This creates a `.env.local` file with your Vercel environment variables.

5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
   You should see:
   ```
   ✔ Applied migration `20251021061252_init`
   ```

6. (Optional) Seed test data:
   ```bash
   npx prisma db seed
   ```
   This will add test tenants, categories, questions, and admin users.

#### Option B: Using Prisma Studio (Alternative)

If you prefer a GUI:

1. Follow steps 1-4 from Option A to set up `.env.local`
2. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. This opens a browser window at `http://localhost:5555`
4. You can manually add data through the UI

---

## Part 4: Verify Deployment

### Step 4.1: Test the App

1. Open your deployment URL: `https://survey-app-xxxxx.vercel.app`
2. You should see a loading screen with "Lütfen Bekleyiniz..." (Please Wait...)
3. This is expected - the app is waiting for PostMessage data from a parent window

### Step 4.2: Test with Parent HTML

1. Update the `test-parent.html` file with your Vercel URL:
   ```html
   <iframe 
       id="surveyFrame"
       src="https://survey-app-xxxxx.vercel.app?app=https://survey-app-xxxxx.vercel.app"
       width="100%"
       height="800px">
   </iframe>
   ```

2. Open `test-parent.html` in your browser
3. Click "Send Data to Iframe"
4. You should see the survey categories page!

### Step 4.3: Test Admin vs User Roles

In `test-parent.html`, you can test both roles:

**Admin User:**
```javascript
personID: "person-admin-456"
```
- Should see "Anket" and "Sonuçlar" tabs
- Can download Excel reports

**Regular User:**
```javascript
personID: "person-user-789"
```
- Should only see survey categories
- No "Sonuçlar" tab

---

## Part 5: Troubleshooting

### Issue: Build Fails with "Prisma Client not generated"

**Solution**: Add a `postinstall` script to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate",
  ...
}
```

### Issue: Database Connection Error

**Check:**
1. Is your `DATABASE_URL` correct in Vercel?
2. Does it include `?sslmode=require`?
3. Is your Neon project active? (Check Neon dashboard)

**Solution**: 
- Verify connection string in Neon dashboard
- Copy it again and update in Vercel
- Redeploy

### Issue: Migrations Not Running

**Solution**: 
- Make sure you ran `npx prisma migrate deploy` locally with the correct `.env.local`
- Check that migrations exist in `prisma/migrations/` folder

### Issue: App Shows "Hata: app parametresi bulunamadı!"

**Solution**: 
- Make sure `NEXT_PUBLIC_APP_URL` is set in Vercel
- Redeploy after updating the environment variable
- Check that the iframe `src` includes `?app=YOUR_VERCEL_URL`

### Issue: PostMessage Not Working

**Solution**:
- Check browser console for errors
- Verify the `app` query parameter matches your Vercel URL
- Make sure parent window sends data in correct format:
  ```javascript
  {
    tenantID: "tenant-test-123",
    personID: "person-admin-456",
    personName: "Test User"
  }
  ```

---

## Part 6: Next Steps

### Add Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Set Up Production Database (Optional)

For production, consider:
- Creating a separate Neon project for production
- Using different environment variables for production vs preview

### Monitor Your App

- **Vercel Analytics**: Enable in project settings
- **Logs**: View in Vercel dashboard → **Deployments** → Click on a deployment → **Functions** tab

---

## ✅ Checklist

Before your demo, make sure:

- [ ] Neon database is created and connection string is saved
- [ ] Vercel project is deployed successfully
- [ ] `DATABASE_URL` environment variable is set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` is set to your Vercel URL
- [ ] Database migrations are run (`npx prisma migrate deploy`)
- [ ] Test data is seeded (optional, but recommended for demo)
- [ ] App loads correctly in browser
- [ ] PostMessage communication works
- [ ] Admin and user roles work correctly
- [ ] Excel export works for admin users

---

## 🎉 You're Done!

Your survey app is now live at: `https://survey-app-xxxxx.vercel.app`

Share this URL with your manager for the demo!

---

## 📞 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs (Deployments → Click deployment → View logs)
2. Check Neon database status (Neon dashboard)
3. Review this guide's troubleshooting section
4. Check browser console for errors

Good luck with your demo! 🚀

