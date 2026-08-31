import { After, AfterAll, Before, BeforeAll, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { Pool } from 'pg';

const baseUrl = process.env.BDD_BASE_URL ?? 'http://127.0.0.1:4173';
let browser: Browser;
let webProcess: ChildProcess | undefined;
let apiProcess: ChildProcess | undefined;
let processOutput = '';
let database: Pool;

async function waitForServer(url: string, process: ChildProcess | undefined): Promise<void> {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (process?.exitCode !== null) {
      throw new Error(`A test server exited before becoming ready.\n${processOutput}`);
    }

    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for ${url}.\n${processOutput}`);
}

function captureOutput(process: ChildProcess): void {
  process.stdout?.on('data', (chunk) => {
    processOutput += chunk.toString();
  });
  process.stderr?.on('data', (chunk) => {
    processOutput += chunk.toString();
  });
}

function stopProcess(process: ChildProcess | undefined): void {
  if (!process?.pid) return;
  try {
    globalThis.process.kill(-process.pid, 'SIGTERM');
  } catch {
    process.kill('SIGTERM');
  }
}

export class SidelineWorld extends World {
  readonly baseUrl = baseUrl;
  context!: BrowserContext;
  browserContext?: BrowserContext;
  page?: Page;
  matchingMatchesBeforeSave = 0;

  get currentPage(): Page {
    if (!this.page) {
      throw new Error('The browser page has not been initialized for this scenario.');
    }

    return this.page;
  }
}

setWorldConstructor(SidelineWorld);
setDefaultTimeout(60_000);

BeforeAll(async () => {
  apiProcess = spawn('pnpm', ['--filter', '@sideline/api', 'dev'], {
    cwd: process.cwd(),
    detached: true,
    env: { ...process.env, WEB_ORIGIN: baseUrl },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  captureOutput(apiProcess);

  webProcess = spawn(
    'pnpm',
    ['--filter', '@sideline/web', 'dev', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    {
      cwd: process.cwd(),
      detached: true,
      env: { ...process.env, VITE_GRAPHQL_URL: 'http://127.0.0.1:3000/graphql' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  captureOutput(webProcess);

  await Promise.all([
    waitForServer('http://127.0.0.1:3000/graphql', apiProcess),
    waitForServer(baseUrl, webProcess),
  ]);
  database = new Pool({
    host: process.env.DATABASE_HOST ?? '127.0.0.1',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER ?? 'sideline',
    password: process.env.DATABASE_PASSWORD ?? 'sideline',
    database: process.env.DATABASE_NAME ?? 'sideline',
  });
  browser = await chromium.launch({ headless: true });
});

Before(async function (this: SidelineWorld) {
  await database.query('TRUNCATE TABLE "player", "team" RESTART IDENTITY CASCADE');
  this.context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  this.browserContext = this.context;
  this.page = await this.context.newPage();
});

After(async function (this: SidelineWorld) {
  await this.context.close();
});

AfterAll(async () => {
  await browser?.close();
  await database?.end();
  stopProcess(webProcess);
  stopProcess(apiProcess);
});
