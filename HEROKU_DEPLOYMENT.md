# Heroku Deployment Guide for NextGen EduMigrate

This guide will help you deploy your NextGen EduMigrate website to Heroku.

## Prerequisites

1. **Heroku CLI installed** - [Download here](https://devcenter.heroku.com/articles/heroku-cli)
2. **Git repository** - Your project should be in a Git repository
3. **Heroku account** - [Sign up here](https://heroku.com)

## Step-by-Step Deployment

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a new Heroku app
```bash
heroku create your-app-name
# Example: heroku create nextgen-edumigrate-prod
```

### 3. Set Environment Variables
You need to set your environment variables on Heroku. Use the Heroku CLI or dashboard:

```bash
# Firebase Configuration
heroku config:set NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
heroku config:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
heroku config:set NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
heroku config:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
heroku config:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
heroku config:set NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# ImgBB Configuration
heroku config:set IMGBB_API_KEY=your_imgbb_api_key

# Telegram Configuration
heroku config:set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
heroku config:set TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 4. Deploy to Heroku
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 5. Open your app
```bash
heroku open
```

## Environment Variables Setup

### Option 1: Using Heroku CLI
Copy your `.env.local` values and set them using:
```bash
heroku config:set VARIABLE_NAME=value
```

### Option 2: Using Heroku Dashboard
1. Go to your app dashboard on heroku.com
2. Click on "Settings" tab
3. Click "Reveal Config Vars"
4. Add each environment variable manually

## Important Notes

### Firebase Configuration
- Make sure your Firebase project allows your Heroku domain
- Update Firebase Authentication settings to include your Heroku URL
- Update Firebase Security Rules if needed

### Domain Configuration
- After deployment, update any hardcoded URLs in your code
- Configure custom domain if needed: `heroku domains:add your-domain.com`

### SSL Certificate
- Heroku provides SSL automatically for `.herokuapp.com` domains
- For custom domains, you may need to configure SSL

## Troubleshooting

### Build Failures
```bash
heroku logs --tail
```

### Environment Issues
- Check that all required environment variables are set
- Verify Firebase configuration is correct
- Ensure API keys have proper permissions

### Performance Optimization
- Consider upgrading to a paid Heroku plan for better performance
- Enable Redis for caching if needed
- Optimize images and assets

## Monitoring

### View Logs
```bash
heroku logs --tail
```

### App Metrics
- Use Heroku dashboard for app metrics
- Monitor dyno usage and performance

## Scaling

### Scale Dynos
```bash
heroku ps:scale web=1
# For more traffic: heroku ps:scale web=2
```

## Useful Commands

```bash
# Restart app
heroku restart

# Run bash on Heroku
heroku run bash

# Check app status
heroku ps

# View config vars
heroku config

# View app info
heroku info
```

## Support

If you encounter issues:
1. Check Heroku logs: `heroku logs --tail`
2. Verify environment variables: `heroku config`
3. Test locally first: `npm run build && npm start`
4. Check Firebase console for any configuration issues
