// app.js
const express = require('express');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/Admin/admin');
const mainRoutes = require('./routes/Main/main');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the routes
app.use('/admin', adminRoutes);
app.use('/', mainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
