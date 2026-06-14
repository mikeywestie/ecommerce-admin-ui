import api from "./api";

export type BugReportRequest = {
  message: string;
  stepsToReproduce?: string;
  screenshot?: string;
  route?: string;
  userEmail?: string;
  userRole?: string;
  frontendVersion?: string;
  frontendCommit?: string;
  frontendBuildTime?: string;
  backendVersion?: string;
  backendCommit?: string;
  backendBuildTime?: string;
  browser?: string;
  viewport?: string;
};

export type BugReportResponse = {
  success: boolean;
  issueUrl: string;
  issueNumber: number;
};

export async function submitBugReport(request: BugReportRequest): Promise<BugReportResponse> {
  const response = await api.post("/api/system/bug-reports", request);
  return response.data;
}
