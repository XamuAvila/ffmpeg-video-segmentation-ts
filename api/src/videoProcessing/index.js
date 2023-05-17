import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { stdin } from 'process';

const regex = /file:(\\+)/g;

async function storeVideo(req, res) {
  const tempFilePath = req.file.path;
  const filename = req.file.originalname.replace(/\.mp4$/, '');
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

    convertVideos(folderName, 640, 480, res)
    extractAudio(folderName);

    res.status(200).json({
      message: "File successfully saved",
      id: folderName
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Oops! Something went wrong');
  }
}

function getShPath(filename) {
  return path.join(import.meta.url, '..', filename).replace(regex, '').replace(/\\/g, '/');
}

async function extractAudio(folderName) {

  const prefixFileName = `./uploads/${folderName}/${folderName}`
  const shPath = getShPath('extract.sh');
  const fullServerPath = path.join(import.meta.url, '..', '..', prefixFileName);
  const savedVideoPath = `${fullServerPath.toString()}.mp4`.replace(regex, '').replace(/\\/g, '/');
  const outputVideoPath = `${fullServerPath.toString()}_audio.mp4`.replace(regex, '').replace(/\\/g, '/');

  try {
    const { stdout, stderr } = exec(`bash ${shPath} ${savedVideoPath} ${outputVideoPath}`);

    console.log(stdout);
    console.error(stderr);
  } catch (err) {
    console.error(err);
  }
}

async function convertVideos(folderName, width, height, res) {

  const prefixFileName = `./uploads/${folderName}/${folderName}`
  const fullServerPath = path.join(import.meta.url, '..', '..', prefixFileName)
  const savedVideoPath = `${fullServerPath.toString()}.mp4`.replace(regex, '').replace(/\\/g, '/');
  const outputVideoPath = `${fullServerPath.toString()}_${height}.mp4`.replace(regex, '').replace(/\\/g, '/');
  const shPath = getShPath('convert.sh');

  try {
    const { stdout } = await exec(`bash ${shPath} ${savedVideoPath} ${outputVideoPath} ${width} ${height}`);

    console.log(stdout);

    if (height < 720) {
      convertVideos(folderName, 1280, 720, res);
    } else if (height < 1080) {
      convertVideos(folderName, 1920, 1080, res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error(err);
  }
}

async function convertVideo(req, res) {
  const videoId = req.body.id;
  const prefixPath = `./src/uploads/${videoId}/${videoId}`;
  const manifestPath = `./src/uploads/${videoId}/manifest`;
  const audioFilePath = `${prefixPath}_audio.mp4`

  if (existsSync(manifestPath)) {
    unlinkSync(manifestPath);
  } else {
    mkdirSync(manifestPath);
  }

  const shPath = getShPath('convertManifest.sh');

  const mp4BoxProcess = exec(`bash ${shPath} ${prefixPath} ${audioFilePath} ${manifestPath}`);

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
}

export {
  storeVideo,
  convertVideo
}
