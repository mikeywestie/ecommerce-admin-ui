import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";

type BadgeState = "checking" | "online" | "degraded" | "offline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const HEALTH_URL = `${API_BASE_URL}/actuator/health`;

export default function HealthBadge() {
  const [state, setState] = useState<BadgeState>("checking");
  const [message, setMessage] = useState("Checking API status...");

  async function checkHealth() {
    try {
      setState("checking");

      const response = await fetch(HEALTH_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const health = await response.json();

      if (health.status === "UP") {
        setState("online");
        setMessage("API Online");
      } else {
        setState("degraded");
        setMessage(`API ${health.status}`);
      }
    } catch {
      setState("offline");
      setMessage("API Offline");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void checkHealth();
    }, 0);

    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 30000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const styles = {
    checking: "border-blue-400/30 bg-blue-500/10 text-blue-300",
    online: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    degraded: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    offline: "border-red-400/30 bg-red-500/10 text-red-300",
  };

  const icons = {
    checking: <Loader2 className="h-4 w-4 animate-spin" />,
    online: <CheckCircle2 className="h-4 w-4" />,
    degraded: <AlertCircle className="h-4 w-4" />,
    offline: <XCircle className="h-4 w-4" />,
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[state]}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icons[state]}
          <span>{message}</span>
        </div>

        <button
          type="button"
          onClick={checkHealth}
          className="text-xs opacity-80 hover:opacity-100 transition"
        >
          Refresh
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
        <Activity className="h-3.5 w-3.5" />
        <span>{HEALTH_URL}</span>
      </div>
    </div>
  );
}
