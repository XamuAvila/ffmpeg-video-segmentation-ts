import express from "express";
const router = express.Router();
import { convertVideo, storeVideo } from "../VideoList/index.js";
import multer from "multer";

const upload = multer({ dest: './src/uploads' });

function initRoutes(app) {
    router.post('/store', [upload.single('file'), storeVideo])
    router.post('/manifest', convertVideo )
    app.use(router)
}

export {
    initRoutes
}
