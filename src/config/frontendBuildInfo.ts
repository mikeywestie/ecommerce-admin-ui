import type { FrontendBuildInfo } from "@/types/BuildInfo";

const rawCommit = import.meta.env.VITE_GIT_COMMIT || "local";
const rawBranch = import.meta.env.VITE_GIT_BRANCH || "local";

function shortCommit(commit: string) {
  if (!commit || commit === "local") {
    return "local";
  }

  return commit.length <= 7 ? commit : commit.substring(0, 7);
}

export const FRONTEND_BUILD_INFO: FrontendBuildInfo = {
  application: "ecommerce-admin-ui",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  environment: import.meta.env.MODE || "local",
  branch: rawBranch,
  commit: rawCommit,
  commitShort: shortCommit(rawCommit),
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
};
