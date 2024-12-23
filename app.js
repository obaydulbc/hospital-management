document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const hospitalName = document.getElementById('hospitalName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Fetch data from GitHub (JSON files)
    const response = await fetch('data/users.json');
    const users = await response.json();

    // Find if the user exists for the given hospital
    const user = users.find(user => user.hospitalName === hospitalName && user.username === username && user.password === password);

    if (user) {
        window.location.href = '/dashboard.html'; // Redirect to dashboard
    } else {
        document.getElementById('error').style.display = 'block';
    }
});
