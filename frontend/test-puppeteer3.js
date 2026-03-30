import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://buildsbyshruti-amazon.vercel.app/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'vercel-screenshot.png' });
  await browser.close();
})();
