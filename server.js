const express = require('express');
const path = require("path");
const api = require('./routes/notes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', api);

// Routes
app.get('/notes', (req, res) => res.status(200).sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res) => res.status(200).sendFile(path.join(__dirname, '/public/index.html')));

// Start API
app.listen(PORT, () => console.log(`Application running on PORT ${PORT}`));