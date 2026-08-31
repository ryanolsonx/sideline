import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';

export class SidelineWorld extends World {
  readonly baseUrl = process.env.BDD_BASE_URL ?? 'http://localhost:5173';
  browserContext?: BrowserContext;
  page?: Page;
  matchingMatchesBeforeSave = 0;

  constructor(options: IWorldOptions) {
    super(options);
  }

  get currentPage(): Page {
    if (!this.page) {
      throw new Error('The browser page has not been initialized for this scenario.');
    }

    return this.page;
  }

  get context(): BrowserContext {
    if (!this.browserContext) {
      throw new Error('The browser context has not been initialized for this scenario.');
    }

    return this.browserContext;
  }
}

setWorldConstructor(SidelineWorld);
