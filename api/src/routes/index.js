import express from "express";
const router = express.Router();
import { storeVideo } from "../VideoList/index.js";
import multer from "multer";

const upload = multer({ dest: '/src/uploads' });

function initRoutes(app) {
    router.post('/store', [upload.single('file'), storeVideo])
    app.use(router)
}

export {
    initRoutes
}
