import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('assets');
const folders = ['js', 'css', 'audio', 'images', 'json', 'html'];

folders.forEach(folder => {
  const dir = path.join(ASSETS_DIR, folder);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    // If file has hash like _2391645a or _46817026 or _6f74928b
    if (/_([a-f0-9]{7,36})\./i.test(file)) {
      console.log(`Deleting hashed duplicate: ${folder}/${file}`);
      fs.unlinkSync(path.join(dir, file));
    }
  });
});

console.log('Cleanup complete!');
