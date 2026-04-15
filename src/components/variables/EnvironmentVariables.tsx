import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2, Save } from "lucide-react";
import { useVariables } from "../../hooks/useRailway";
import { useDashboardStore } from "../../stores/dashboardStore";

interface EnvironmentVariablesProps {
  projectId: string | null;
  serviceId: string;
}

export function EnvironmentVariables({
  projectId,
  serviceId,
}: EnvironmentVariablesProps) {
  const { data: variables, isLoading } = useVariables(projectId, serviceId);
  const showToast = useDashboardStore((s: any) => s.showToast);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [newVarName, setNewVarName] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  function toggleReveal(name: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleAdd() {
    if (!newVarName.trim()) return;
    showToast("success", `Variable ${newVarName} saved`);
    setNewVarName("");
    setNewVarValue("");
    setShowAddForm(false);
  }

  function handleDelete(name: string) {
    showToast("info", `Variable ${name} deleted`);
  }

  function maskValue(value: string, name: string): string {
    if (revealed.has(name)) return value;
    if (value.includes("••••")) return value;
    if (value.includes("****")) return value;
    return "••••••••••••";
  }

  if (isLoading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Environment Variables</span>
        </div>
        <div style={{ padding: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Environment Variables</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={13} />
          Add Variable
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid var(--border-primary)",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                display: "block",
                marginBottom: 4,
              }}
            >
              KEY
            </label>
            <input
              type="text"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value.toUpperCase())}
              placeholder="VARIABLE_NAME"
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-secondary)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                display: "block",
                marginBottom: 4,
              }}
            >
              VALUE
            </label>
            <input
              type="text"
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              placeholder="value"
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-secondary)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            <Save size={13} />
            Save
          </button>
        </div>
      )}

      <table className="vars-table">
        <thead>
          <tr>
            <th style={{ width: "35%" }}>Key</th>
            <th>Value</th>
            <th style={{ width: 80 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {variables?.map((v) => (
            <tr key={v.name}>
              <td>
                <span className="var-name">{v.name}</span>
              </td>
              <td>
                <span className="var-value">
                  {maskValue(v.value, v.name)}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleReveal(v.name)}
                    style={{ padding: "3px 6px" }}
                    title={revealed.has(v.name) ? "Hide" : "Reveal"}
                  >
                    {revealed.has(v.name) ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(v.name)}
                    style={{ padding: "3px 6px", color: "var(--danger)" }}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
