import { NextFunction, Request, Response } from "express";
import Logging from "../../library/Logging";
import puppeteer from "puppeteer";

const basicLoad = async (req: Request, res: Response, next: NextFunction) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/profile");

  const element = await page.waitForSelector('div[class="profile"] h1');
  if (element) {
    const text = await page.evaluate((element) => element.textContent, element);
    Logging.info(`Processed page and got this result: ${text}`);
    await browser.close();
    return res.status(200).json({ result: text });
  }
  await browser.close();
  return res.status(404).json({ result: "The script has finished and the browser is closed" });
};
export default { basicLoad };
