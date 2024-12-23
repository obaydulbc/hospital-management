const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Static Files Middleware (Serve files from "public" folder)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/users', (req, res) => {
    const usersPath = path.join(__dirname, 'data', 'users.json');
    fs.readFile(usersPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/hospitals', (req, res) => {
    const hospitalsPath = path.join(__dirname, 'data', 'hospitals.json');
    fs.readFile(hospitalsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading hospitals data');
        }
        res.json(JSON.parse(data));
    });
});

// Default Route to Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
