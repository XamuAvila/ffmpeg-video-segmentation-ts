import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';

function storeVideo(req, res) {
    const tempFilePath = req.file.path;

    // Construct the destination file path by appending the original file name
    const destFilePath = path.join(import.meta.url, '..', 'uploads', req.file.originalname);
  
    // Read the contents of the temporary file using `fs.readFile()`
    fs.readFile(tempFilePath, (err, data) => {
      if (err) throw err;
  
      // Write the contents to the destination file using `fs.writeFile()`
      fs.writeFile(destFilePath, data, (err) => {
        if (err) throw err;
  
        // Send a response back indicating success
        res.status(200).send('File uploaded and saved successfully!');
      });
    });
}

export {
    storeVideo
}
