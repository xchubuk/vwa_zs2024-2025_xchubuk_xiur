function switchTab(tab) {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });

    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();

    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('form').forEach(form => {
        form.classList.remove('active');
    });
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('registerForm').classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    let _err = false;
    if (!emailField.value.includes('@') || !emailField.value.includes('.')) {
        alert("Please, enter a valid email");
        _err = true;

        document.getElementById('loginEmail').value = "";
    }

    if (passwordField.value.length < 6) {
        alert("Password must be at least 6 characters");
        _err = true;
        
        document.getElementById('loginPassword').value = "";
    }

    if (!_err) {
        const userData = {
            email: emailField.value,
            password: passwordField.value
        }

        //fetch
    } else return;
}

function handleRegister(event) {
    event.preventDefault();
    const nameField = document.getElementById('registerName');
    const emailField = document.getElementById('registerEmail');
    const passwordField = document.getElementById('registerPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');

    let _err = false;

    if (nameField.value.length < 2) {
        alert("Please enter your full name");
        _err = true;

        nameField.value = "";
    }

    if (!emailField.value.includes('@') || !emailField.value.includes('.')) {
        alert('Please enter a valid email');
        _err = true;

        emailField.value = "";
    }

    if (passwordField.value.length < 6) {
        alert('Password must be at least 6 characters');
        _err = true;

        passwordField.value = "";
        confirmPasswordField.value = "";
    }

    if (passwordField.value !== confirmPasswordField.value) {
        alert('Passwords do not match');
        _err = true;

        passwordField.value = "";
        confirmPasswordField.value = "";
    }

    if (!_err) {
        const userData = {
            name: nameField.value,
            email: emailField.value,
            password: passwordField.value
        }
        
        fetch('/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
    } else return;
}