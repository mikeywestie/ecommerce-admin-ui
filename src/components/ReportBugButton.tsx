import html2canvas from "html2canvas";
import { Bug, ExternalLink, Loader2, X } from "lucide-react";
import { useState } from "react";

import { FRONTEND_BUILD_INFO } from "@/config/frontendBuildInfo";
import { getBackendBuildInfo } from "@/services/buildInfoService";
import { submitBugReport } from "@/services/bugReportService";
import type { BackendBuildInfo } from "@/types/BuildInfo";

export default function ReportBugButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [issueUrl, setIssueUrl] = useState("");
  const [error, setError] = useState("");

  async function captureScreenshot() {
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      scale: 0.7,
      ignoreElements: (element) => element.getAttribute("data-bug-report-ignore") === "true",
    });

    return canvas.toDataURL("image/png");
  }

  async function handleSubmit() {
    if (!message.trim()) {
      setError("Please describe the bug before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setIssueUrl("");

      let screenshot = "";
      let backendBuildInfo: BackendBuildInfo | null = null;

      if (includeScreenshot) {
        screenshot = await captureScreenshot();
      }

      try {
        backendBuildInfo = await getBackendBuildInfo();
      } catch {
        backendBuildInfo = null;
      }

      const response = await submitBugReport({
        message,
        stepsToReproduce,
        screenshot,
        route: window.location.pathname + window.location.search,
        userEmail: sessionStorage.getItem("email") || "unknown",
        userRole: sessionStorage.getItem("role") || "unknown",
        frontendVersion: FRONTEND_BUILD_INFO.version,
        frontendCommit: FRONTEND_BUILD_INFO.commitShort,
        frontendBuildTime: FRONTEND_BUILD_INFO.buildTime,
        backendVersion: backendBuildInfo?.version || "unknown",
        backendCommit: backendBuildInfo?.commitShort || "unknown",
        backendBuildTime: backendBuildInfo?.buildTime || "unknown",
        browser: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      });

      setIssueUrl(response.issueUrl);
      setMessage("");
      setStepsToReproduce("");
    } catch {
      setError("Unable to submit the bug report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        data-bug-report-ignore="true"
        onClick={() => {
          setOpen(true);
          setError("");
          setIssueUrl("");
        }}
        className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-slate-700 transition hover:bg-slate-800"
      >
        <Bug className="h-4 w-4" />
        Report Bug
      </button>

      {open && (
        <div
          data-bug-report-ignore="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
        >
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Report a Bug</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This will create a GitHub issue with your message, page context, build versions,
                  and optional screenshot.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {issueUrl ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <p className="font-semibold">Bug report submitted.</p>
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-700 underline"
                >
                  Open GitHub Issue
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">What went wrong?</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Example: Payment failed checkout shows as PAID in order history."
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Steps to reproduce</span>
                  <textarea
                    value={stepsToReproduce}
                    onChange={(event) => setStepsToReproduce(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="1. Add product to cart&#10;2. Checkout&#10;3. Simulate payment failed"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeScreenshot}
                    onChange={(event) => setIncludeScreenshot(event.target.checked)}
                    className="h-4 w-4"
                  />
                  Include screenshot of current screen
                </label>

                <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-2">
                  <p>
                    Frontend: v{FRONTEND_BUILD_INFO.version} {FRONTEND_BUILD_INFO.commitShort}
                  </p>
                  <p>Route: {window.location.pathname}</p>
                  <p>Role: {sessionStorage.getItem("role") || "unknown"}</p>
                  <p>
                    Viewport: {window.innerWidth}x{window.innerHeight}
                  </p>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? "Submitting..." : "Submit Bug"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
