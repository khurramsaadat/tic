const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateSocialImage() {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to 16:9 aspect ratio
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2,
  });

  // Create a simple HTML template
  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
          }
          .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.15;
            z-index: 1;
          }
          .content {
            position: relative;
            z-index: 2;
            padding: 2rem;
          }
          h1 {
            font-size: 72px;
            margin: 0 0 20px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          p {
            font-size: 32px;
            margin: 0;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="data:image/svg+xml;base64,${await fs.readFile(path.join(__dirname, '../public/hero-background.svg'), 'base64')}" class="background" />
          <div class="content">
            <h1>TicTacToe</h1>
            <p>Play with friends or challenge our AI!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Set content and wait for render
  await page.setContent(html);
  
  // Wait for any animations to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Take screenshot
  const screenshot = await page.screenshot({
    type: 'png',
    encoding: 'binary',
  });

  // Close browser
  await browser.close();

  // Optimize image with sharp
  await sharp(screenshot)
    .resize(1200, 630)
    .toFormat('png')
    .toFile(path.join(__dirname, '../public/social-preview.png'));

  console.log('Social preview image generated successfully!');
}

generateSocialImage().catch(console.error); 