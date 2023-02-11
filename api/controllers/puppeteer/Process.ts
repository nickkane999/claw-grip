import { NextFunction, Request, Response } from "express";
import puppeteer, { Browser, Page } from "puppeteer";
import ClawGrip from "./ClawGripClass";

type PuppeteerInfoOutput = {
  browser: Browser;
  page: Page;
  result: boolean | null | [string, any];
};

const process = async (req: Request, res: Response, next: NextFunction) => {
  const actions = req.body.actions;
  console.log(actions);
  let clawGrip = new ClawGrip();
  await clawGrip.launch();
  const { browser, page } = clawGrip.info;
  let results: any = [];

  for (const action of actions) {
    console.log(action);
    const { type, url } = action;
    url && ((await page.goto(url)) as Page);

    let actionResult = (await clawGrip[type](action)) as PuppeteerInfoOutput;
    actionResult.result && results.push(actionResult.result);
  }
  await browser.close();
  return res.status(404).json({ result: results });
};

const processClient = async (req: Request, res: Response, next: NextFunction) => {
  const data = JSON.parse(req.body.script);
  const actions = data.actions;
  console.log(actions);
  let clawGrip = new ClawGrip();
  await clawGrip.launch();
  const { browser, page } = clawGrip.info;
  let results: any = [];

  for (const action of actions) {
    console.log(action);
    const { type, url } = action;
    url && ((await page.goto(url)) as Page);

    let actionResult = (await clawGrip[type](action)) as PuppeteerInfoOutput;
    actionResult.result && results.push(actionResult.result);
  }
  await browser.close();
  return res.status(404).json({ result: results });
};

export { process, processClient };
