import React, { useState } from "react";
import useStore from "../store/useStore";
import "./Toolbar.css";
import {
  Layers,
  LayoutGrid,
  PanelTop,
  MoveVertical,
  CreditCard,
  CheckSquare,
  Minus,
  Hash,
  AlignLeft,
  Type,
  Link,
  MessageSquare,
  Table,
  List,
  ListOrdered,
  Terminal,
  MousePointer2,
  TextCursorInput,
  ToggleLeft,
  Globe,
  Image,
  Video,
  Music,
  Star,
  Navigation,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const CATALOGUE = [
  {
    id: "layout",
    label: "Layout",
    color: "#6366f1",
    items: [
      { label: "Flex", type: "flex", icon: Layers },
      { label: "Grid", type: "grid", icon: LayoutGrid },
      { label: "Section", type: "section", icon: PanelTop },
      { label: "Nav", type: "nav", icon: Navigation },
      { label: "Spacer", type: "spacer", icon: MoveVertical },
    ],
  },
  {
    id: "presets",
    label: "Presets",
    color: "#ec4899",
    items: [
      { label: "Card", type: "card", icon: CreditCard },
      { label: "Form", type: "form-group", icon: CheckSquare },
      { label: "Divider", type: "divider", icon: Minus },
    ],
  },
  {
    id: "typography",
    label: "Text",
    color: "#f59e0b",
    items: [
      { label: "H1", type: "h1", icon: Hash },
      { label: "H2", type: "h2", icon: Hash },
      { label: "H3", type: "h3", icon: Hash },
      { label: "Para", type: "text", icon: AlignLeft },
      { label: "Label", type: "label", icon: Type },
      { label: "Quote", type: "blockquote", icon: MessageSquare },
      { label: "Link", type: "link", icon: Link },
    ],
  },
  {
    id: "interactive",
    label: "Forms",
    color: "#ef4444",
    items: [
      { label: "Button", type: "button", icon: MousePointer2 },
      { label: "Input", type: "input", icon: TextCursorInput },
      { label: "Textarea", type: "textarea", icon: AlignLeft },
      { label: "Select", type: "select", icon: List },
      { label: "Checkbox", type: "checkbox", icon: CheckSquare },
      { label: "Toggle", type: "toggle", icon: ToggleLeft },
    ],
  },
  {
    id: "media",
    label: "Media",
    color: "#8b5cf6",
    items: [
      { label: "Image", type: "image", icon: Image },
      { label: "Video", type: "video", icon: Video },
      { label: "Audio", type: "audio", icon: Music },
      { label: "Iframe", type: "iframe", icon: Globe },
      { label: "Icon", type: "icon", icon: Star },
    ],
  },
  {
    id: "data",
    label: "Data",
    color: "#10b981",
    items: [
      { label: "Table", type: "table", icon: Table },
      { label: "UL", type: "ul", icon: List },
      { label: "OL", type: "ol", icon: ListOrdered },
      { label: "Code", type: "code", icon: Terminal },
    ],
  },
];

/* ─── Horizontal strip (top bar) ─────────────────────────────── */
const ToolbarHorizontal = ({ addComponent }) => (
  <div className="toolbar-horiz">
    {CATALOGUE.map((sec) => (
      <div key={sec.id} className="toolbar-horiz-group">
        <span className="toolbar-horiz-label" style={{ color: sec.color }}>
          {sec.label}
        </span>
        {sec.items.map((item) => (
          <button
            key={item.type}
            className="h-lib-btn"
            onClick={() => addComponent(item.type)}
            title={item.label}
          >
            <span className="h-icon" style={{ color: sec.color }}>
              <item.icon size={13} strokeWidth={1.9} />
            </span>
            {item.label}
          </button>
        ))}
      </div>
    ))}
  </div>
);

/* ─── Vertical sidebar (fallback / future use) ───────────────── */
const ToolbarVertical = ({ addComponent }) => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});

  const filtered = CATALOGUE.map((s) => ({
    ...s,
    items: s.items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="toolbar-wrapper">
      <div className="toolbar-header">
        <div className="toolbar-stats">
          <span>Components</span>
          <span className="count-badge">SDE v3</span>
        </div>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="toolbar-body">
        {filtered.map((sec) => (
          <div key={sec.id} className="section-group">
            <button
              className="section-trigger"
              onClick={() =>
                setCollapsed((c) => ({ ...c, [sec.id]: !c[sec.id] }))
              }
            >
              <div className="section-trigger-left">
                <div
                  className="section-dot"
                  style={{ backgroundColor: sec.color }}
                />
                {sec.label}
              </div>
              {collapsed[sec.id] ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {!collapsed[sec.id] && (
              <div className="items-grid">
                {sec.items.map((item) => (
                  <button
                    key={item.type}
                    className="library-btn"
                    onClick={() => addComponent(item.type)}
                  >
                    <div className="icon-wrapper" style={{ color: sec.color }}>
                      <item.icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main export ────────────────────────────────────────────── */
const Toolbar = ({ layout = "horizontal" }) => {
  const addComponent = useStore((s) => s.addComponent);
  if (layout === "horizontal")
    return <ToolbarHorizontal addComponent={addComponent} />;
  return <ToolbarVertical addComponent={addComponent} />;
};

export default Toolbar;
