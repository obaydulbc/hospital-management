// Fetch users and populate table (as an example)
const fetchUsers = async () => {
    const response = await fetch('https://api.sheety.co/a1fb732c37f9b3a9db1c885ad5ff8c0d/hospitalManagementSystem/users');
    const data = await response.json();
    const usersTable = document.querySelector('#usersTable tbody');
    
    data.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.hospitalID}</td>
        `;
        usersTable.appendChild(row);
    });
};

fetchUsers();
