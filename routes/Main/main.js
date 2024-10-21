// routes/index.js
const express = require('express');
const pool = require('../db'); // Import the pool connection
const router = express.Router();

router.post('/check-flag', async (req, res) => {
  const { question, flag } = req.body;

  if (!question || typeof flag !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await pool.query(
      'SELECT flag FROM questions WHERE question = $1',
      [question]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correctAnswer = result.rows[0].flag;
    const isCorrect = flag.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
