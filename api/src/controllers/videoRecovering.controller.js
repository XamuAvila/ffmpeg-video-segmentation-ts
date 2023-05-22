import path from 'path';

const getVideo = async (req, res) => {
    res.setHeader('Content-Type', 'application/dash+xml');
    const videoId = req.params.videoId;
    let cleanFileName = videoId.split('_').filter((el, index) => index <= 3).join('_');
    let filename = `./src/uploads/${cleanFileName}/manifest/video.mpd`
    const fullPath = path.resolve(filename);
    res.sendFile(fullPath);
}

const getSegment = async (req, res) => {
    const { segment } = req.params;
    res.setHeader('Content-Type', 'application/dash+xml');
    const cleanFileName = segment.split('_').filter((el, index) => index <= 3).join('_');
    const filePath = path.resolve(`./src/uploads/${cleanFileName}/manifest/${segment}`)
    res.sendFile(filePath);
}

export {
    getVideo,
    getSegment
}
