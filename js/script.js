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
