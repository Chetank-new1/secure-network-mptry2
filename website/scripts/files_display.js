const fs = require('fs');
const path = require('path');

const baseDir = './files';

function listFiles(type, callback) {
    const dir = path.join(baseDir, type);
    
    fs.readdir(dir, (err, files) => {
        if (err) {
            callback({ success: false, message: 'Error fetching files.' });
        } else {
            const fileList = files.map(file => ({
                name: file,
                downloadLink: `/files/${type}/${file}`
            }));
            callback({ success: true, files: fileList });
        }
    });
}

module.exports = { listFiles };
