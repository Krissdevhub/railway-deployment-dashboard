import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useDashboardStore } from "../../stores/dashboardStore";

export function ToastContainer() {
  const { toasts, dismissToast } = useDashboardStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => dismissToast(toast.id)}
        >
          {toast.type === "success" && <CheckCircle size={16} />}
          {toast.type === "error" && <AlertCircle size={16} />}
          {toast.type === "info" && <Info size={16} />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <X size={14} style={{ opacity: 0.6, cursor: "pointer" }} />
        </div>
      ))}
    </div>
  );
}
