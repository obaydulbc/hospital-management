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
