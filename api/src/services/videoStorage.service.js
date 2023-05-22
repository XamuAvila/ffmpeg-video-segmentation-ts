
import { exec } from 'child_process';
import path from 'path';
import { getShPath } from '../utils/utils.js';
const regex = /file:(\\+)/g;

const extractAudioFromUploads = async (folderName) => {
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

const convertVideos = async (folderName, width, height, res)=>{
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

export {
    extractAudioFromUploads,
    convertVideos
}
