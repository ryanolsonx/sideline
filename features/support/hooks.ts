import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import { SidelineWorld } from './world';

let browser: Browser;

setDefaultTimeout(15_000);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: process.env.BDD_HEADED !== 'true' });
});

Before(async function (this: SidelineWorld) {
  this.browserContext = await browser.newContext();
  this.page = await this.browserContext.newPage();
});

After(async function (this: SidelineWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }

  await this.browserContext?.close();
});

AfterAll(async () => {
  await browser?.close();
});
