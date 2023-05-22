import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { initRoutes } from './routes/index.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: '*'
}));

app.use(express.json());

initRoutes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App listening on ${PORT} 🚀`);
});
