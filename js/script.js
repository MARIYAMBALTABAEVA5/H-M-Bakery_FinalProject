console.log("H&M Bakery script.js is loaded!");

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FINAL PROJECT: REGISTRATION AND VALIDATION
    // ==========================================

    const registerForm = document.querySelector('#register-form');

    if (registerForm) {

        registerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            const fields = {
                name: document.querySelector('#register-name'),
                email: document.querySelector('#register-email'),
                phone: document.querySelector('#register-phone'),
                password: document.querySelector('#register-password'),
                confirm: document.querySelector('#register-confirm')
            };

            const success = document.querySelector('#register-success');

            // Check that all required fields exist
            if (Object.values(fields).some(field => !field)) {
                console.error('Registration form fields are missing.');
                return;
            }

            // Get values
            const values = {
                name: fields.name.value.trim(),
                email: fields.email.value.trim(),
                phone: fields.phone.value.trim(),
                password: fields.password.value,
                confirm: fields.confirm.value
            };

            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Phone validation (Kazakhstan)
            let phoneDigits = values.phone.replace(/\D/g, '');

            if (phoneDigits.startsWith('8')) {
                phoneDigits = '7' + phoneDigits.slice(1);
            }

            const phoneValid = /^7\d{10}$/.test(phoneDigits);

            // Password validation
            const passwordValid =
                values.password.length >= 8 &&
                /[A-Z]/.test(values.password) &&
                /[a-z]/.test(values.password) &&
                /\d/.test(values.password);

            // Check every field
            const errors = {

                name: values.name
                    ? ''
                    : 'Please enter your full name.',

                email: emailPattern.test(values.email)
                    ? ''
                    : 'Please enter a valid email address.',

                phone: phoneValid
                    ? ''
                    : 'Enter a valid Kazakhstan phone number.',

                password: passwordValid
                    ? ''
                    : 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.',

                confirm: values.confirm &&
                    values.confirm === values.password
                    ? ''
                    : 'Passwords do not match.'

            };

            // Display validation errors
            for (const [key, message] of Object.entries(errors)) {

                const errorElement =
                    document.querySelector('#register-' + key + '-error');

                if (errorElement) {
                    errorElement.textContent = message;
                }

                fields[key].classList.toggle(
                    'is-invalid',
                    Boolean(message)
                );

                fields[key].setAttribute(
                    'aria-invalid',
                    String(Boolean(message))
                );

            }

            if (success) {
                success.textContent = '';
            }

            // Stop if there are errors
            if (Object.values(errors).some(Boolean)) {
                return;
            }

            // Check existing registered user
            let existingUser = null;

            try {

                existingUser = JSON.parse(
                    localStorage.getItem('hmBakeryUser') || 'null'
                );

            } catch (error) {
                console.error('Could not read saved user:', error);
            }

            // Prevent duplicate registration
            if (
                existingUser &&
                existingUser.email.toLowerCase() === values.email.toLowerCase()
            ) {

                const emailError =
                    document.querySelector('#register-email-error');

                if (emailError) {
                    emailError.textContent =
                        'This email is already registered. Please log in.';
                }

                fields.email.classList.add('is-invalid');

                return;
            }

            // Create user object
            const user = {
                name: values.name,
                email: values.email.toLowerCase(),
                phone: values.phone,
                password: values.password
            };

            // Save user in localStorage
            try {

                localStorage.setItem(
                    'hmBakeryUser',
                    JSON.stringify(user)
                );

                if (success) {
                    success.textContent =
                        'Registration successful! Your account has been created.';

                    success.style.color = 'green';
                }

                // Clear form
                registerForm.reset();

                // Clear validation styles
                Object.values(fields).forEach(field => {

                    field.classList.remove('is-invalid');
                    field.removeAttribute('aria-invalid');

                });

            } catch (error) {

                if (success) {
                    success.textContent =
                        'Unable to save your account. Please try again.';

                    success.style.color = 'red';
                }

                console.error('Registration error:', error);

            }

        });

    }

    // Contact form uses inline feedback so browser popups never replace guidance.
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = document.querySelector('#name');
            const email = document.querySelector('#email');
            const message = document.querySelector('#msg');
            let feedback = document.querySelector('#contact-feedback');
            if (!feedback) {
                feedback = document.createElement('p');
                feedback.id = 'contact-feedback';
                feedback.className = 'form-feedback';
                feedback.setAttribute('role', 'status');
                feedback.setAttribute('aria-live', 'polite');
                contactForm.append(feedback);
            }
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            const errors = [];
            if (!name.value.trim()) errors.push('enter your name');
            if (!emailValid) errors.push('enter a valid email');
            if (message.value.trim().length < 10) errors.push('write a message of at least 10 characters');
            feedback.textContent = errors.length
                ? `Please ${errors.join(', ')}.`
                : 'Thanks! Your message passed validation. This demo does not send it to a server.';
            feedback.classList.toggle('text-danger', errors.length > 0);
            feedback.classList.toggle('text-success', errors.length === 0);
        });
    }


    // ==========================================
    // TASK 3: SUBSCRIPTION MODAL
    // ==========================================

    const modal = document.querySelector('#subscribe-modal');
    const closeButton = document.querySelector('#close-subscribe');

    let previousFocus = null;

    function closeModal() {

        if (!modal) return;

        modal.hidden = true;
        document.body.classList.remove('modal-open');

        if (previousFocus) {
            previousFocus.focus();
        }

    }

    if (modal) {

        document.querySelectorAll('#open-subscribe').forEach((button) => {

            button.addEventListener('click', () => {

                previousFocus = button;

                modal.hidden = false;

                document.body.classList.add('modal-open');

                document.querySelector('#subscribe-email')?.focus();

            });

        });

        closeButton?.addEventListener('click', closeModal);

        modal.addEventListener('click', (event) => {

            if (event.target === modal) {
                closeModal();
            }

        });

        document.addEventListener('keydown', (event) => {

            if (modal.hidden) return;

            if (event.key === 'Escape') {
                closeModal();
            }

            if (event.key === 'Tab') {

                const focusable = [
                    ...modal.querySelectorAll('button, input')
                ];

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {

                    event.preventDefault();
                    last.focus();

                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {

                    event.preventDefault();
                    first.focus();

                }

            }

        });

    }


    // ==========================================
    // SUBSCRIPTION FORM
    // ==========================================

    const subscribeForm = document.querySelector('#subscribe-form');

    if (subscribeForm) {

        subscribeForm.addEventListener('submit', (event) => {

            event.preventDefault();

            const emailInput =
                document.querySelector('#subscribe-email');

            const feedback =
                document.querySelector('#subscribe-feedback');

            if (!emailInput || !feedback) return;

            const email = emailInput.value.trim();

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            feedback.textContent = emailPattern.test(email)
                ? 'Email format is valid! Demo only — no subscription was saved.'
                : 'Please enter a valid email address.';
            feedback.classList.toggle('text-success', emailPattern.test(email));
            feedback.classList.toggle('text-danger', !emailPattern.test(email));

        });

    }


    // ==========================================
    // TASK 4: BACKGROUND COLOR CHANGE
    // ==========================================

    const colors = [
        '#fffaf5',
        '#f2f7ec',
        '#f0f3fc',
        '#fff0f5'
    ];

    let colorIndex = 0;

    document.querySelectorAll('#change-color').forEach((button) => {

        button.addEventListener('click', () => {

            colorIndex = (colorIndex + 1) % colors.length;

            document.body.style.backgroundColor =
                colors[colorIndex];

        });

    });


    // ==========================================
    // TASK 5: LIVE DATE AND TIME
    // ==========================================

    function updateClock() {

        const currentTime = new Date().toLocaleString('en-US', {
            dateStyle: 'long',
            timeStyle: 'medium'
        });

        document.querySelectorAll('#live-clock').forEach((clock) => {

            clock.textContent = currentTime;

        });

    }

    // Display time immediately
    updateClock();

    // Update every second
    setInterval(updateClock, 1000);


    // ==========================================
    // TASK 6: FAQ ACCORDION
    // Answers stay open until the same question is clicked again
    // ==========================================
    // FAQ ACCORDION
document.querySelectorAll('#faq-section .faq-item').forEach(item => {
    const button = item.querySelector('.faq-toggle');
    const answer = item.querySelector('.faq-answer');
    const icon = button.querySelector('span');

    // Initially all answers are closed
    answer.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    icon.textContent = '+';

    button.addEventListener('click', function () {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            // Close only this answer
            answer.hidden = true;
            button.setAttribute('aria-expanded', 'false');
            icon.textContent = '+';
            item.classList.remove('open');
        } else {
            // Open this answer and keep it visible
            answer.hidden = false;
            button.setAttribute('aria-expanded', 'true');
            icon.textContent = '−';
            item.classList.add('open');
        }
    });
});
    
    // ==========================================
    // ALL FEATURES INITIALIZED
    // ==========================================

    console.log('All H&M Bakery JavaScript features initialized!');

});
