import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main API Route
app.use('/api', apiRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PDF QnA Server running on port ${PORT}`);
});
