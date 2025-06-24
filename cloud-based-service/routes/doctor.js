const express = require('express');
const router = express.Router();
const authorizeDoctor = require('../middleware/auth');

// Protected route example for doctor
router.get('/dashboard', authorizeDoctor, (req, res) => {
    res.json({ message: 'Welcome Doctor!' });
});

module.exports = router;