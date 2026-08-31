import { After, AfterAll, Before, BeforeAll, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';

const baseUrl = process.env.BDD_BASE_URL ?? 'http://127.0.0.1:4173';
let browser: Browser;
let webProcess: ChildProcess | undefined;
let webOutput = '';

async function waitForWebServer(): Promise<void> {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (webProcess?.exitCode !== null) {
      throw new Error(`The web server exited before becoming ready.\n${webOutput}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for ${baseUrl}.\n${webOutput}`);
}

export class SidelineWorld extends World {
  context!: BrowserContext;
  page!: Page;
}

setWorldConstructor(SidelineWorld);
setDefaultTimeout(15_000);

BeforeAll(async () => {
  webProcess = spawn(
    'pnpm',
    ['--filter', '@sideline/web', 'dev', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    { cwd: process.cwd(), detached: true, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  webProcess.stdout?.on('data', (chunk) => {
    webOutput += chunk.toString();
  });
  webProcess.stderr?.on('data', (chunk) => {
    webOutput += chunk.toString();
  });

  await waitForWebServer();
  browser = await chromium.launch({ headless: true });
});

Before(async function (this: SidelineWorld) {
  this.context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  this.page = await this.context.newPage();
});

After(async function (this: SidelineWorld) {
  await this.context.close();
});

AfterAll(async () => {
  await browser?.close();

  if (webProcess?.pid) {
    try {
      process.kill(-webProcess.pid, 'SIGTERM');
    } catch {
      webProcess.kill('SIGTERM');
    }
  }
});
