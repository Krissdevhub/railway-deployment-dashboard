import { useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { useLogs } from "../../hooks/useRailway";
import { useDashboardStore } from "../../stores/dashboardStore";
import { formatTimestamp } from "../../utils/formatters";

interface LogsViewerProps {
  deploymentId: string | null;
}

export function LogsViewer({ deploymentId }: LogsViewerProps) {
  const { data: logs, isLoading } = useLogs(deploymentId);
  const { logsAutoScroll, logsPaused, toggleLogsPaused } = useDashboardStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsAutoScroll && scrollRef.current && !logsPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, logsAutoScroll, logsPaused]);

  if (!deploymentId) {
    return (
      <div className="logs-container">
        <div className="logs-header">
          <div className="logs-header-left">
            <span className="logs-title">Runtime Logs</span>
          </div>
        </div>
        <div className="logs-body">
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No deployment selected</div>
            <div className="empty-state-desc">Deploy a service to view logs</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-container">
      <div className="logs-header">
        <div className="logs-header-left">
          <span className="logs-title">Runtime Logs</span>
          <span className={`logs-indicator ${logsPaused ? "paused" : ""}`} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {logsPaused ? "Paused" : "Live"}
          </span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={toggleLogsPaused}>
          {logsPaused ? <Play size={13} /> : <Pause size={13} />}
          {logsPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="logs-body" ref={scrollRef}>
        {isLoading && (
          <div style={{ padding: "12px 16px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-text long" style={{ marginBottom: 6 }} />
            ))}
          </div>
        )}

        {!isLoading &&
          logs?.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="log-timestamp">
                {formatTimestamp(entry.timestamp)}
              </span>
              <span className={`log-severity ${entry.severity}`}>
                {entry.severity}
              </span>
              <span className="log-message">{entry.message}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
