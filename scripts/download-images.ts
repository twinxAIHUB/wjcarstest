import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  {
    url: 'https://example.com/mercedes-amg-gt.jpg',
    filename: 'mercedes-amg-gt.jpg'
  },
  {
    url: 'https://example.com/rolls-royce-phantom.jpg',
    filename: 'rolls-royce-phantom.jpg'
  },
  {
    url: 'https://example.com/rolls-royce-spectre.jpg',
    filename: 'rolls-royce-spectre.jpg'
  },
  {
    url: 'https://example.com/lexus-lc-500.jpg',
    filename: 'lexus-lc-500.jpg'
  },
  {
    url: 'https://example.com/audi-a8.jpg',
    filename: 'audi-a8.jpg'
  },
  {
    url: 'https://example.com/mercedes-s-class.jpg',
    filename: 'mercedes-s-class.jpg'
  }
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve());
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

async function downloadAllImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const vehiclesDir = path.join(publicDir, 'vehicles');

  // Create directories if they don't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  if (!fs.existsSync(vehiclesDir)) {
    fs.mkdirSync(vehiclesDir);
  }

  console.log('Starting to download images...');

  for (const image of images) {
    const filepath = path.join(vehiclesDir, image.filename);
    try {
      await downloadImage(image.url, filepath);
      console.log(`Downloaded: ${image.filename}`);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error);
    }
  }

  console.log('Finished downloading images!');
}

// Only run if this file is being executed directly
if (require.main === module) {
  downloadAllImages();
} 