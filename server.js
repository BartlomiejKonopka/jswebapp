const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const loadUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    const users = loadUsers();

    if (users.some(user => user.email === email)) {
        return res.status(400).send('User with that email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    saveUsers(users);

    res.status(201).send('User registered successfully.');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const users = loadUsers();
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).send('User with that email does not exist.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Incorrect password.');
    }

    res.status(200).send('Login successful.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
