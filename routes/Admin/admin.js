// routes/admin.js
const express = require('express');
const pool = require('../db'); // Import the pool connection
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load questions and answers from JSON file
const questionsAndAnswers = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
questionsFilePath = 'questions.json'
// Setup database
router.post('/setup-database', async (req, res) => {
  const client = await pool.connect();
  try {
    // Insert questions, flags, and other fields
    for (const qa of questionsAndAnswers) {
      await client.query(
        `INSERT INTO questions (challenge_name, question, flag, category, points, hints) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT DO NOTHING`,
        [qa.challenge_name, qa.question, qa.flag, qa.category, qa.points, qa.hints]
      );
    }

    res.status(200).json({ message: 'Database setup complete' });
  } catch (err) {
    console.error('Error setting up database:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Helper function to save questions to JSON file
function saveQuestionsToFile() {
  fs.writeFileSync(questionsFilePath, JSON.stringify(questionsAndAnswers, null, 2), 'utf8');
}

// Endpoint to create a new question
router.post('/create-question', async (req, res) => {
  const { challenge_name, question, flag, category, points, hints } = req.body;

  // Validate the input
  if (!challenge_name || !question || !flag || !category || !points || !hints || !Array.isArray(hints)) {
    return res.status(400).json({ error: 'Invalid input, please provide all required fields.' });
  }

  // Create a new question object
  const newQuestion = {
    challenge_name,
    question,
    flag,
    category,
    points: parseInt(points),
    hints,
  };

  // Add the new question to the array
  questionsAndAnswers.push(newQuestion);

  // Save the updated questions array to the JSON file
  saveQuestionsToFile();

  const client = await pool.connect();
  try {
    // Insert the updated questions into the database
    for (const qa of questionsAndAnswers) {
      await client.query(
        `INSERT INTO questions (challenge_name, question, flag, category, points, hints) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
        [qa.challenge_name, qa.question, qa.flag, qa.category, qa.points, qa.hints]
      );
    }

    res.status(201).json({ message: 'Question created and database reloaded successfully', question: newQuestion });
  } catch (err) {
    console.error('Error reloading database:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});


// Add other admin-related endpoints here...

module.exports = router;
