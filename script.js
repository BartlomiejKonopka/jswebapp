const users = JSON.parse(localStorage.getItem('users')) || [];

function showSignUp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('signup-screen').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            alert(error);
            return;
        }

        alert('Login successful!');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
}

async function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            alert(error);
            return;
        }

        alert('Sign up successful!');
        showLogin();
    } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred while signing up.');
    }
}

function logout() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}
