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
