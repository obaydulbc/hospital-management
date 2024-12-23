// Login functionality
const loginUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users');
        const data = await response.json();

        // Check if response contains the 'users' field
        if (data.users && Array.isArray(data.users)) {
            // Find user by username and password
            const user = data.users.find(u => u.username === username && u.password === password);

            if (user) {
                // If user found, store session data and redirect
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                
                // Redirect based on role
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard if admin
                } else {
                    window.location.href = 'dashboard.html'; // Redirect to user dashboard if not admin
                }
            } else {
                alert('Invalid username or password');
            }
        } else {
            alert('Error: Invalid response from API.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in. Please try again later.');
    }
};

// Handle login form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', loginUser);

// Fetch users and display in hospital_management.html or dashboard.html
const fetchUsers = async () => {
    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users');
    const data = await response.json();
    
    const usersTable = document.querySelector('#usersTable tbody');
    usersTable.innerHTML = ''; // Clear existing table rows
    
    data.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.hospitalID}</td>
            <td>
                <button class="editBtn" onclick="editUser(${user.id})">Edit</button>
                <button class="deleteBtn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        usersTable.appendChild(row);
    });
};

// Edit User
const editUser = async (userId) => {
    const updatedUser = {
        user: {
            username: 'newUsername',
            role: 'newRole',
            hospitalID: 'newHospitalID',
        }
    };
    
    const response = await fetch(`https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const data = await response.json();
    alert('User updated successfully!');
    fetchUsers(); // Reload users after update
};

// Delete User
const deleteUser = async (userId) => {
    const response = await fetch(`https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users/${userId}`, {
        method: 'DELETE',
    });
    
    const data = await response.json();
    alert('User deleted successfully!');
    fetchUsers(); // Reload users after deletion
};

// Fetch Patients and display
const fetchPatients = async () => {
    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/patients');
    const data = await response.json();
    
    const patientsTable = document.querySelector('#patientsTable tbody');
    patientsTable.innerHTML = ''; // Clear existing table rows
    
    data.patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.patientID}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.roomType}</td>
            <td>
                <button class="editBtn" onclick="editPatient(${patient.id})">Edit</button>
                <button class="deleteBtn" onclick="deletePatient(${patient.id})">Delete</button>
            </td>
        `;
        patientsTable.appendChild(row);
    });
};

// Add Patient
const addPatient = async (patientData) => {
    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/patients', {
        method: 'POST',
        body: JSON.stringify({
            patient: patientData
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    alert('Patient added successfully!');
    fetchPatients(); // Reload patients after addition
};

// Delete Patient
const deletePatient = async (patientId) => {
    const response = await fetch(`https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/patients/${patientId}`, {
        method: 'DELETE',
    });
    
    const data = await response.json();
    alert('Patient deleted successfully!');
    fetchPatients(); // Reload patients after deletion
};

// Combined window.onload to fetch both users and patients
window.onload = async () => {
    await fetchUsers();
    await fetchPatients();
};

// Additional functionality: Handle adding new users and patients
const handleAddUser = async () => {
    const username = document.getElementById('newUsername').value;
    const role = document.getElementById('newRole').value;
    const hospitalID = document.getElementById('newHospitalID').value;

    const newUser = {
        username,
        role,
        hospitalID
    };

    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users', {
        method: 'POST',
        body: JSON.stringify({ user: newUser }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    alert('User added successfully!');
    fetchUsers(); // Refresh the users list
};

const handleAddPatient = async () => {
    const patientID = document.getElementById('newPatientID').value;
    const name = document.getElementById('newPatientName').value;
    const age = document.getElementById('newPatientAge').value;
    const roomType = document.getElementById('newRoomType').value;

    const newPatient = {
        patientID,
        name,
        age,
        roomType
    };

    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/patients', {
        method: 'POST',
        body: JSON.stringify({ patient: newPatient }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    alert('Patient added successfully!');
    fetchPatients(); // Refresh the patients list
};


// Function to fetch hospitals and display them
const fetchHospitals = async () => {
    try {
        // Fetch data from the Sheety API
        const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/hospitals');
        const data = await response.json();

        // Select the table body where hospitals will be listed
        const hospitalsTable = document.querySelector('#hospitalsTable tbody');
        hospitalsTable.innerHTML = ''; // Clear existing rows in the table

        // Check if the hospitals array exists and is not empty
        if (data.hospitals && Array.isArray(data.hospitals)) {
            // Loop through each hospital and create a table row for it
            data.hospitals.forEach(hospital => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hospital.name}</td>
                    <td>
                        <button class="editBtn" onclick="editHospital(${hospital.id})">Edit</button>
                        <button class="deleteBtn" onclick="deleteHospital(${hospital.id})">Delete</button>
                    </td>
                `;
                hospitalsTable.appendChild(row);
            });
        } else {
            console.log("No hospitals found.");
        }
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('Failed to load hospitals. Please try again later.');
    }
};

// Function to show the form for adding a new hospital
const showAddHospitalForm = () => {
    document.getElementById('addHospitalForm').style.display = 'block';
};

// Function to hide the form for adding a new hospital
const hideAddHospitalForm = () => {
    document.getElementById('addHospitalForm').style.display = 'none';
};

// Function to add a new hospital
const addHospital = async () => {
    const hospitalName = document.getElementById('hospitalName').value;

    if (!hospitalName) {
        alert("Please enter a hospital name.");
        return;
    }

    const newHospital = {
        name: hospitalName
    };

    try {
        // Send the new hospital data to the Sheety API using the POST method
        const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/hospitals', {
            method: 'POST',
            body: JSON.stringify({
                hospital: newHospital
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        alert('Hospital added successfully!');
        hideAddHospitalForm();
        fetchHospitals(); // Refresh the hospital list after adding
    } catch (error) {
        console.error('Error adding hospital:', error);
        alert('An error occurred while adding the hospital.');
    }
};

// Function to edit a hospital (example function)
const editHospital = (hospitalId) => {
    alert(`Editing hospital with ID: ${hospitalId}`);
};

// Function to delete a hospital
const deleteHospital = async (hospitalId) => {
    try {
        // Send the delete request to Sheety API using DELETE method
        const response = await fetch(`https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/hospitals/${hospitalId}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        alert('Hospital deleted successfully!');
        fetchHospitals(); // Refresh the hospital list after deletion
    } catch (error) {
        console.error('Error deleting hospital:', error);
        alert('An error occurred while deleting the hospital.');
    }
};

// Call fetchHospitals when the page loads to show the existing hospitals
window.onload = async () => {
    await fetchHospitals();
};


