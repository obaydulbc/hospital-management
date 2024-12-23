const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// File Paths
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const hospitalsFilePath = path.join(__dirname, 'data', 'hospitals.json');

// Fetch all users
app.get('/api/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        res.json(JSON.parse(data));
    });
});

// Fetch users by hospital ID
app.get('/api/users/:hospitalId', (req, res) => {
    const hospitalId = parseInt(req.params.hospitalId);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(data);
        const hospitalUsers = users.filter(user => user.hospitalId === hospitalId);
        res.json(hospitalUsers);
    });
});

// Add a new user
app.post('/api/users', (req, res) => {
    const { hospitalId, username, password, role } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(data);
        const userExists = users.some(user => user.hospitalId === hospitalId && user.username === username);

        if (userExists) {
            return res.status(400).send('User already exists in this hospital');
        }

        const newUser = { hospitalId, username, password, role };
        users.push(newUser);

        // Write updated users data to file
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error saving user data');
            }
            res.status(201).send('User added successfully');
        });
    });
});

// Fetch all hospitals
app.get('/api/hospitals', (req, res) => {
    fs.readFile(hospitalsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading hospitals data');
        }
        res.json(JSON.parse(data));
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
