# Deploying DevConnect to Render

This guide will walk you through deploying your DevConnect app to Render.

## Prerequisites

1. **MongoDB Atlas Database**
   - Create a free account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Whitelist all IPs (0.0.0.0/0) in Network Access

2. **GitHub Repository**
   - Push your code to GitHub
   - Make sure `.env` is in `.gitignore` (already done)

3. **Render Account**
   - Sign up at https://render.com (free)
   - You can sign in with your GitHub account

## Step-by-Step Deployment

### 1. Connect GitHub to Render

1. Log in to your Render dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your `dev-connect` repository

### 2. Configure Your Web Service

Fill in the following settings:

- **Name**: `dev-connect` (or your preferred name)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 3. Add Environment Variables

Click **"Advanced"** and add these environment variables:

**Required Variables:**

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Sets production mode |
| `MONGO_DB_ATLAS` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | Click "Generate" | Or use a random 32+ character string |
| `BASE_URL` | `https://your-app-name.onrender.com` | Your Render URL (update after deployment) |

**Optional OAuth Variables (if using):**

| Key | Value | Notes |
|-----|-------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID | Leave empty if not using |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Secret | Leave empty if not using |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Leave empty if not using |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret | Leave empty if not using |

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your application
3. Wait for deployment to complete (2-5 minutes)

### 5. Get Your App URL

After deployment:
- Your app will be at: `https://your-app-name.onrender.com`
- Update the `BASE_URL` environment variable with this URL
- Your app will auto-redeploy

### 6. Configure OAuth Callbacks (If Using)

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Edit your OAuth App
3. Update Authorization callback URL to:
   ```
   https://your-app-name.onrender.com/auth/github/callback
   ```

**Google OAuth:**
1. Go to https://console.cloud.google.com
2. Select your project → Credentials
3. Edit OAuth 2.0 Client
4. Add to Authorized redirect URIs:
   ```
   https://your-app-name.onrender.com/auth/google/callback
   ```

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free services sleep after 15 minutes of inactivity
- **Spin Up**: Takes 30-50 seconds when accessed after sleeping
- **Builds**: 500 build minutes per month (usually enough)
- **Bandwidth**: Limited but typically sufficient for small apps

### Auto-Deploy

- Render automatically deploys when you push to your main branch
- You can disable this in Settings → Build & Deploy

### Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as shown by Render

## MongoDB Atlas Setup

If you haven't set up MongoDB Atlas yet:

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Choose free M0 tier
3. **Database User**:
   - Database Access → Add New User
   - Choose password authentication
   - Save username and password

4. **Network Access**:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database password
   - Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dev-connect`

## Verification Checklist

After deployment, verify:

- [ ] App loads at your Render URL
- [ ] Database connection works (check Render logs)
- [ ] User registration works
- [ ] User login works
- [ ] OAuth login works (if configured)
- [ ] Projects can be created
- [ ] Real-time chat works
- [ ] WebSocket connections work
- [ ] Health check responds at `/health`

## Monitoring & Logs

### View Logs
- Render Dashboard → Your Service → Logs tab
- Real-time log streaming
- Filter by log level

### Health Checks
- Render automatically pings `/health` endpoint
- If health check fails, service restarts automatically

### Email Alerts
- Render sends email alerts for:
  - Deployment failures
  - Service crashes
  - Health check failures

## Troubleshooting

### Service Won't Start

**Check logs for errors:**
```
Render Dashboard → Logs
```

**Common issues:**
- Missing environment variables
- Database connection string incorrect
- Port not using `process.env.PORT`

### Database Connection Fails

- Verify MongoDB Atlas connection string
- Check IP whitelist (should be 0.0.0.0/0)
- Ensure database user credentials are correct
- Test connection string in MongoDB Compass first

### WebSocket/Chat Not Working

- Render supports WebSocket on all plans
- Check browser console for errors
- Verify Socket.io CORS configuration
- Ensure BASE_URL is correct

### OAuth Login Fails

- Verify callback URLs match exactly
- Check CLIENT_ID and CLIENT_SECRET are correct
- Ensure BASE_URL environment variable is set
- Check OAuth app is not in development mode

### App Sleeps (Free Tier)

**Solutions:**
1. **Upgrade to paid plan** ($7/month - no sleep)
2. **Use a ping service**:
   - https://uptimerobot.com (free)
   - Ping your app every 5 minutes
   - Set up monitoring at your `/health` endpoint

3. **Accept the delay**: First request after sleep takes 30-50s

## Performance Tips

1. **Database Indexes**: Add indexes for frequently queried fields
2. **Session Store**: Already using MongoDB for sessions (configured)
3. **Static Assets**: Consider using CDN for public files
4. **Caching**: Implement Redis for caching (requires paid plan)

## Updating Your App

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. Render auto-deploys (if enabled)
3. Watch deployment progress in Render dashboard

## Costs

- **Free Plan**: $0/month
  - Sleeps after 15 min inactivity
  - 500 build minutes/month
  - Shared resources

- **Starter Plan**: $7/month
  - No sleep
  - 1 GB RAM
  - Better performance

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com
- **Support**: support@render.com

## Next Steps

1. Set up monitoring (UptimeRobot)
2. Configure custom domain (optional)
3. Set up error tracking (Sentry - optional)
4. Enable HTTPS (automatic on Render)
5. Test thoroughly before sharing

---

**Your app is now live! 🎉**

Visit: `https://your-app-name.onrender.com`
