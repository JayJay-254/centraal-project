// Contact Form Handler with EmailJS Integration
// This provides client-side email sending as a fallback/supplement to Django backend

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    // Initialize EmailJS (replace with your actual public key from emailjs.com)
    // You can get your public key from: https://dashboard.emailjs.com/admin/account
    const emailjsPublicKey = 'YOUR_PUBLIC_KEY_HERE';
    
    // Only initialize EmailJS if a valid public key is configured
    if (emailjsPublicKey && emailjsPublicKey !== 'YOUR_PUBLIC_KEY_HERE') {
        try {
            emailjs.init(emailjsPublicKey);
            console.log('EmailJS initialized');
        } catch (error) {
            console.log('EmailJS initialization skipped:', error.message);
        }
    } else {
        console.log('EmailJS public key not configured. Using Django backend email only.');
    }
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        // Let Django handle the form submission via normal POST
        // This will send the form to the backend which will handle database storage and email
        console.log('Contact form submitted - processing via Django backend');
    });
});

// Optional: Function to send email directly via EmailJS (if needed)
function sendEmailViaEmailJS(contactData) {
    const templateParams = {
        to_email: 'centraladventurers@gmail.com',
        from_name: contactData.name,
        from_email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        reply_to: contactData.email
    };
    
    return emailjs.send('SERVICE_ID', 'TEMPLATE_ID', templateParams);
}
