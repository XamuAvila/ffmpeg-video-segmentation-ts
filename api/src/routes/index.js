import express from "express";
const router = express.Router();
import * as videoStorageController from '../controllers/videoStorage.controller.js'
import * as videoRecoveringController from '../controllers/videoRecovering.controller.js'
import multer from "multer";

const upload = multer({ dest: './src/uploads' });

function initRoutes(app) {
    router.post('/store', [upload.single('file'), videoStorageController.storeVideo]);
    router.post('/manifest', videoStorageController.convertVideo);
    router.get('/:videoId', videoRecoveringController.getVideo);
    router.get('/videos/:segment', videoRecoveringController.getSegment);
    app.use(router)
}

export {
    initRoutes
}
