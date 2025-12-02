# EmailJS Setup Guide

This guide will help you set up EmailJS for the contact form on the Central Adventures website.

## What is EmailJS?

EmailJS allows you to send emails directly from your website without needing a backend server. It's perfect for contact forms.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. After logging in, go to the "Email Services" section
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Give your service a name and click "Create Service"
6. **Save your Service ID** - you'll need this later

## Step 3: Create an Email Template

1. Go to the "Email Templates" section
2. Click "Create New Template"
3. Set up your template with these parameters:
   - **Subject:** `New Contact Form Message: {{subject}}`
   - **Content:**
     ```
     You have received a new message from the Central Adventures contact form.

     Name: {{from_name}}
     Email: {{from_email}}
     Subject: {{subject}}

     Message:
     {{message}}
     ```
4. Click "Save"
5. **Save your Template ID** - you'll need this later

## Step 4: Get Your Public Key

1. Go to "Account" in the menu
2. Find the "API Keys" section
3. Copy your **Public Key**

## Step 5: Update the Website Code

1. Open `js/main.js` in your code editor
2. Find the EmailJS initialization section (around line 287)
3. Replace the placeholder values:

```javascript
// Replace this line:
emailjs.init('YOUR_PUBLIC_KEY');

// With your actual public key:
emailjs.init('your_actual_public_key_here');
```

4. Find the email sending section (around line 306)
5. Replace the placeholder values:

```javascript
// Replace this line:
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)

// With your actual IDs:
emailjs.send('your_service_id', 'your_template_id', templateParams)
```

## Step 6: Test the Contact Form

1. Open `contacts.html` in your browser (make sure you're logged in)
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox for the test message

## Troubleshooting

### Messages aren't being sent
- Check that your Public Key, Service ID, and Template ID are correct
- Make sure you're connected to the internet
- Check the browser console for error messages (press F12)

### Emails go to spam
- Add a custom domain to your EmailJS account
- Configure SPF and DKIM records for better deliverability

### Rate limiting
- The free EmailJS plan allows 200 emails per month
- Upgrade to a paid plan if you need more

## Additional Configuration

### Set up Auto-Reply
1. In EmailJS, create a second template for auto-replies
2. Add code to send a confirmation email to the user
3. Use `{{from_email}}` as the recipient

### Custom Email Address
Instead of using Gmail/Outlook, you can:
1. Use EmailJS with a custom SMTP server
2. Configure your domain's email settings
3. Set up professional email addresses like info@centraladventures.ke

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

## Security Note

Never commit your EmailJS keys to public repositories. Keep them private and use environment variables in production.
