const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const destinationRoutes = require('./routes/destinationRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/destinations', destinationRoutes);
app.get('/health', (req, res) => res.json({ status: "UP" }));

// Start server
app.listen(PORT, () => {
  console.log(`Destination Service running on port ${PORT}`);
});
