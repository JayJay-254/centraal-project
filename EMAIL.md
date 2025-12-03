# Email Configuration for Central Adventures

## Overview

The Central Adventures contact form now sends emails via Django's SMTP backend. This document explains how to configure email sending for both local development and production deployment on Render.

## Current Setup

### Backend Email System

**File**: `trips/views.py` - `contact_us()` function
- Saves contact messages to the database
- Sends an email to the admin (configured email) when a contact form is submitted
- Displays success/error messages to the user

**Configuration**: `central_adventures/settings.py`
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'centraladventurers@gmail.com'
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = 'centraladventurers@gmail.com'
```

### Frontend (Optional EmailJS Integration)

**File**: `trips/static/js/contact-form.js`
- Placeholder for optional EmailJS client-side email sending
- Currently uses Django backend for email

## Local Development

### Option 1: Console Backend (No Real Emails)

For local testing without sending actual emails, the Django console backend is useful.

**To use console backend locally, set environment variable**:
```powershell
$env:EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

Then run the server:
```powershell
& './venv/Scripts/python.exe' manage.py runserver
```

Emails will print to the console instead of sending.

### Option 2: Gmail SMTP (Real Emails)

To send real emails locally via Gmail:

1. **Enable 2-Factor Authentication on Gmail**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device type
   - Google will generate a 16-character password
   - Copy this password (spaces are included)

3. **Set Environment Variable** (PowerShell):
   ```powershell
   $env:EMAIL_HOST_PASSWORD = "xxxx xxxx xxxx xxxx"
   ```

4. **Run server and test**:
   ```powershell
   & './venv/Scripts/python.exe' manage.py runserver
   ```

5. **Visit contact form**:
   - Navigate to http://localhost:8000/contact-us/
   - Fill out and submit the form
   - You should receive an email at `centraladventurers@gmail.com`

## Production Deployment (Render)

### Step 1: Prepare Gmail App Password

Follow the same steps as local development (Option 2 above) to generate a Gmail App Password.

### Step 2: Set Environment Variables on Render

1. Go to your Render service dashboard
2. Click **Settings** in the left sidebar
3. Scroll to **Environment** section
4. Add the following environment variable:

| Key | Value |
|-----|-------|
| `EMAIL_HOST_PASSWORD` | `xxxx xxxx xxxx xxxx` (your 16-char Gmail App Password) |

**Optional**: If using a different email service, also set:

| Key | Value | Default |
|-----|-------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USE_TLS` | `True` or `False` | `True` |
| `EMAIL_HOST_USER` | Email address for authentication | `centraladventurers@gmail.com` |
| `DEFAULT_FROM_EMAIL` | From address in emails | `centraladventurers@gmail.com` |

### Step 3: Deploy

Push your changes to trigger a new deploy on Render.

### Step 4: Test Email on Render

1. Visit your deployed site: `https://your-app.onrender.com/contact-us/`
2. Fill out the contact form
3. Check `centraladventurers@gmail.com` for the message
4. Check Render logs if email fails to send:
   ```bash
   # In Render logs, look for email-related errors
   ```

## Alternative Email Services

You can use any SMTP-based email service. Here are common options:

### SendGrid

```python
EMAIL_BACKEND = 'sendgrid_backend.SendgridBackend'
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
```

Requires: `pip install sendgrid-django`

### AWS SES (Simple Email Service)

```python
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_SES_REGION_NAME = 'us-east-1'
AWS_SES_REGION_ENDPOINT = 'email.us-east-1.amazonaws.com'
```

Requires: `pip install django-ses`

### MailChimp (Transactional)

Use SMTP settings provided in MailChimp settings.

## Troubleshooting

### "Authentication Required" Error

**Cause**: Email password not set or incorrect

**Solution**:
1. Verify `EMAIL_HOST_PASSWORD` environment variable is set
2. Ensure it's a Gmail App Password (not your regular password)
3. Re-generate app password if needed

### "Connection refused" Error

**Cause**: SMTP server unreachable

**Solution**:
1. Check `EMAIL_HOST` is correct (`smtp.gmail.com` for Gmail)
2. Verify firewall allows outbound connections on `EMAIL_PORT` (587 for Gmail)
3. Test locally first before deploying to Render

### "TLS Error"

**Cause**: TLS handshake failed

**Solution**:
1. Ensure `EMAIL_USE_TLS = True` for port 587
2. Some services use `SSL` (port 465) instead - set `EMAIL_USE_SSL = True` and `EMAIL_PORT = 465`

### Emails Not Received

**Possible causes**:
1. Check spam/junk folder on recipient email
2. Verify Gmail App Password is correct (copy carefully, includes spaces)
3. Check Render application logs for errors
4. Ensure `DEFAULT_FROM_EMAIL` matches the authenticated email (`EMAIL_HOST_USER`)

## Viewing Email Test

To verify email configuration is working, a test script is available:

```powershell
$env:EMAIL_HOST_PASSWORD = "your_app_password"
& './venv/Scripts/python.exe' -c "
import os
os.environ['EMAIL_HOST_PASSWORD'] = 'your_app_password'
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'central_adventures.settings')
django.setup()
from django.core.mail import send_mail
from django.conf import settings
send_mail('Test', 'Test email', settings.DEFAULT_FROM_EMAIL, [settings.EMAIL_HOST_USER])
print('Email sent!')
"
```

## Contact Form Flow

```
User submits form
    ↓
Django validates form
    ↓
Message saved to database (ContactMessage model)
    ↓
Django sends SMTP email to admin
    ↓
User sees success message
    ↓
Admin receives email with contact details
```

## Files Modified

- `central_adventures/settings.py` - Added email configuration
- `trips/views.py` - Updated `contact_us()` to send emails
- `trips/templates/contacts.html` - Added message display area
- `trips/static/js/contact-form.js` - Created for future EmailJS integration
- `trips/static/images/styles/css/styles.css` - Added alert message styling

## Next Steps (Optional)

1. **Add email templates** for better email formatting (HTML emails)
2. **Implement EmailJS** for client-side fallback email sending
3. **Add email queue** (Celery + Redis) for better performance
4. **Add email rate limiting** to prevent spam
5. **Monitor email delivery** with tools like SendGrid or AWS SES analytics
