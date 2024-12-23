// Login Form Event Listener
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // ফর্ম সাবমিট বন্ধ করা

    // Input Values
    const hospitalName = document.getElementById('hospitalName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Fetch Users Data from JSON
        const response = await fetch('data/users.json');
        const users = await response.json();

        // Check if User Exists
        const user = users.find(
            user => user.hospitalName === hospitalName && user.username === username && user.password === password
        );

        if (user) {
            // Login Successful
            alert('Login Successful!');
            localStorage.setItem('hospitalName', hospitalName); // Store Hospital Name for Dashboard
            window.location.href = 'dashboard.html'; // Redirect to Dashboard
        } else {
            // Login Failed
            document.getElementById('error').textContent = 'Invalid login credentials.';
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        document.getElementById('error').textContent = 'Something went wrong. Please try again later.';
        document.getElementById('error').style.display = 'block';
    }
});





document.addEventListener('DOMContentLoaded', async function () {
    // Load hospitals into dropdown
    const hospitalSelect = document.getElementById('hospitalName');
    try {
        const response = await fetch('data/hospitals.json');
        const hospitals = await response.json();
        hospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.name;
            option.textContent = hospital.name;
            hospitalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading hospitals:', error);
    }
});

document.getElementById('addUserForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const hospitalName = document.getElementById('hospitalName').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    try {
        // Fetch existing users
        const response = await fetch('data/users.json');
        const users = await response.json();

        // Check if the username already exists in the same hospital
        const userExists = users.some(user => user.hospitalName === hospitalName && user.username === username);
        if (userExists) {
            document.getElementById('userError').textContent = 'User already exists in this hospital!';
            document.getElementById('userError').style.display = 'block';
            return;
        }

        // Add new user
        users.push({ hospitalName, username, password, role });

        // Update users.json
        await updateJSONFile('data/users.json', users);

        document.getElementById('userSuccess').textContent = 'User added successfully!';
        document.getElementById('userSuccess').style.display = 'block';
        document.getElementById('userError').style.display = 'none';
    } catch (error) {
        console.error('Error adding user:', error);
        document.getElementById('userError').textContent = 'Something went wrong.';
        document.getElementById('userError').style.display = 'block';
    }
});



