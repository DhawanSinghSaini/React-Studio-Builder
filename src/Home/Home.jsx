import React, { useEffect, useRef, useState } from "react";
import "./Home.css";

/* ── tiny component catalogue preview data ── */
const COMPONENTS = [
  { label: "Flex", color: "#6366f1", col: 1, row: 1 },
  { label: "Grid", color: "#6366f1", col: 2, row: 1 },
  { label: "Section", color: "#6366f1", col: 3, row: 1 },
  { label: "Button", color: "#ef4444", col: 1, row: 2 },
  { label: "Input", color: "#ef4444", col: 2, row: 2 },
  { label: "Card", color: "#ec4899", col: 3, row: 2 },
  { label: "H1", color: "#f59e0b", col: 1, row: 3 },
  { label: "Image", color: "#8b5cf6", col: 2, row: 3 },
  { label: "Table", color: "#10b981", col: 3, row: 3 },
];

const STEPS = [
  {
    num: "01",
    title: "Pick a component",
    body: "Browse Layout, Text, Forms, and Media from the left shelf. Every primitive you need is one click away.",
  },
  {
    num: "02",
    title: "Drag & drop",
    body: "Place elements onto the infinite canvas. Nest them, reorder via the Layers panel, and compose in real time.",
  },
  {
    num: "03",
    title: "Inspect & style",
    body: "Select any element and tune padding, color, typography, animations, and more inside the Inspector.",
  },
  {
    num: "04",
    title: "Export clean code",
    body: "Hit Export — get production-ready React JSX and CSS, ready to paste directly into your project.",
  },
];

const FEATURES = [
  {
    icon: "⬡",
    title: "Infinite canvas",
    body: "Zoom, pan, and build at any scale. Your workspace never runs out of room.",
  },
  {
    icon: "◈",
    title: "Live Inspector",
    body: "Every CSS property, spacing box, and animation preset — all in a single side panel.",
  },
  {
    icon: "◻",
    title: "Layers panel",
    body: "See the full component tree. Drag to reorder, click to select, delete with a keystroke.",
  },
  {
    icon: "⬟",
    title: "Undo / Redo",
    body: "Full history stack with keyboard shortcuts. Experiment freely without fear.",
  },
  {
    icon: "◇",
    title: "Export JSX + CSS",
    body: "One-click export generates clean, readable React code you can drop straight into any project.",
  },
  {
    icon: "◈",
    title: "No account needed",
    body: "Open the Studio, start building immediately. Zero sign-up, zero friction.",
  },
];

export default function Home({ onEnterStudio }) {
  const heroRef = useRef(null);
  const [tick, setTick] = useState(0);

  /* subtle floating animation ticker */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  /* parallax grid on mouse move */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rx = ((e.clientX / window.innerWidth) - 0.5) * 18;
      const ry = ((e.clientY / window.innerHeight) - 0.5) * 12;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="home">

      {/* ── NAV ── */}
      <nav className="home-nav">
        <div className="home-nav-logo">
          <div className="home-nav-mark">S</div>
          <span className="home-nav-name">Studio</span>
          <span className="home-nav-ver">v3</span>
        </div>
        <div className="home-nav-links">
          <a href="#how" className="home-nav-link">How it works</a>
          <a href="#features" className="home-nav-link">Features</a>
        </div>
        <button className="home-nav-cta" onClick={onEnterStudio}>
          Open Studio →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="home-hero" ref={heroRef}>
        <div className="home-hero-grid-bg" aria-hidden="true" />
        <div className="home-hero-glow" aria-hidden="true" />

        <div className="home-hero-content">
          <div className="home-hero-badge">No-code · React · Visual Builder</div>

          <h1 className="home-hero-title">
            Build React<br />
            <span className="home-hero-title-accent">without writing</span><br />
            a single line.
          </h1>

          <p className="home-hero-sub">
            Studio is a visual drag-and-drop editor that outputs production-ready
            React JSX &amp; CSS. Compose layouts, style every detail, and export
            clean code instantly.
          </p>

          <div className="home-hero-actions">
            <button className="home-btn-primary" onClick={onEnterStudio}>
              <span>Launch Studio</span>
              <span className="home-btn-arrow">↗</span>
            </button>
            <a href="#how" className="home-btn-ghost">See how it works</a>
          </div>

          <div className="home-hero-stats">
            <div className="home-hero-stat"><span>30+</span> Components</div>
            <div className="home-hero-stat-div" />
            <div className="home-hero-stat"><span>∞</span> Canvas</div>
            <div className="home-hero-stat-div" />
            <div className="home-hero-stat"><span>0</span> Sign-ups</div>
          </div>
        </div>

        {/* floating component grid preview */}
        <div className="home-hero-preview" aria-hidden="true">
          <div className="home-preview-window">
            <div className="home-preview-titlebar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="home-preview-title">studio — canvas</span>
            </div>
            <div className="home-preview-body">
              <div className="home-preview-sidebar">
                {["Layout","Text","Forms","Media","Data"].map((s) => (
                  <div key={s} className="home-preview-sitem">{s}</div>
                ))}
              </div>
              <div className="home-preview-canvas">
                {COMPONENTS.map((c) => (
                  <div
                    key={c.label}
                    className="home-preview-chip"
                    style={{
                      gridColumn: c.col,
                      gridRow: c.row,
                      borderColor: c.color + "55",
                      color: c.color,
                    }}
                  >
                    {c.label}
                  </div>
                ))}
                <div className="home-preview-cursor" style={{
                  transform: `translate(${52 + Math.sin(tick * 0.02) * 18}px, ${38 + Math.cos(tick * 0.015) * 12}px)`
                }}>▸</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-how" id="how">
        <div className="home-section-header">
          <span className="home-section-tag">PROCESS</span>
          <h2 className="home-section-title">From idea to code in four steps</h2>
        </div>

        <div className="home-steps">
          {STEPS.map((s, i) => (
            <div className="home-step" key={s.num}>
              <div className="home-step-num">{s.num}</div>
              <div className="home-step-connector" aria-hidden="true" />
              <div className="home-step-content">
                <h3 className="home-step-title">{s.title}</h3>
                <p className="home-step-body">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features" id="features">
        <div className="home-section-header">
          <span className="home-section-tag">FEATURES</span>
          <h2 className="home-section-title">Everything in one place</h2>
        </div>

        <div className="home-feature-grid">
          {FEATURES.map((f) => (
            <div className="home-feature-card" key={f.title}>
              <div className="home-feature-icon">{f.icon}</div>
              <h3 className="home-feature-title">{f.title}</h3>
              <p className="home-feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="home-cta-band">
        <div className="home-cta-band-glow" aria-hidden="true" />
        <h2 className="home-cta-band-title">Ready to build?</h2>
        <p className="home-cta-band-sub">
          No installs. No account. Just open the Studio and start dragging.
        </p>
        <button className="home-btn-primary large" onClick={onEnterStudio}>
          <span>Open Studio</span>
          <span className="home-btn-arrow">↗</span>
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-logo">
          <div className="home-nav-mark small">S</div>
          <span>Studio v3</span>
        </div>
        <span className="home-footer-note">Visual React Builder · No-code · Free</span>
      </footer>

    </div>
  );
}