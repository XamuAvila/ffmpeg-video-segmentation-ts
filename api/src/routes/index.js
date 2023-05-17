import express from "express";
const router = express.Router();
import { convertVideo, storeVideo } from "../videoProcessing/index.js";
import multer from "multer";
import { getVideo } from "../videoRecovering/index.js";

const upload = multer({ dest: './src/uploads' });

function initRoutes(app) {
    router.post('/store', [upload.single('file'), storeVideo]);
    router.post('/manifest', convertVideo );
    router.get('/:videoId', getVideo)
    app.use(router)
}

export {
    initRoutes
}
