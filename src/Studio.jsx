import React, { useState, useRef, useCallback, useEffect } from "react";
import useStore from "./store/useStore";
import Toolbar from "./components/Toolbar";
import Inspector from "./components/Inspector";
import StudioElement from "./components/StudioElement";
import LayersPanel from "./components/LayersPanel";
import ExportModal from "./components/ExportModal";
import "./Studio.css";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function Studio() {
  const { layoutTree, setSelectedElement, canvasBg, canvasDotColor } =
    useStore();

  /* ─── panel visibility ─────────────────────────────────── */
  const [showToolbar, setShowToolbar] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showExport, setShowExport] = useState(false);

  /* ─── zoom / pan state lives entirely in refs ──────────── */
  /* We NEVER call setState during drag/wheel — zero batching jitter */
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 80, y: 80 });

  /* DOM refs */
  const viewportRef = useRef(null);
  const transformRef = useRef(null);
  const bgLayerRef = useRef(null); // the repeating dot background div
  const zoomLabelRef = useRef(null); // shows "100%" in top bar

  /* pan drag bookkeeping */
  const isPanning = useRef(false);
  const spaceHeld = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset0 = useRef({ x: 0, y: 0 });

  /* ─── apply transform directly to DOM — no setState ───── */
  const commit = useCallback(() => {
    const z = zoomRef.current;
    const { x, y } = offsetRef.current;

    // 1. Move + scale the content layer
    if (transformRef.current) {
      transformRef.current.style.transform = `translate(${x}px,${y}px) scale(${z})`;
    }

    // 2. Keep the dot-grid aligned with the content
    if (bgLayerRef.current) {
      const size = 24 * z;
      const bx = ((x % size) + size) % size;
      const by = ((y % size) + size) % size;
      bgLayerRef.current.style.backgroundSize = `${size}px ${size}px`;
      bgLayerRef.current.style.backgroundPosition = `${bx}px ${by}px`;
    }

    // 3. Update the tiny zoom percentage label
    if (zoomLabelRef.current) {
      zoomLabelRef.current.textContent = `${Math.round(z * 100)}%`;
    }
  }, []);

  /* ─── zoom toward an arbitrary focal point ─────────────── */
  const doZoom = useCallback(
    (nextZ, focalX, focalY) => {
      const prevZ = zoomRef.current;
      nextZ = clamp(nextZ, MIN_ZOOM, MAX_ZOOM);
      const scale = nextZ / prevZ;
      const { x, y } = offsetRef.current;
      offsetRef.current = {
        x: focalX - (focalX - x) * scale,
        y: focalY - (focalY - y) * scale,
      };
      zoomRef.current = nextZ;
      commit();
    },
    [commit],
  );

  const centerFocal = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return { fx: 400, fy: 300 };
    const r = vp.getBoundingClientRect();
    return { fx: r.width / 2, fy: r.height / 2 };
  }, []);

  const zoomIn = useCallback(() => {
    const { fx, fy } = centerFocal();
    doZoom(zoomRef.current + ZOOM_STEP, fx, fy);
  }, [doZoom, centerFocal]);
  const zoomOut = useCallback(() => {
    const { fx, fy } = centerFocal();
    doZoom(zoomRef.current - ZOOM_STEP, fx, fy);
  }, [doZoom, centerFocal]);
  const zoomTo = useCallback(
    (v) => {
      const { fx, fy } = centerFocal();
      doZoom(parseFloat(v), fx, fy);
    },
    [doZoom, centerFocal],
  );
  const resetView = useCallback(() => {
    zoomRef.current = 1;
    offsetRef.current = { x: 80, y: 80 };
    commit();
  }, [commit]);

  /* ─── wheel: Ctrl = zoom, plain = pan ─────────────────── */
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const vp = viewportRef.current;
      const rect = vp.getBoundingClientRect();
      const fx = e.clientX - rect.left;
      const fy = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        /* Normalise across mouse wheel (deltaMode 0 = px, 1 = lines) */
        const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        const delta = px > 0 ? -ZOOM_STEP : ZOOM_STEP;
        doZoom(zoomRef.current + delta, fx, fy);
      } else {
        offsetRef.current.x -= e.deltaX;
        offsetRef.current.y -= e.deltaY;
        commit();
      }
    },
    [doZoom, commit],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ─── mouse pan ─────────────────────────────────────────── */
  /* Pan triggers:
       • Space + left-drag (Figma style)
       • Middle-button drag anywhere
       • Alt + left-drag
       • Left-drag directly on the bare background */
  const startPan = useCallback((e, force = false) => {
    const onBg =
      e.target === viewportRef.current ||
      e.target === bgLayerRef.current ||
      e.target.dataset.bg === "true";

    const should =
      force ||
      e.button === 1 || // middle-click
      (e.button === 0 && e.altKey) || // alt+left
      (e.button === 0 && spaceHeld.current) || // space+left
      (e.button === 0 && onBg); // left on empty canvas

    if (!should) return;
    e.preventDefault();
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOffset0.current = { ...offsetRef.current };
    viewportRef.current.style.cursor = "grabbing";
  }, []);

  const movePan = useCallback(
    (e) => {
      if (!isPanning.current) return;
      offsetRef.current = {
        x: panOffset0.current.x + (e.clientX - panStart.current.x),
        y: panOffset0.current.y + (e.clientY - panStart.current.y),
      };
      commit();
    },
    [commit],
  );

  const endPan = useCallback(() => {
    if (!isPanning.current) return;
    isPanning.current = false;
    if (viewportRef.current)
      viewportRef.current.style.cursor = spaceHeld.current ? "grab" : "";
  }, []);

  /* ─── space key = grab cursor ───────────────────────────── */
  useEffect(() => {
    const dn = (e) => {
      if (
        e.code === "Space" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        spaceHeld.current = true;
        if (viewportRef.current) viewportRef.current.style.cursor = "grab";
      }
    };
    const up = (e) => {
      if (e.code === "Space") {
        spaceHeld.current = false;
        if (!isPanning.current && viewportRef.current)
          viewportRef.current.style.cursor = "";
      }
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  /* ─── keyboard shortcuts ─────────────────────────────────── */
  useEffect(() => {
    const fn = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn();
      }
      if (mod && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
      if (mod && e.key === "0") {
        e.preventDefault();
        resetView();
      }
      if (mod && e.key === "e") {
        e.preventDefault();
        setShowExport((v) => !v);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [zoomIn, zoomOut, resetView]);

  /* apply transform once on mount */
  useEffect(() => {
    commit();
  }, [commit]);

  /* click on bare canvas = select root */
  const onCanvasClick = useCallback(
    (e) => {
      if (
        e.target === viewportRef.current ||
        e.target === bgLayerRef.current ||
        e.target.dataset.bg === "true"
      )
        setSelectedElement("root");
    },
    [setSelectedElement],
  );

  /* ─── dot-pattern bg style (only color/dot props, no position) */
  const dotStyle = {
    backgroundColor: canvasBg,
    backgroundImage: `radial-gradient(circle, ${canvasDotColor} 1.2px, transparent 1.2px)`,
  };

  return (
    <div className="app-shell">
      {/* ═══════════════ TOP STRIP ═══════════════════════════ */}
      <div className="top-strip">
        {/* Brand */}
        <div className="ts-brand">
          <div className="ts-brand-mark">S</div>
          <span className="ts-brand-name">Studio</span>
          <span className="ts-brand-ver">v3</span>
        </div>

        <div className="ts-divider" />

        {/* Panel toggles */}
        <button
          className={`ts-btn${showLayers ? " on" : ""}`}
          onClick={() => setShowLayers((v) => !v)}
          title="Toggle Layers"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="18" rx="1.5" />
            <rect x="14" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="15" width="7" height="6" rx="1.5" />
          </svg>
          Layers
        </button>
        <button
          className={`ts-btn${showInspector ? " on" : ""}`}
          onClick={() => setShowInspector((v) => !v)}
          title="Toggle Inspector"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Inspector
        </button>

        <div className="ts-divider" />

        {/* Horizontal component strip */}
        {showToolbar && (
          <div className="ts-comp-strip">
            <Toolbar layout="horizontal" />
          </div>
        )}
        <button
          className={`ts-btn${showToolbar ? " on" : ""}`}
          onClick={() => setShowToolbar((v) => !v)}
          title="Toggle Components"
          style={{ flexShrink: 0 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="4" rx="1" />
            <rect x="2" y="10" width="9" height="4" rx="1" />
            <rect x="2" y="17" width="14" height="4" rx="1" />
          </svg>
          {showToolbar ? "Hide" : "Components"}
        </button>

        {/* Spacer pushes zoom + export to the right */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* Zoom controls */}
        <div className="ts-divider" />
        <div className="ts-zoom">
          <button
            className="ts-zoom-btn"
            onClick={zoomOut}
            title="Zoom Out (Ctrl+-)"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="ts-zoom-label" ref={zoomLabelRef}>
            100%
          </span>
          <button
            className="ts-zoom-btn"
            onClick={zoomIn}
            title="Zoom In (Ctrl+=)"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>

          {/* Preset selector */}
          <select
            className="ts-zoom-select"
            defaultValue="1"
            onChange={(e) => zoomTo(e.target.value)}
            title="Zoom preset"
          >
            {ZOOM_PRESETS.map((p) => (
              <option key={p} value={p}>
                {Math.round(p * 100)}%
              </option>
            ))}
          </select>

          <button
            className="ts-zoom-btn"
            onClick={resetView}
            title="Reset zoom (Ctrl+0)"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* Export */}
        <div className="ts-divider" />
        <button
          className="ts-export-btn"
          onClick={() => setShowExport(true)}
          title="Export code (Ctrl+E)"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>

      {/* ═══════════════ MAIN ROW ════════════════════════════ */}
      <div className="app-body">
        {/* Left panel: Layers */}
        {showLayers && (
          <div className="side-panel side-panel-left">
            <LayersPanel />
          </div>
        )}

        {/* Center: infinite canvas */}
        <div
          className="canvas-vp"
          ref={viewportRef}
          onMouseDown={startPan}
          onMouseMove={movePan}
          onMouseUp={endPan}
          onMouseLeave={endPan}
          onClick={onCanvasClick}
        >
          {/* Background dot-grid layer — position updated via ref */}
          <div
            ref={bgLayerRef}
            className="canvas-bg"
            data-bg="true"
            style={dotStyle}
          />

          {/* Infinite transform layer */}
          <div ref={transformRef} className="canvas-content">
            <StudioElement element={layoutTree} />
          </div>

          {/* Pan hint */}
          <div className="canvas-hint">
            Space + drag or middle-click to pan · Ctrl + scroll to zoom
          </div>
        </div>

        {/* Right panel: Inspector */}
        {showInspector && (
          <div className="side-panel side-panel-right">
            <Inspector />
          </div>
        )}
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
