import { NextFunction, Request, Response } from "express";
import Logging from "../../library/Logging";
import puppeteer, { Browser, Page } from "puppeteer";
import { selectButtonParams, pullTextParams, pullTextListParams } from "./ClawGripTypes";

//console.log(req.body);

const selectButton = async (req: Request, res: Response, next: NextFunction, data: selectButtonParams, info: PuppeteerInfoInput): Promise<PuppeteerInfoOutput> => {
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

const pullText = async (req: Request, res: Response, next: NextFunction, data: pullTextParams, info: PuppeteerInfoInput): Promise<PuppeteerInfoOutput> => {
  Logging.info(`Processing Pull Text Function`);
  const { selector, url } = data;
  const { browser, page } = info;
  url && (await page.goto(url));

  const textSection = await page.waitForSelector(selector);
  if (textSection) {
    const text = await page.evaluate((element) => element.textContent, textSection);
    Logging.info(`Processed page and got this result: ${text}`);
    const url = await page.url();
    return { browser, page, result: [url, text] };
  }
  return { browser, page, result: false };
};

const pullTextList = async (req: Request, res: Response, next: NextFunction, data: pullTextListParams, info: PuppeteerInfoInput): Promise<PuppeteerInfoOutput> => {
  Logging.info(`Processing Pull Text List Function`);
  const { selector, url } = data;
  const { browser, page } = info;
  url && (await page.goto(url));

  const textSection = await page.waitForSelector(selector);
  if (textSection) {
    const text = await page.evaluate((element) => element.textContent, textSection);
    Logging.info(`Processed page and got this result: ${text}`);
    const url = await page.url();
    return { browser, page, result: [url, text] };
  }
  return { browser, page, result: false };
};

type Functions = {
  selectButton: (req: Request, res: Response, next: NextFunction, data: selectButtonParams, info: PuppeteerInfoInput) => Promise<PuppeteerInfoOutput>;
  pullText: (req: Request, res: Response, next: NextFunction, data: pullTextParams, info: PuppeteerInfoInput) => Promise<PuppeteerInfoOutput>;
  pullTextList: (req: Request, res: Response, next: NextFunction, data: pullTextListParams, info: PuppeteerInfoInput) => Promise<PuppeteerInfoOutput>;
};
type PuppeteerInfoInput = {
  browser: Browser;
  page: Page;
};
type PuppeteerInfoOutput = {
  browser: Browser;
  page: Page;
  result: boolean | null | [string, string | boolean | null];
};
const functions: Functions = {
  selectButton,
  pullText,
  pullTextList,
};

const process = async (req: Request, res: Response, next: NextFunction) => {
  const actions = req.body.actions;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const info = { browser, page };
  //console.log("I am here1");
  let results = [];

  for (const action of actions) {
    const { type, selector, url }: { type: string; selector: string; url: string } = action;
    url && (await page.goto(url));

    /* allow typescript bellow */
    // @ts-ignore
    let actionResult = await functions[type](req, res, next, action, info);
    results.push(actionResult.result);
  }
  await browser.close();
  return res.status(404).json({ result: results });
};

export default { selectButton, pullText, pullTextList, process };
