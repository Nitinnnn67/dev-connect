# 🚀 Quick Render Deployment Checklist

## Critical: Set These Environment Variables in Render

⚠️ **Make sure NODE_ENV is set to "production" - NOT "development"**

Go to your Render dashboard → Your service → Environment tab → Add these:

### Required Variables

```
NODE_ENV=production
```
☝️ **MOST IMPORTANT** - Must be exactly "production" (not "development")

```
MONGO_DB_ATLAS=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dev-connect
```
Get this from MongoDB Atlas: Clusters → Connect → Connect your application

```
SESSION_SECRET=<click "Generate" button in Render>
```
Or use any random 32+ character string

```
BASE_URL=https://your-app-name.onrender.com
```
Replace with your actual Render URL (you'll get this after first deployment)

### Optional Variables (only if using OAuth)

```
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id  
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

## Common Mistakes to Avoid

❌ Setting `NODE_ENV=development` (should be `production`)
❌ Missing `MONGO_DB_ATLAS` connection string
❌ Weak or missing `SESSION_SECRET`
❌ Wrong `BASE_URL` format (must be https://)

## Verify After Deployment

1. Check logs show: `✓ Environment: production` (NOT development)
2. Visit `/health` endpoint - should return JSON with status "healthy"
3. Try to register/login
4. Check real-time chat works

## If It Still Fails

1. Check Render logs for the exact error
2. Verify all environment variables are set correctly
3. Make sure MongoDB Atlas IP whitelist includes 0.0.0.0/0
4. Test your MongoDB connection string in MongoDB Compass first
