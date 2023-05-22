import { exec } from 'child_process';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { convertVideos, extractAudioFromUploads } from '../services/videoStorage.service.js';
import { getShPath } from '../utils/utils.js';

async function storeVideo(req, res) {
    const tempFilePath = req.file.path;
    const filename = req.file.originalname.replace(/\.mp4$/, '').replaceAll('_', '-');
    const now = new Date();
    const dateSuffix = `${now.getUTCHours()}_${now.getUTCMinutes()}_${now.getSeconds()}`;
    const folderName = `${filename}_${dateSuffix}`;
    const folderPath = `./src/uploads/${folderName}`;
    const videoName = `${filename}_${dateSuffix}.mp4`;
    const destFilePath = `${folderPath}/${videoName}`;


    try {
        await fs.mkdir(folderPath);
        await fs.copyFile(tempFilePath, destFilePath);
        await fs.unlink(tempFilePath);

        convertVideos(folderName, 640, 480, res);
        extractAudioFromUploads(folderName);

        res.status(200).json({
            message: "File successfully saved",
            id: folderName
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Oops! Something went wrong');
    }
}

async function convertVideo(req, res) {
    const videoId = req.body.id;
    const prefixPath = `./src/uploads/${videoId}/${videoId}`;
    const manifestPath = `./src/uploads/${videoId}/manifest`;

    if (!existsSync(manifestPath)) {
        mkdirSync(manifestPath);
    }

    const shPath = getShPath('convertManifest.sh');

    const mp4BoxProcess = exec(`bash ${shPath} ${prefixPath}_480.mp4 ${prefixPath}_720.mp4 ${prefixPath}_1080.mp4 ${prefixPath}_audio.mp4   ${manifestPath}`);

    console.info("WRITING MANIFEST DATA");

    mp4BoxProcess.stdout.on('data', (data) => {
        console.log(data)
    })

    mp4BoxProcess.stdin.on('data', (data) => {
        console.log(data);
    })

    mp4BoxProcess.stderr.on('data', (msg) => {
        console.log(msg.toString());
    })

    mp4BoxProcess.on('close', () => {
        mp4BoxProcess.kill();
        res.status(200).send('Manifest generated successfully');
    })

    mp4BoxProcess.on('error', (error) => {
        console.error(error);
        res.status(500).json({
            message: 'An error has ocurred during manifest creation process, please try again'
        });
    })
}

export {
    storeVideo,
    convertVideo
}
