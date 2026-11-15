
// ==========================================
// H&M BAKERY - AUTHENTICATION SYSTEM
// Login, Profile and Logout
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOGIN FUNCTIONALITY
    // ==========================================

    const loginForm = document.querySelector('#login-form');

    if (loginForm) {

        loginForm.addEventListener('submit', (event) => {

            event.preventDefault();

            const emailInput =
                document.querySelector('#login-email');

            const passwordInput =
                document.querySelector('#login-password');

            const emailError =
                document.querySelector('#login-email-error');

            const passwordError =
                document.querySelector('#login-password-error');

            const message =
                document.querySelector('#login-message');

            const email = emailInput.value.trim().toLowerCase();

            const password = passwordInput.value;

            // Clear old errors
            emailError.textContent = '';
            passwordError.textContent = '';
            message.textContent = '';

            emailInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');

            // Email validation
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let valid = true;

            if (!email) {

                emailError.textContent =
                    'Email is required.';

                emailInput.classList.add('is-invalid');

                valid = false;

            } else if (!emailPattern.test(email)) {

                emailError.textContent =
                    'Please enter a valid email address.';

                emailInput.classList.add('is-invalid');

                valid = false;

            }

            // Password validation
            if (!password) {

                passwordError.textContent =
                    'Password is required.';

                passwordInput.classList.add('is-invalid');

                valid = false;

            }

            if (!valid) return;

            // Get registered user
            let savedUser = null;

            try {

                savedUser = JSON.parse(
                    localStorage.getItem('hmBakeryUser') || 'null'
                );

            } catch (error) {

                console.error('Unable to read user data:', error);

            }

            // Check if account exists
            if (!savedUser) {

                message.textContent =
                    'No account found. Please create an account first.';

                message.style.color = 'red';

                return;

            }

            // Check email and password
            if (
                savedUser.email.toLowerCase() === email &&
                savedUser.password === password
            ) {

                // Save login session
                localStorage.setItem(
                    'hmBakerySession',
                    savedUser.email
                );

                // Redirect to Profile Page
                window.location.href = 'profile.html';

            } else {

                message.textContent =
                    'Incorrect email or password. Please try again.';

                message.style.color = 'red';

            }

        });

    }


    // ==========================================
    // PROFILE PAGE
    // ==========================================

    const profileName =
        document.querySelector('#profile-name');

    if (profileName) {

        let savedUser = null;

        try {

            savedUser = JSON.parse(
                localStorage.getItem('hmBakeryUser') || 'null'
            );

        } catch (error) {

            console.error('Unable to read user data:', error);

        }

        const activeSession =
            localStorage.getItem('hmBakerySession');

        // Check authentication
        if (
            !savedUser ||
            !activeSession ||
            activeSession !== savedUser.email
        ) {

            window.location.replace('login.html');

            return;

        }

        // Display user information
        document.querySelector('#profile-name').textContent =
            savedUser.name;

        document.querySelector('#profile-email').textContent =
            savedUser.email;

        document.querySelector('#profile-phone').textContent =
            savedUser.phone;

    }


    // ==========================================
    // LOGOUT FUNCTIONALITY
    // ==========================================

    const logoutButton =
        document.querySelector('#logout-button');

    if (logoutButton) {

        logoutButton.addEventListener('click', () => {

            // Remove login session
            localStorage.removeItem('hmBakerySession');

            // Redirect to Login Page
            window.location.href = 'login.html';

        });

    }

});
