// Contact Form Handler with Formsplee Integration
// Submits to the endpoint specified in the form's action attribute

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const backendEndpoint = contactForm.getAttribute('action');
        const formspreeEndpoint = contactForm.dataset.formspreeEndpoint;
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        const csrfInput = contactForm.querySelector('input[name="csrfmiddlewaretoken"]');
        const csrfToken = csrfInput ? csrfInput.value : '';

        if (!backendEndpoint) {
            alert('Contact form endpoint is not configured.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // First submit to backend to store in DB and send internal email
        fetch(backendEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(result => {
                if (!result.ok) {
                    throw new Error(result.data?.message || 'Backend save failed');
                }

                if (formspreeEndpoint) {
                    return fetch(formspreeEndpoint, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    }).then(fsResp => ({ backendResult: result, formspreeOk: fsResp.ok }));
                }

                return { backendResult: result, formspreeOk: true };
            })
            .then(outcome => {
                const success = document.getElementById('successMessage');
                if (success) success.style.display = 'block';
                contactForm.reset();

                if (outcome && outcome.formspreeOk === false) {
                    alert('Saved, but could not send via Formspree.');
                }
            })
            .catch(error => {
                console.error('Contact submit error:', error);
                alert('Failed to send message. Please try again later.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });
});
