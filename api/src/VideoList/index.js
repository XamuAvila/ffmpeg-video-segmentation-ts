import multer from 'multer';
import { exec, spawn } from 'node:child_process';
import fs, { mkdirSync } from 'node:fs';
import path from 'node:path';

function storeVideo(req, res) {
  const tempFilePath = req.file.path;
  // Construct the destination file path by appending the original file name
  // const destFilePath = path.join(import.meta.url, '..', 'uploads', req.file.originalname);
  const filename = req.file.originalname.replaceAll('.mp4', '');
  const now = new Date();
  const dateSuffix = `${now.getUTCHours().toString()}_${now.getUTCMinutes().toString()}_${now.getSeconds().toString()}`;
  const folderName = `${filename}_${dateSuffix}`;
  const folderPath = `./src/uploads/${folderName}`;
  const videoName = `${req.file.originalname.replaceAll('.mp4', '')}_${dateSuffix}`
  let destFilePath = `${folderPath}/${videoName}.mp4`;

  mkdirSync(folderPath);
  // Read the contents of the temporary file using `fs.readFile()`
  fs.readFile(tempFilePath, (err, data) => {
    if (err) throw err;

    // Write the contents to the destination file using `fs.writeFile()`
    fs.writeFile(destFilePath, data, (err) => {
      if (err) throw err;
      fs.unlink(tempFilePath, (err) => {
        if (err) console.log(err);
      });

      convertVideos(folderName, 640, 480)
      
      // Send a response back indicating success
      res.status(200).send('File uploaded and saved successfully!');
    });
  });
}

async function convertVideos(folderName, width, height){
  const regex = /file:(\\+)/g;
  const prefixFileName = `./uploads/${folderName}/${folderName}`
  const fullServerPath = path.join(import.meta.url, '..', '..', prefixFileName)
  const savedVideoPath = `${fullServerPath.toString()}.mp4`.replace(regex, '').replace(/\\/g, '/');
  const outputVideoPath = `${fullServerPath.toString()}_${height}.mp4`.replace(regex, '').replace(/\\/g, '/');
  const shPath = path.join(import.meta.url, '..', "convert.sh").replace(regex, '').replace(/\\/g, '/');
  const fullHdProcess = exec(`bash ${shPath} ${savedVideoPath} ${outputVideoPath} ${width} ${height}`);
  console.log(`Trying to convert to ${height}`)

  fullHdProcess.stdout.on('data', (data)=>{
    console.log(data)
  })



  fullHdProcess.on('exit', ()=>{
    console.info("Video conversion Finished: ", `${width}x${height}`)
    switch(height){
      case 480:
        convertVideos(folderName, 1280, 720)
        break;
      case 720:
        // convertVideos(folderName, 1920, 1080)
        break;
    }
  })
  return;
}

export {
  storeVideo
}
