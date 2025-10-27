import { useEffect, useRef } from "react";

const NumericInputModal = ({
  show,
  onClose,
  title,
  value,
  setValue,
  onApply,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          width: "400px",
          borderRadius: "8px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>{title}</h5>
        <input
          type="number"
          className="form-control mb-3"
          placeholder={`Enter ${title}`}
          ref={inputRef}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (!/^\d*\.?\d*$/.test(val)) return;
            setValue(val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onApply();
          }}
        />
        <button className="btn btn-primary" onClick={onApply}>
          Apply
        </button>
      </div>
    </div>
  );
};
export default NumericInputModal;
