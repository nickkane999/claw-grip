import { NextFunction, Request, Response } from "express";
import Logging from "../../library/Logging";
import puppeteer, { Browser, Page } from "puppeteer";
import { selectButtonParams, pullTextParams, pullTextListParams } from "./ClawGripTypes";

//console.log(req.body);

function sleep(ms) {
  const end = new Date().getTime() + ms;
  while (new Date().getTime() <= end) {}
}

const selectButton = async (req: Request, res: Response, next: NextFunction, data: selectButtonParams, info: PuppeteerInfoInput) => {
  Logging.info(`Processing Select Button Function`);
  const { selector, url } = data;
  const { browser, page } = info;
  url && (await page.goto(url));

  const element: any = await page.waitForSelector(selector);
  if (element) {
    await page.click(selector);
    Logging.info(`Clicked button with selector: ${selector}`);
    const url = await page.url();
    return { browser, page, result: [url, true] };
  }
  return { browser, page, result: false };
};

const pullContent = async (req: Request, res: Response, next: NextFunction, data: pullTextParams, info: PuppeteerInfoInput) => {
  Logging.info(`Showing data: ${data}`);
  Logging.info(`Processing Pull Text Function`);
  const { selector, url, format, attribute } = data;
  const { browser, page } = info;
  url && (await page.goto(url));

  const textSection = await page.waitForSelector(selector);
  if (textSection) {
    const text = await page.evaluate((element) => {
      if (format === "text") return element.textContent;
      else {
        if (attribute && element.hasAttribute(attribute)) return element.getAttribute("src");
      }
    }, textSection);
    Logging.info(`Processed page and got this result: ${text}`);
    const url = await page.url();
    return { browser, page, result: [url, text] };
  }
  return { browser, page, result: false };
};

const pullContentAll = async (req: Request, res: Response, next: NextFunction, data: pullTextListParams, info: PuppeteerInfoInput) => {
  const { selector, url, format, attribute } = data;
  const { browser, page } = info;
  url && (await page.goto(url));
  console.log("My format");
  console.log(format);

  const textSection = await page.waitForSelector(selector);
  const elements = await page.$$(selector);
  if (elements.length) {
    const text = await Promise.all(
      elements.map(async (element) => {
        return await page.evaluate(
          (el, format, attribute) => {
            console.log(format);
            if (format === "text") return el.textContent;
            else {
              if (attribute && el.hasAttribute(attribute)) return el.getAttribute(attribute);
            }
          },
          element,
          format,
          attribute
        );
      })
    );
    Logging.info(`Processed page and got these results: ${text}`);
    const url = await page.url();
    return { browser, page, result: [url, text] };
  }
  return { browser, page, result: false };
};

const pullPageHTML = async (req: Request, res: Response, next: NextFunction, data: pullTextParams, info: PuppeteerInfoInput) => {
  Logging.info(`Processing Pull HTML Function`);
  const { url } = data;
  const { browser, page } = info;
  await page.waitForSelector("body");
  url && (await page.goto(url));

  const html = await page.evaluate(() => document.documentElement.outerHTML);
  Logging.info(`Processed page and got this result: ${html}`);
  const pageUrl = await page.url();
  return { browser, page, result: [pageUrl, html] };
};

type PuppeteerInfoInput = {
  browser: Browser;
  page: Page;
};
type PuppeteerInfoOutput = {
  browser: Browser;
  page: Page;
  result: boolean | null | [string, any];
};
const functions = {
  selectButton,
  pullContent,
  pullContentAll,
  pullPageHTML,
};

const process = async (req: Request, res: Response, next: NextFunction) => {
  const actions = req.body.actions;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const info = { browser, page };
  //console.log("I am here1");
  let results: any = [];

  for (const action of actions) {
    const { type, selector, url, format, attribute } = action;
    url && (await page.goto(url));

    let actionResult = (await functions[type](req, res, next, action, info)) as PuppeteerInfoOutput;
    actionResult.result && results.push(actionResult.result);
  }
  await browser.close();
  return res.status(404).json({ result: results });
};

export default { selectButton, pullContent, pullContentAll, process };
