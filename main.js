document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const signUpForm = document.getElementById('signup-form');
    const loginButton = document.querySelector('#login-form .form-submit');
    const signUpButton = document.querySelector('#signup-btn');
    const heading = document.querySelector('.heading');

    signUpButton.addEventListener('click', function () {
        loginForm.classList.add('hidden');
        signUpForm.classList.remove('hidden');
        heading.textContent = 'Đăng Ký';
    });

    loginButton.addEventListener('click', function () {
        signUpForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        heading.textContent = 'Đăng nhập';
    });
    
    const loginButtonOnSignUpPage = document.querySelector('#signup-form .form-submit');
    loginButtonOnSignUpPage.addEventListener('click', function () {
        loginForm.classList.remove('hidden');
        signUpForm.classList.add('hidden');
        heading.textContent = 'Đăng nhập';
    });

    // Function to update UI based on login status
    function updateUI(isLoggedIn, username) {
        const emailLabel = document.querySelector('label[for="email"]');
        const passwordLabel = document.querySelector('label[for="password"]');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginButton = document.querySelector('#login-form .form-submit');

        if (isLoggedIn) {
            heading.textContent = 'Đăng nhập thành công';
            loginButton.textContent = 'Đăng xuất';
            loginButton.addEventListener('click', function () {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                updateUI(false, null); // Update UI for logged-out state
            });

            emailLabel.textContent = 'Hello ' + username;
            emailLabel.style.display = 'block';
            passwordLabel.style.display = 'none';

            emailInput.style.display = 'none';
            emailInput.value = ''; // Clear email input
            passwordInput.style.display = 'none'; // Hide password input
            passwordInput.value = ''; // Clear password input
        } else {
            heading.textContent = 'Đăng Nhập';
            loginButton.textContent = 'Đăng nhập';
            loginButton.removeEventListener('click', null);

            emailLabel.textContent = 'Email';
            emailLabel.style.display = 'block';
            passwordLabel.style.display = 'block';

            emailInput.style.display = 'block';
            emailInput.placeholder = 'Nhập email';
            emailInput.disabled = false;

            passwordInput.style.display = 'block'; // Show password input
        }
    }

    // Login Form
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate email and password
        if (email && password) {
            // Perform login API request
            fetch('https://api.storerestapi.com/auth/login?fbclid=IwAR15S2QEgwqoCAcGcRJm4T2FLUpl90FB4GPvuA3gyQeSFnfEwLVCYMOJU8o', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ email, password }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status == 200) {
                        alert("Đăng nhập thành công");
                        updateUI(true, email); // Update UI for successful login
                        localStorage.setItem('isLoggedIn', true);
                        localStorage.setItem('username', email);
                    } else {
                        throw new Error('Login failed');
                    }
                })
                .catch(error => {
                    alert("Đăng nhập thất bại: " + error.message);
                    console.error('Error:', error);
                });
        }
    });

    // Signup Form
    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const repassword = document.getElementById('signup-password_repeat').value.trim();

        // Validate username, email, and password
        if (username && email && password && repassword) {
            // Perform signup API request
            fetch('https://api.storerestapi.com/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: username,
                    email: email,
                    number: 123456,
                    password: password,
                    password_repeat: repassword,
                }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status === 201) {
                        alert("Đăng ký thành công");
                        localStorage.setItem('isLoggedIn', true);
                        localStorage.setItem('username', username);
                        updateUI(true, username);
                    } else {
                        alert("Đăng ký thất bại");
                    }
                })
                .catch(error => {
                    alert("Đăng ký thất bại: " + error.message);
                    console.error(error);
                });
        } else {
            alert("Vui lòng điền đầy đủ thông tin.");
        }
    });

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    if (isLoggedIn && username) {
        updateUI(true, username);
    }
});
