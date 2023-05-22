import path from 'path';

const getShPath = (filename) => {
    const regex = /file:(\\+)/g;
    return path.join(import.meta.url, '..', '..', 'scripts', filename).replace(regex, '').replace(/\\/g, '/');
}

export {
    getShPath
}
