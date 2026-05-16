const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = 'C:/Users/hashm/.gemini/antigravity/brain/44fa5a07-142c-44ce-8121-609934e2326a/s1_anchor_1_1778947102802.png';
const outputImagePath = 'valid_anchor.webp';

sharp(inputImagePath)
  .resize({ width: 1024 })
  .webp({ quality: 40 })
  .toFile(outputImagePath)
  .then(info => {
    console.log('Converted anchor size:', info.size);
    const imagesDir = 'images';
    let count = 0;
    function walkDir(dir) {
        fs.readdirSync(dir).forEach(f => {
            let dirPath = path.join(dir, f);
            if (fs.statSync(dirPath).isDirectory()) {
                walkDir(dirPath);
            } else if (f.endsWith('.webp')) {
                fs.copyFileSync(outputImagePath, dirPath);
                count++;
            }
        });
    }
    walkDir(imagesDir);
    console.log('Successfully copied valid webp to', count, 'files');
  });
