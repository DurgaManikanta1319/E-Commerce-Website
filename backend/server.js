const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory Database for Users
const users = [];

// API Routes
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    res.json({ success: true, message: 'Registration successful!', user: { name: newUser.name, email: newUser.email } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email } });
});

// Products Route
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Sourdough Bread', price: 6.99, image: 'assets/p-bread.jpg' },
            { id: 2, name: 'Avocado', price: 2.50, image: 'assets/p-avocado.jpg' },
            { id: 3, name: 'Organic Milk', price: 4.20, image: 'assets/p-milk.jpg' },
            { id: 4, name: 'Strawberries', price: 5.99, image: 'assets/p-strawberry.jpg' }
        ]
    });
});

// Fallback to index.html for SPA if needed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
