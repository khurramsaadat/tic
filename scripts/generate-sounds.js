const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(process.cwd(), 'public', 'sounds');

// Ensure sounds directory exists
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

// Generate sound files using ffmpeg
const sounds = [
  {
    name: 'place',
    command: `-f lavfi -i "sine=frequency=800:duration=0.05" -af "envelope=attack=0.005:decay=0.05" -c:a libmp3lame -q:a 2`,
  },
  {
    name: 'win',
    command: `-f lavfi -i "sine=frequency=1000:duration=0.3" -af "envelope=attack=0.01:decay=0.3" -c:a libmp3lame -q:a 2`,
  },
  {
    name: 'draw',
    command: `-f lavfi -i "sine=frequency=600:duration=0.2" -af "envelope=attack=0.01:decay=0.2" -c:a libmp3lame -q:a 2`,
  },
  {
    name: 'invalid',
    command: `-f lavfi -i "sine=frequency=200:duration=0.1" -af "envelope=attack=0.01:decay=0.1" -c:a libmp3lame -q:a 2`,
  },
];

async function generateSound(name, ffmpegCommand) {
  const outputPath = path.join(SOUNDS_DIR, `${name}.mp3`);
  const command = `ffmpeg -y ${ffmpegCommand} "${outputPath}"`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating ${name}.mp3:`, stderr);
        reject(error);
      } else {
        console.log(`Generated ${name}.mp3`);
        resolve();
      }
    });
  });
}

// Generate all sounds
async function generateAllSounds() {
  try {
    await Promise.all(sounds.map(sound => generateSound(sound.name, sound.command)));
    console.log('All sound files generated successfully!');
  } catch (error) {
    console.error('Error generating sound files:', error);
    process.exit(1);
  }
}

generateAllSounds(); 