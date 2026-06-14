import { GitCommit } from "lucide-react";
import { useEffect, useState } from "react";

import { FRONTEND_BUILD_INFO } from "@/config/frontendBuildInfo";
import { getBackendBuildInfo } from "@/services/buildInfoService";
import type { BackendBuildInfo } from "@/types/BuildInfo";

export default function BuildInfoBadge() {
  const [backendBuildInfo, setBackendBuildInfo] = useState<BackendBuildInfo | null>(null);

  useEffect(() => {
    let mounted = true;

    getBackendBuildInfo()
      .then((data) => {
        if (mounted) {
          setBackendBuildInfo(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setBackendBuildInfo(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-400">
      <div className="mb-2 flex items-center gap-2 font-semibold text-slate-300">
        <GitCommit className="h-4 w-4" />
        <span>Running Builds</span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-slate-500">Frontend</p>
          <p>
            v <span className="font-semibold text-white">{FRONTEND_BUILD_INFO.version}</span>{" "}
            <span className="font-mono text-blue-300">{FRONTEND_BUILD_INFO.commitShort}</span>
          </p>
        </div>

        <div>
          <p className="text-slate-500">Backend</p>
          {backendBuildInfo ? (
            <p>
              v <span className="font-semibold text-white">{backendBuildInfo.version}</span>{" "}
              <span className="font-mono text-emerald-300">{backendBuildInfo.commitShort}</span>
            </p>
          ) : (
            <p className="text-slate-500">Unavailable</p>
          )}
        </div>
      </div>
    </div>
  );
}
