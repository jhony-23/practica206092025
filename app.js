import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor SOCANDO en http://localhost:${PORT}`);
});