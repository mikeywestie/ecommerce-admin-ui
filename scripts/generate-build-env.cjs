const fs = require("fs");
const { execSync } = require("child_process");
const pkg = require("../package.json");

function git(command, fallback) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

const env = [
  `VITE_APP_VERSION=${pkg.version || "1.0.0"}`,
  `VITE_GIT_COMMIT=${git("git rev-parse HEAD", "local")}`,
  `VITE_GIT_BRANCH=${git("git rev-parse --abbrev-ref HEAD", "local")}`,
  `VITE_BUILD_TIME=${new Date().toISOString()}`,
  "",
].join("\n");

fs.writeFileSync(".env.production.local", env);
console.log("Generated .env.production.local");