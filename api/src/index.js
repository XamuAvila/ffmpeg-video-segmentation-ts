import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { initRoutes } from './routes/index.js';

const app = express();

initRoutes(app)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App listening on ${PORT} 🚀`);
})
