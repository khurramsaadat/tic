const fs = require('fs');
const puppeteer = require('puppeteer');

async function convertSvgToPng() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Read the SVG file
  const svgContent = fs.readFileSync('public/hero-background.svg', 'utf8');
  
  // Set viewport to match SVG dimensions with higher resolution
  await page.setViewport({ 
    width: 1200, 
    height: 1200,
    deviceScaleFactor: 2 // For higher quality
  });
  
  // Set content with proper SVG wrapper
  await page.setContent(`
    <div style="width: 1200px; height: 1200px; background: black;">
      ${svgContent}
    </div>
  `, { waitUntil: 'networkidle0' });
  
  // Take a screenshot with better quality settings
  await page.screenshot({
    path: 'public/hero-background.png',
    omitBackground: false,
    type: 'png'
  });
  
  await browser.close();
  console.log('Conversion completed! PNG file created with high quality settings.');
}

convertSvgToPng().catch(console.error); 