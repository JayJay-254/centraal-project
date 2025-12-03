# Quick Email Setup Guide

## 🚀 Get Emails Working in 5 Minutes

### Step 1: Generate Gmail App Password (2 mins)

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device type
3. Copy the 16-character password

### Step 2: Deploy to Render (1 min)

1. Go to Render dashboard → Your service
2. Click **Settings** → **Environment**
3. Add variable:
   ```
   EMAIL_HOST_PASSWORD = xxxx xxxx xxxx xxxx
   ```
4. Click **Save**
5. Redeploy (Render will auto-redeploy or manually trigger)

### Step 3: Test (2 mins)

1. Visit your site: `https://your-app.onrender.com/contact-us/`
2. Submit the contact form
3. Check your inbox (or spam folder)
4. ✅ Email received!

---

## 🧪 Test Locally

### Quick Test (Console - No Real Email)

```powershell
$env:EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
& './venv/Scripts/python.exe' manage.py runserver
# Visit http://localhost:8000/contact-us/
# Submit form and check console output
```

### Full Test (Real Gmail Email)

```powershell
$env:EMAIL_HOST_PASSWORD = "xxxx xxxx xxxx xxxx"
& './venv/Scripts/python.exe' manage.py runserver
# Visit http://localhost:8000/contact-us/
# Submit form and check centraladventurers@gmail.com
```

---

## ✅ Verify It's Working

After deployment, check:
- [ ] Contact form loads at `/contact-us/`
- [ ] Submit test message
- [ ] Email arrives in inbox within 1-2 minutes
- [ ] User sees success message on page
- [ ] Message appears in database (admin panel)

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Authentication Required" error | Gmail App Password not set or wrong |
| Email not received | Check spam folder; verify app password is correct |
| "Connection refused" | Firewall issue; likely local only |
| Form submits but no email | Check Render logs; verify env var is set |

---

## 📧 What Gets Sent

When user submits contact form, admin receives email with:
- User's name
- User's email address
- Message subject
- Full message text

---

## 🔗 Full Docs

See `EMAIL.md` for:
- Detailed setup instructions
- Alternative email services
- HTML email templates
- Advanced configuration

See `EMAIL_SETUP.md` for:
- Architecture diagram
- File changes summary
- Testing checklist
- Next steps/enhancements
