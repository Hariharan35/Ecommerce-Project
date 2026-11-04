import { useEffect } from "react";

function ConfirmModal({ title, message, confirmText = "Confirm", onConfirm, onCancel, busy }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Keep it</button>
          <button className="btn btn-orange" onClick={onConfirm} disabled={busy}>
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
