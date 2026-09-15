import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Facebook Event Scraper Rules (Cron & Safety)", () => {
  it("TC-SYNC-005: Server has cron job configured for midnight (0 0 * * *) and executes scraper", () => {
    const serverCode = fs.readFileSync(path.join(process.cwd(), "server.js"), "utf8");
    expect(serverCode).toContain("cron.schedule('0 0 * * *'");
    expect(serverCode).toContain("exec('node scripts/scrape_fb_events.js'");
  });

  it("TC-SYNC-006: Scraper contains the safe-fallback rule (don't overwrite on 0 events)", () => {
    const scraperCode = fs.readFileSync(path.join(process.cwd(), "scripts/scrape_fb_events.js"), "utf8");
    expect(scraperCode).toMatch(/if\s*\(\s*events\.length\s*>\s*0\s*\)\s*\{/);
    expect(scraperCode).toContain("fs.writeFileSync");
  });
});
