// Clears the website's saved copies of API answers (.next/cache/fetch-cache) before it is built
// or started. Saved pages are refreshed by the API after every dashboard change, but a change
// made while the website was stopped could otherwise leave old content in place after a restart.
// Starting from the current database every time rules that out. Pictures already resized are kept.
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../.next/cache/fetch-cache", import.meta.url));
rmSync(dir, { recursive: true, force: true });
console.log("Cleared saved API data, so the site starts from the current content.");
