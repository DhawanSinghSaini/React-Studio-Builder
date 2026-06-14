import React, { useState, useEffect, useCallback } from "react";
import useStore from "../store/useStore";
import {
  Undo2,
  Redo2,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  Layers,
  PanelRight,
  PanelLeft,
  LayoutTemplate,
  Eye,
  EyeOff,
} from "lucide-react";
import "./TopBar.css";

const TopBar = ({
  toolbarVisible,
  onToggleToolbar,
  layersVisible,
  onToggleLayers,
  inspectorVisible,
  onToggleInspector,
  onExport,
  zoom,
  zoomIn,
  zoomOut,
  zoomReset,
}) => {
  const { undo, redo, canUndo, canRedo, clearCanvas, historyIndex, history } =
    useStore();
  const [saveFlash, setSaveFlash] = useState(false);

  // Pulse "saved" badge on every history change
  useEffect(() => {
    setSaveFlash(true);
    const t = setTimeout(() => setSaveFlash(false), 1400);
    return () => clearTimeout(t);
  }, [historyIndex]);

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        if (canRedo()) redo();
      }
      if (e.key === "e") {
        e.preventDefault();
        onExport();
      }
    },
    [undo, redo, canUndo, canRedo, onExport],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleClear = () => {
    if (window.confirm("Clear the entire canvas? This cannot be undone here."))
      clearCanvas();
  };

  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="topbar">
      {/* ── Logo ── */}
      <div className="topbar-logo">
        <div className="topbar-logo-mark">S</div>
        <span className="topbar-logo-text">Studio</span>
        <span className="topbar-logo-ver">v3</span>
      </div>

      <div className="topbar-div" />

      {/* ── Panel visibility toggles ── */}
      <div className="topbar-group">
        <button
          className={`tb-btn${toolbarVisible ? " on" : ""}`}
          onClick={onToggleToolbar}
          title="Toggle Component Shelf"
        >
          <LayoutTemplate size={14} />
          <span>Components</span>
        </button>
        <button
          className={`tb-btn${layersVisible ? " on" : ""}`}
          onClick={onToggleLayers}
          title="Toggle Layers"
        >
          <Layers size={14} />
          <span>Layers</span>
        </button>
        <button
          className={`tb-btn${inspectorVisible ? " on" : ""}`}
          onClick={onToggleInspector}
          title="Toggle Inspector"
        >
          <PanelRight size={14} />
          <span>Inspector</span>
        </button>
      </div>

      <div className="topbar-div" />

      {/* ── Undo / Redo ── */}
      <div className="topbar-group">
        <button
          className="tb-btn icon"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={14} />
        </button>
        <span className="topbar-hist">
          {historyIndex}/{history.length - 1}
        </span>
        <button
          className="tb-btn icon"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={14} />
        </button>
      </div>

      <div className="topbar-div" />

      {/* ── Zoom ── */}
      <div className="topbar-group">
        <button className="tb-btn icon" onClick={zoomOut} title="Zoom out">
          −
        </button>
        <button
          className="tb-btn zoom-val"
          onClick={zoomReset}
          title="Reset zoom"
        >
          {zoomPct}%
        </button>
        <button className="tb-btn icon" onClick={zoomIn} title="Zoom in">
          +
        </button>
      </div>

      {/* Spacer pushes right side items to the right */}
      <div style={{ flex: 1 }} />

      {/* ── Save status ── */}
      <div className={`topbar-save${saveFlash ? " flash" : ""}`}>
        {saveFlash ? (
          <>
            <Save size={11} /> Saving…
          </>
        ) : (
          <>
            <CheckCircle2 size={11} /> Saved
          </>
        )}
      </div>

      <div className="topbar-div" />

      {/* ── Clear + Export ── */}
      <div className="topbar-group">
        <button
          className="tb-btn danger"
          onClick={handleClear}
          title="Clear canvas"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
        <button
          className="tb-btn primary"
          onClick={onExport}
          title="Export code (Ctrl+E)"
        >
          <Download size={13} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;