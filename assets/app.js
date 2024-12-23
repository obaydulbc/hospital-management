document.addEventListener('DOMContentLoaded', async function () {
    const hospitalSelect = document.getElementById('hospitalName');

    try {
        // Fetch Hospitals Data
        const response = await fetch('/data/hospitals.json');
        if (!response.ok) {
            throw new Error('Failed to fetch hospital data');
        }
        const hospitals = await response.json();

        // Populate Dropdown
        hospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.name; // Assuming each hospital has a `name` field
            option.textContent = hospital.name;
            hospitalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading hospitals:', error);
    }
});


    // Add Login Form Event Listener
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const hospitalName = hospitalSelect.value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('data/users.json');
            const users = await response.json();

            const user = users.find(
                user =>
                    user.hospitalName === hospitalName &&
                    user.username === username &&
                    user.password === password
            );

            if (user) {
                alert('Login Successful!');
                localStorage.setItem('hospitalName', hospitalName);
                localStorage.setItem('username', username);
                localStorage.setItem('role', user.role);

                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'hospital-dashboard.html';
                }
            } else {
                document.getElementById('error').textContent = 'Invalid login credentials.';
                document.getElementById('error').style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            document.getElementById('error').textContent = 'Something went wrong. Please try again.';
            document.getElementById('error').style.display = 'block';
        }
    });
});





document.addEventListener('DOMContentLoaded', () => {
    // Check if the logged-in user is an admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
        alert('You do not have permission to access this page.');
        window.location.href = 'login.html';  // Redirect to login page
    }

    // Add Hospital
    const hospitalForm = document.getElementById('add-hospital-form');
    hospitalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hospitalName = hospitalForm.querySelector('[name="hospitalName"]').value;

        try {
            const response = await fetch('/api/hospitals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: hospitalName })
            });

            if (response.ok) {
                document.getElementById('hospital-success').style.display = 'block';
                document.getElementById('hospital-error').style.display = 'none';
                hospitalForm.reset();
            } else {
                throw new Error('Failed to add hospital');
            }
        } catch (error) {
            document.getElementById('hospital-error').style.display = 'block';
        }
    });

    // Add User
    const userForm = document.getElementById('add-user-form');
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = userForm.querySelector('[name="username"]').value;
        const password = userForm.querySelector('[name="password"]').value;
        const role = userForm.querySelector('[name="role"]').value;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                document.getElementById('user-success').style.display = 'block';
                document.getElementById('user-error').style.display = 'none';
                userForm.reset();
            } else {
                throw new Error('Failed to add user');
            }
        } catch (error) {
            document.getElementById('user-error').style.display = 'block';
        }
    });

    // View Users
    const viewUsersButton = document.getElementById('view-users');
    viewUsersButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            const userListDiv = document.getElementById('user-list');
            userListDiv.innerHTML = '';  // Clear previous list

            if (users.length > 0) {
                users.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.textContent = `${user.username} - ${user.role}`;
                    userListDiv.appendChild(userDiv);
                });
            } else {
                userListDiv.textContent = 'No users found.';
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });
});




const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Admin Dashboard Route
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

// Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


// Get all hospitals
app.get('/api/hospitals', (req, res) => {
    fs.readFile('./data/hospitals.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load hospitals' });
        }
        res.json(JSON.parse(data));
    });
});

// Add a new hospital
app.post('/api/hospitals', (req, res) => {
    const newHospital = req.body;

    fs.readFile('./data/hospitals.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load hospitals' });
        }

        const hospitals = JSON.parse(data);
        hospitals.push(newHospital);

        fs.writeFile('./data/hospitals.json', JSON.stringify(hospitals, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save hospital' });
            }
            res.status(201).json({ message: 'Hospital added successfully' });
        });
    });
});

