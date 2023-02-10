import { NextFunction, Request, Response } from "express";
import Logging from "../../library/Logging";
import puppeteer, { Browser, Page } from "puppeteer";
import { selectButtonParams, pullTextParams, pullTextListParams, pullLinkListParams, saveDataParams } from "./ClawGripTypes";
import fs from "fs";

class ClawGrip {
  info = {
    browser: Browser as any,
    page: Page as any,
    functions: {
      selectButton: this.selectButton,
      pullContent: this.pullContent,
      pullContentAll: this.pullContentAll,
      pullPageHTML: this.pullPageHTML,
    },
    data: {
      linkList: [] as string[],
      displayInfo: [] as any,
    },
  };

  constructor() {
    //this.init();
  }

  async launch() {
    this.info.browser = await puppeteer.launch({ headless: true });
    this.info.page = (await this.info.browser.newPage()) as Page;
  }

  async close() {
    await this.info.browser.close();
  }

  async selectButton(data: selectButtonParams) {
    Logging.info(`Processing Select Button Function`);
    const { selector, url } = data;
    const { browser, page } = this.info;
    url && (await page.goto(url));

    const element: any = await page.waitForSelector(selector);
    if (element) {
      await page.click(selector);
      Logging.info(`Clicked button with selector: ${selector}`);
      const url = await page.url();
      return { browser, page, result: [url, true] };
    }
    return { browser, page, result: false };
  }

  async pullContent(data: pullTextParams) {
    Logging.info(`Processing Pull Content Function`);
    const { selector, url, format, attribute } = data;
    const { browser, page } = this.info;
    url && (await page.goto(url));

    const textSection = await page.waitForSelector(selector);
    if (textSection) {
      const text = await page.evaluate(
        (element, format, attribute) => {
          if (format === "text") return element.textContent;
          else {
            if (attribute && element.hasAttribute(attribute)) return element.getAttribute("src");
          }
        },
        textSection,
        format,
        attribute
      );
      Logging.info(`Processed page and got this result: ${text}`);
      const url = await page.url();
      return { browser, page, result: [url, text] };
    }
    return { browser, page, result: false };
  }

  async pullContentAll(data: pullTextListParams) {
    const { selector, url, format, attribute, setLinkList } = data;
    const { browser, page } = this.info;
    url && (await page.goto(url));

    await page.waitForSelector(selector);
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
      if (setLinkList) this.info.data.linkList = text;
      return { browser, page, result: [url, text] };
    }
    return { browser, page, result: false };
  }
  async pullPageHTML(data: any) {
    Logging.info(`Processing Pull Page HTML Function`);
    const { url } = data;
    const { browser, page } = this.info;
    url && (await page.goto(url));

    const html = await page.content();
    Logging.info(`Got the following html content: ${html}`);
    return { browser, page, result: [url, html] };
  }

  async processLinks(data: pullLinkListParams) {
    console.log("Processing Links");
    const { baseUrl, type, loopAction } = data;
    const { browser, page } = this.info;
    let linkList = this.info.data.linkList;
    if (linkList.length) {
      let results: any = [];
      let count = 0;

      for (const link of linkList) {
        let newLink = !baseUrl ? link : baseUrl + link;
        //link && ((await page.goto(newLink)) as Page);
        loopAction.url = newLink;
        let actionResult = (await this[loopAction.type](loopAction)) as PuppeteerInfoOutput;
        actionResult.result && results.push(actionResult.result);
        count++;
        if (count === 5) break;
      }
      this.info.data.displayInfo = results;
      return { browser, page, result: [baseUrl, results] };
    }
    return { browser, page, result: false };
  }

  async loadJSONFile(filename: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./${filename}`, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        const json = JSON.parse(data);
        resolve(json);
      });
    });
  }

  async resultToCSV(data: saveDataParams, json: any) {
    let csv = data.headString;
    console.log(json);
    if (json) {
      let info = json.result[1];
      console.log(info);
      for (let i = 0; i < info.length; i++) {
        csv += info[i][0] + ", ";
        for (let j = 0; j < info[i][1].length; j++) {
          csv += info[i][1][j].replace(/,/g, "") + ", ";
        }
        csv = csv.slice(0, -2) + "\n";
      }
    }
    return csv;
  }

  async saveData(data: saveDataParams) {
    let json: any = await this.loadJSONFile(data.jsonData);
    const { browser, page } = this.info;
    const csv = await this.resultToCSV(data, json);
    fs.writeFileSync("crimeData.csv", csv);
    return { browser, page, result: json };
  }
}
type PuppeteerInfoInput = {
  browser: Browser;
  page: Page;
};
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

export default process;
