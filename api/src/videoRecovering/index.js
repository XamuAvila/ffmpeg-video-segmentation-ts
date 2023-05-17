import fs, { existsSync } from 'fs';
import path from 'path';

async function getVideo(req, res, next) {
    const regex = /file:(\\+)/g;
    res.setHeader('Content-Type', 'application/dash+xml');
    
    const videoId = req.params.videoId;
    let cleanFileName = '';
    let filename = '';
    let nameWithoutResolution = '';

    if (videoId.includes('audio_dashinit.mp4')) {
        cleanFileName = videoId.replace('_audio_dashinit.mp4', '');
        nameWithoutResolution = cleanFileName.replace(/_(480|720|1080)$/, '')
        filename = `./src/uploads/${nameWithoutResolution}/manifest/${cleanFileName}_audio_dashinit.mp4`
    } else if (videoId.includes('dashinit.mp4')) {
        cleanFileName = videoId.replace('_dashinit.mp4', '');
        nameWithoutResolution = cleanFileName.replace(/_(480|720|1080)$/, '')
        filename = `./src/uploads/${nameWithoutResolution}/manifest/${cleanFileName}_dashinit.mp4`
    } else if (videoId.includes("audio_dash") && videoId.includes("m4s")) {
        cleanFileName = videoId.split('_').filter((el, index)=> index <= 3).join('_');
        nameWithoutResolution = cleanFileName.replace(/_(480|720|1080)$/, '')
        filename = `./src/uploads/${nameWithoutResolution}/manifest/${videoId}`
    }else if(videoId.includes("dash") && videoId.includes("m4s")){
        cleanFileName = videoId.split('_').filter((el, index)=> index <= 3).join('_');
        nameWithoutResolution = cleanFileName.replace(/_(480|720|1080)$/, '')
        filename = `./src/uploads/${nameWithoutResolution}/manifest/${videoId}`
    }else {
        cleanFileName = videoId;
        filename = `./src/uploads/${cleanFileName}/manifest/video.mpd`
    }

    // if(!existsSync(filename)){
    //     const validHd = `./src/uploads/${nameWithoutResolution}/manifest/${videoId}`.replace(/(480|180)$/, '720')
    //     const validFullHd = `./src/uploads/${nameWithoutResolution}/manifest/${videoId}`.replace(/(480|720)$/, '1080')
    //     const validStandard = `./src/uploads/${nameWithoutResolution}/manifest/${videoId}`.replace(/(480|1080)$/, '480')
    //     if(existsSync(validHd)){
    //         filename = validHd
    //     }else if(existsSync(validFullHd)){
    //         filename = validFullHd;
    //     }else if(existsSync(validStandard)){
    //         filename = validStandard;
    //     }else{
    //         throw new Error('lala')
    //     }
    // }

    // const filePath = path.join(import.meta.url, '..', '..', 'uploads', 'video_23_40_9', 'manifest', 'video.mpd').replace(regex, '');
    // res.sendFile(filePath);


    // if(!fs.existsSync(videoManifestPath)){
    //     res.status(404).json({
    //         message: 'Manifest folder not found, please generate it on POST /manifest'
    //     })
    // }


    res.header('Content-Type', 'application/xml');

    res.header('Content-Disposition', `attachment; filename=video.mpd`);

    // Create a read stream for the mpd file
    const mpdStream = fs.createReadStream(filename);

    // Pipe the stream to the response object
    mpdStream.pipe(res);
}

export {
    getVideo
}
