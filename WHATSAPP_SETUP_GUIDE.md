# WhatsApp Embedded Signup - Complete Setup Guide

This guide will walk you through setting up WhatsApp Embedded Signup for BotPe AI, allowing users to connect their WhatsApp Business accounts directly from the application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Meta Developer Account Setup](#meta-developer-account-setup)
3. [WhatsApp Business App Configuration](#whatsapp-business-app-configuration)
4. [Environment Variables](#environment-variables)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A Facebook Business Manager account
- ✅ Admin access to create and configure apps
- ✅ A valid domain for your application (for production)
- ✅ HTTPS enabled on your domain (for production)

---

## Meta Developer Account Setup

### Step 1: Create a Meta Developer Account

1. Go to [https://developers.facebook.com/](https://developers.facebook.com/)
2. Click "Get Started" and log in with your Facebook account
3. Accept the terms and conditions
4. Complete the developer registration

### Step 2: Create a New App

1. Click "My Apps" in the top navigation
2. Click "Create App"
3. Select **"Business"** as the app type
4. Click "Next"

### Step 3: Configure Basic App Settings

1. **App Name**: Enter "BotPe AI" (or your preferred name)
2. **App Contact Email**: Enter your contact email
3. **Business Portfolio**: Select or create a business portfolio
4. Click "Create App"

---

## WhatsApp Business App Configuration

### Step 4: Add WhatsApp Product

1. In your app dashboard, scroll to "Add Products to Your App"
2. Find **"WhatsApp"** and click "Set Up"
3. This will add WhatsApp to your app

### Step 5: Configure Embedded Signup

1. In the left sidebar, click **"WhatsApp" > "Configuration"**
2. Scroll to **"Embedded Signup"** section
3. Click **"Create Configuration"**
4. Fill in the configuration details:

   **Configuration Name**: BotPe Production

   **Callback URL**:
   ```
   http://localhost:3000/whatsapp/callback  # Development
   https://yourdomain.com/whatsapp/callback  # Production
   ```

   **Webhook Fields**: Select the following:
   - ✅ messages
   - ✅ message_template_status_update

5. Click **"Create Configuration"**
6. **Copy the Configuration ID** - you'll need this for your `.env` file

### Step 6: Get Your App Credentials

1. In the left sidebar, click **"Settings" > "Basic"**
2. You'll see:
   - **App ID** - Copy this
   - **App Secret** - Click "Show" and copy this

**Important**: Keep your App Secret secure and never commit it to version control!

### Step 7: Configure App Permissions

1. In the left sidebar, click **"App Review" > "Permissions and Features"**
2. Request the following permissions:
   - ✅ `whatsapp_business_management`
   - ✅ `whatsapp_business_messaging`
   - ✅ `business_management`

3. For development, these permissions are automatically granted
4. For production, you'll need to submit for app review

### Step 8: Add Test Users (Development Only)

1. Go to **"Roles" > "Test Users"**
2. Add test users who can access the embedded signup flow
3. These users will be able to connect WhatsApp accounts during development

---

## Environment Variables

### Backend Configuration (`apps/api/.env`)

Add the following variables:

```bash
# WhatsApp Business API
WHATSAPP_APP_ID="your-app-id-from-step-6"
WHATSAPP_APP_SECRET="your-app-secret-from-step-6"
WHATSAPP_API_VERSION="v18.0"
WHATSAPP_VERIFY_TOKEN="botpe_webhook_verify_token_2024"

# Encryption (must be 32-byte hex string)
ENCRYPTION_KEY="generate-with-command-below"
```

To generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Configuration (`apps/web/.env.local`)

```bash
# WhatsApp Embedded Signup
NEXT_PUBLIC_WHATSAPP_APP_ID="your-app-id-from-step-6"
NEXT_PUBLIC_WHATSAPP_CONFIG_ID="your-configuration-id-from-step-5"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Development
# NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # Production
```

---

## Testing the Integration

### 1. Start the Application

```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### 2. Access the WhatsApp Setup Page

1. Open your browser to `http://localhost:3000`
2. Log in with your admin account (admin@botpe.com / Ramborau46**)
3. Navigate to **Settings** > **WhatsApp** (or go to `/dashboard/settings/whatsapp`)

### 3. Connect a WhatsApp Account

1. Click **"Connect with WhatsApp Business"**
2. A popup window will open with Facebook's login
3. Log in with a Facebook account that has access to a WhatsApp Business Account
4. Select the WhatsApp Business Account you want to connect
5. Grant the requested permissions
6. The popup will close and you'll see a success message

### 4. Verify the Connection

After successful connection, you should see:
- ✅ WhatsApp account card displaying:
  - Phone number
  - Verified business name
  - Status badge (Active/Pending/Suspended)
  - Quality rating (Green/Yellow/Red)
  - WABA ID and Phone Number ID

### 5. Test Message Sending

You can test sending a message using the API:

```bash
curl -X POST http://localhost:3001/api/whatsapp/messages/send \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "phoneNumberId": "your-phone-number-id",
    "to": "1234567890",
    "message": "Hello from BotPe AI!"
  }'
```

---

## Webhooks Configuration (Optional)

For receiving incoming messages, you'll need to set up webhooks:

### Step 1: Configure Webhook URL in Meta App

1. Go to your app dashboard
2. Click **"WhatsApp" > "Configuration"**
3. In the **"Webhook"** section:

   **Callback URL**:
   ```
   https://yourdomain.com/api/webhooks/whatsapp
   ```

   **Verify Token**: Use the same value as `WHATSAPP_VERIFY_TOKEN` in your `.env`

4. Click **"Verify and Save"**

### Step 2: Subscribe to Webhook Fields

1. Select the following webhook fields:
   - ✅ messages
   - ✅ message_template_status_update
   - ✅ messaging_optins (optional)
   - ✅ messaging_optouts (optional)

2. Click **"Subscribe"**

**Note**: For development, you can use services like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3001
# Use the HTTPS URL provided by ngrok
```

---

## Troubleshooting

### Issue: "Popup Blocked"

**Solution**:
- Allow popups for your domain in browser settings
- Click the popup icon in the address bar and select "Always allow popups"

### Issue: "No WABA ID found in token"

**Solution**:
- Ensure the Facebook account has admin access to a WhatsApp Business Account
- Verify the app has the correct permissions
- Try connecting with a different Facebook account

### Issue: "Authorization failed: access_denied"

**Solution**:
- User cancelled the authorization flow
- User denied required permissions
- Ask user to try again and accept all permissions

### Issue: "Failed to exchange code for access token"

**Solution**:
- Verify `WHATSAPP_APP_ID` and `WHATSAPP_APP_SECRET` are correct
- Check that the redirect_uri in the code matches exactly with the one configured in Meta
- Ensure the authorization code hasn't expired (valid for 10 minutes)

### Issue: "Failed to subscribe to webhooks"

**Solution**:
- This is a non-critical error during initial setup
- Webhooks can be manually configured later in Meta app dashboard
- Verify the app has `whatsapp_business_management` permission

### Issue: "Encryption failed"

**Solution**:
- Ensure `ENCRYPTION_KEY` is set in `.env`
- Key must be exactly 64 characters (32 bytes in hex)
- Generate new key with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Production Deployment Checklist

Before going to production:

- [ ] Replace `WHATSAPP_APP_ID`, `WHATSAPP_APP_SECRET`, and `WHATSAPP_CONFIG_ID` with production values
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Configure webhook URL with your production domain (HTTPS required)
- [ ] Generate a new, secure `ENCRYPTION_KEY`
- [ ] Enable HTTPS/SSL on your domain
- [ ] Submit app for review if using restricted permissions
- [ ] Test the complete flow on production environment
- [ ] Set up monitoring and error tracking
- [ ] Configure rate limiting for API endpoints
- [ ] Back up encryption keys securely

---

## API Endpoints Reference

### POST `/api/whatsapp/embedded-signup/callback`

Handle embedded signup callback after OAuth authorization.

**Request Body**:
```json
{
  "code": "authorization-code-from-facebook"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "account-id",
    "wabaId": "waba-id",
    "phoneNumberId": "phone-number-id",
    "displayPhoneNumber": "+1234567890",
    "verifiedName": "Business Name",
    "status": "ACTIVE"
  }
}
```

### GET `/api/whatsapp/accounts`

Get all WhatsApp accounts for the organization.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "account-id",
      "wabaId": "waba-id",
      "phoneNumberId": "phone-number-id",
      "displayPhoneNumber": "+1234567890",
      "verifiedName": "Business Name",
      "qualityRating": "GREEN",
      "status": "ACTIVE",
      "createdAt": "2025-11-07T...",
      "updatedAt": "2025-11-07T..."
    }
  ]
}
```

### DELETE `/api/whatsapp/accounts/:id`

Disconnect a WhatsApp account.

**Response**:
```json
{
  "success": true,
  "message": "WhatsApp account deleted successfully"
}
```

### POST `/api/whatsapp/messages/send`

Send a text message via WhatsApp.

**Request Body**:
```json
{
  "phoneNumberId": "phone-number-id",
  "to": "1234567890",
  "message": "Hello from BotPe!"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "messaging_product": "whatsapp",
    "contacts": [...],
    "messages": [
      {
        "id": "wamid.xxx"
      }
    ]
  }
}
```

---

## Additional Resources

- [WhatsApp Embedded Signup Documentation](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [WhatsApp Business Platform Policies](https://www.whatsapp.com/legal/business-policy/)

---

## Support

If you encounter issues not covered in this guide:

1. Check the server logs in `apps/api/src/config/logger.ts`
2. Review browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database is accessible and migrations are run
5. Check Meta app dashboard for any configuration issues

For additional help, refer to the main project documentation or contact the development team.
