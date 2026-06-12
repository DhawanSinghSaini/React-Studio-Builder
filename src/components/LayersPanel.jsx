import React, { useState } from "react";
import useStore from "../store/useStore";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  LayoutGrid,
  PanelTop,
  Navigation,
  CreditCard,
  CheckSquare,
  Minus,
  Hash,
  AlignLeft,
  Type,
  Link,
  MessageSquare,
  MousePointer2,
  TextCursorInput,
  ToggleLeft,
  Globe,
  Image,
  Video,
  Music,
  Star,
  Table,
  List,
  ListOrdered,
  Terminal,
  MoveVertical,
  Box,
} from "lucide-react";
import "./LayersPanel.css";

const ICONS = {
  container: Box,
  flex: Layers,
  grid: LayoutGrid,
  section: PanelTop,
  nav: Navigation,
  spacer: MoveVertical,
  card: CreditCard,
  "form-group": CheckSquare,
  divider: Minus,
  h1: Hash,
  h2: Hash,
  h3: Hash,
  text: AlignLeft,
  label: Type,
  blockquote: MessageSquare,
  link: Link,
  button: MousePointer2,
  input: TextCursorInput,
  textarea: AlignLeft,
  select: List,
  checkbox: CheckSquare,
  toggle: ToggleLeft,
  image: Image,
  video: Video,
  audio: Music,
  iframe: Globe,
  icon: Star,
  table: Table,
  ul: List,
  ol: ListOrdered,
  code: Terminal,
};
const COLORS = {
  flex: "#6366f1",
  grid: "#6366f1",
  section: "#6366f1",
  nav: "#6366f1",
  spacer: "#6366f1",
  container: "#6366f1",
  card: "#ec4899",
  "form-group": "#ec4899",
  divider: "#ec4899",
  h1: "#f59e0b",
  h2: "#f59e0b",
  h3: "#f59e0b",
  text: "#f59e0b",
  label: "#f59e0b",
  blockquote: "#f59e0b",
  link: "#f59e0b",
  button: "#ef4444",
  input: "#ef4444",
  textarea: "#ef4444",
  select: "#ef4444",
  checkbox: "#ef4444",
  toggle: "#ef4444",
  image: "#8b5cf6",
  video: "#8b5cf6",
  audio: "#8b5cf6",
  iframe: "#8b5cf6",
  icon: "#8b5cf6",
  table: "#10b981",
  ul: "#10b981",
  ol: "#10b981",
  code: "#10b981",
};
const LABELS = {
  container: "Canvas",
  flex: "Flexbox",
  grid: "Grid",
  section: "Section",
  nav: "Nav",
  spacer: "Spacer",
  card: "Card",
  "form-group": "Form Group",
  divider: "Divider",
  h1: "H1",
  h2: "H2",
  h3: "H3",
  text: "Para",
  label: "Label",
  blockquote: "Quote",
  link: "Link",
  button: "Button",
  input: "Input",
  textarea: "Textarea",
  select: "Dropdown",
  checkbox: "Checkbox",
  toggle: "Toggle",
  image: "Image",
  video: "Video",
  audio: "Audio",
  iframe: "Iframe",
  icon: "Icon",
  table: "Table",
  ul: "UL",
  ol: "OL",
  code: "Code",
};
const CTRS = new Set([
  "container",
  "flex",
  "grid",
  "section",
  "nav",
  "card",
  "form-group",
]);

const Row = ({ node, depth = 0 }) => {
  const { selectedElementId, setSelectedElement, deleteElement, moveElement } =
    useStore();
  const [open, setOpen] = useState(depth < 2);
  const isSel = selectedElementId === node.id,
    isRoot = node.id === "root";
  const hasKids = node.children?.length > 0;
  const Ic = ICONS[node.type] || Box;
  const col = COLORS[node.type] || "#6366f1";
  const lbl = LABELS[node.type] || node.type;
  const prev = node.content
    ? ` — ${String(node.content).slice(0, 14)}${node.content.length > 14 ? "…" : ""}`
    : "";
  const del = (e) => {
    e.stopPropagation();
    if (isRoot) return;
    if (selectedElementId === node.id) setSelectedElement("root");
    deleteElement();
  };
  return (
    <div className="layer-node">
      <div
        className={`layer-row${isSel ? " selected" : ""}`}
        style={{ paddingLeft: `${6 + depth * 13}px` }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(node.id);
        }}
      >
        <button
          className="layer-chevron"
          style={{
            visibility: hasKids || CTRS.has(node.type) ? "visible" : "hidden",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        <div className="layer-icon" style={{ color: col }}>
          <Ic size={11} strokeWidth={2} />
        </div>
        <span className="layer-label">{lbl}</span>
        {prev && <span className="layer-preview">{prev}</span>}
        {!isRoot && (
          <div className="layer-actions">
            <button
              title="Up"
              onClick={(e) => {
                e.stopPropagation();
                moveElement(node.id, "up");
              }}
            >
              <ArrowUp size={9} />
            </button>
            <button
              title="Down"
              onClick={(e) => {
                e.stopPropagation();
                moveElement(node.id, "down");
              }}
            >
              <ArrowDown size={9} />
            </button>
            <button title="Delete" className="layer-del" onClick={del}>
              <Trash2 size={9} />
            </button>
          </div>
        )}
      </div>
      {open &&
        node.children?.map((c) => (
          <Row key={c.id} node={c} depth={depth + 1} />
        ))}
      {open && CTRS.has(node.type) && !hasKids && (
        <div
          className="layer-empty-hint"
          style={{ paddingLeft: `${6 + (depth + 1) * 13}px` }}
        >
          empty
        </div>
      )}
    </div>
  );
};

const LayersPanel = () => {
  const { layoutTree } = useStore();
  return (
    <div className="layers-wrapper">
      <div className="layers-header">
        <span className="layers-title">Layers</span>
      </div>
      <div className="layers-body">
        <Row node={layoutTree} depth={0} />
      </div>
    </div>
  );
};
export default LayersPanel;
