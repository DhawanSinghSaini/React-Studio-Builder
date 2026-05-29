import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const LS_TREE = "sde_layout_tree";
const LS_CANVAS = "sde_canvas_bg";
const LS_DOT = "sde_dot_color";

const DEFAULT_ROOT = {
  id: "root",
  type: "container",
  styles: {
    padding: "48px",
    backgroundColor: "#ffffff",
    minHeight: "1200px",
    width: "960px",
    display: "block",
    margin: "0 auto",
    position: "relative",
    borderRadius: "8px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
  },
  children: [],
};

const loadTree = () => {
  try {
    const r = localStorage.getItem(LS_TREE);
    return r ? JSON.parse(r) : DEFAULT_ROOT;
  } catch {
    return DEFAULT_ROOT;
  }
};
const loadCanvas = () => localStorage.getItem(LS_CANVAS) || "#dde1e9";
const loadDot = () => localStorage.getItem(LS_DOT) || "rgba(99,102,241,0.22)";
const saveTree = (t) => {
  try {
    localStorage.setItem(LS_TREE, JSON.stringify(t));
  } catch {}
};
const saveCanvas = (c) => {
  try {
    localStorage.setItem(LS_CANVAS, c);
  } catch {}
};
const saveDot = (c) => {
  try {
    localStorage.setItem(LS_DOT, c);
  } catch {}
};

const DEFAULTS = {
  h1: {
    content: "H1 Heading",
    styles: {
      fontSize: "42px",
      fontWeight: "800",
      color: "#111111",
      padding: "8px 0",
      display: "block",
    },
  },
  h2: {
    content: "H2 Heading",
    styles: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#111111",
      padding: "8px 0",
      display: "block",
    },
  },
  h3: {
    content: "H3 Heading",
    styles: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#111111",
      padding: "8px 0",
      display: "block",
    },
  },
  text: {
    content: "This is a paragraph. Click to edit.",
    styles: {
      fontSize: "16px",
      color: "#333333",
      lineHeight: "1.6",
      padding: "8px 0",
      display: "block",
    },
  },
  label: {
    content: "Label Text",
    styles: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#444444",
      padding: "4px 0",
      display: "block",
    },
  },
  blockquote: {
    content: "This is a blockquote.",
    styles: {
      borderLeftWidth: "4px",
      borderLeftStyle: "solid",
      borderLeftColor: "#6366f1",
      paddingLeft: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
      fontStyle: "italic",
      color: "#555555",
      backgroundColor: "#f8f8ff",
      borderRadius: "0 6px 6px 0",
      display: "block",
    },
  },
  link: {
    content: "Click here",
    styles: {
      color: "#6366f1",
      textDecoration: "underline",
      cursor: "pointer",
      padding: "4px 0",
      display: "inline-block",
    },
  },
  button: {
    content: "Action Button",
    styles: {
      backgroundColor: "#6366f1",
      color: "#ffffff",
      borderRadius: "8px",
      cursor: "pointer",
      border: "none",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      display: "inline-block",
    },
  },
  input: {
    content: "",
    inputType: "text",
    styles: {
      padding: "10px 12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#d1d5db",
      borderRadius: "6px",
      width: "100%",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      color: "#111111",
      display: "block",
      boxSizing: "border-box",
    },
  },
  textarea: {
    content: "",
    styles: {
      padding: "10px 12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#d1d5db",
      borderRadius: "6px",
      width: "100%",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      color: "#111111",
      minHeight: "100px",
      resize: "vertical",
      display: "block",
      boxSizing: "border-box",
    },
  },
  select: {
    content: "Option 1\nOption 2\nOption 3",
    styles: {
      padding: "10px 12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#d1d5db",
      borderRadius: "6px",
      width: "100%",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      color: "#111111",
      display: "block",
    },
  },
  checkbox: {
    content: "Checkbox label",
    styles: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 0",
      fontSize: "14px",
      color: "#333333",
      accentColor: "#6366f1",
    },
  },
  toggle: {
    content: "Toggle label",
    styles: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 0",
      fontSize: "14px",
      color: "#333333",
      accentColor: "#6366f1",
    },
  },
  flex: {
    content: "",
    styles: {
      display: "flex",
      gap: "16px",
      padding: "16px",
      minHeight: "80px",
      borderWidth: "1px",
      borderStyle: "dashed",
      borderColor: "rgba(99,102,241,0.35)",
      borderRadius: "6px",
      backgroundColor: "rgba(99,102,241,0.03)",
    },
  },
  grid: {
    content: "",
    gridCols: 2,
    gridRows: 1,
    styles: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gridTemplateRows: "auto",
      gap: "16px",
      padding: "16px",
      minHeight: "80px",
      borderWidth: "1px",
      borderStyle: "dashed",
      borderColor: "rgba(99,102,241,0.35)",
      borderRadius: "6px",
      backgroundColor: "rgba(99,102,241,0.03)",
    },
  },
  section: {
    content: "",
    styles: {
      padding: "32px 24px",
      width: "100%",
      backgroundColor: "#f9fafb",
      borderWidth: "1px",
      borderStyle: "dashed",
      borderColor: "rgba(0,0,0,0.1)",
      borderRadius: "6px",
      display: "block",
    },
  },
  nav: {
    content: "",
    styles: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      backgroundColor: "#ffffff",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "#e5e7eb",
      width: "100%",
    },
  },
  spacer: {
    content: "",
    styles: { height: "32px", width: "100%", display: "block" },
  },
  divider: {
    content: "",
    styles: {
      width: "100%",
      height: "1px",
      backgroundColor: "#e5e7eb",
      border: "none",
      display: "block",
      margin: "16px 0",
    },
  },
  card: {
    content: "",
    styles: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      width: "280px",
    },
  },
  "form-group": {
    content: "",
    styles: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
      width: "100%",
    },
  },
  image: {
    content: "",
    styles: {
      width: "480px",
      height: "280px",
      objectFit: "cover",
      borderRadius: "8px",
      display: "block",
      backgroundColor: "#e5e7eb",
    },
  },
  video: {
    content: "",
    styles: {
      width: "560px",
      height: "315px",
      borderRadius: "8px",
      backgroundColor: "#1a1a2e",
      display: "block",
    },
  },
  audio: {
    content: "",
    styles: { width: "100%", display: "block", margin: "8px 0" },
  },
  iframe: {
    content: "",
    styles: {
      width: "100%",
      height: "360px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      borderRadius: "8px",
      display: "block",
      backgroundColor: "#f3f4f6",
    },
  },
  icon: {
    content: "Star",
    styles: {
      color: "#6366f1",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "48px",
      height: "48px",
    },
  },
  table: {
    content: "",
    tableHeaders: "Name,Email,Role",
    tableRows: 3,
    tableCols: 3,
    tableData: [],
    styles: { width: "100%", fontSize: "14px", backgroundColor: "#ffffff" },
  },
  ul: {
    content: "First item\nSecond item\nThird item",
    styles: {
      paddingLeft: "28px",
      paddingTop: "8px",
      paddingBottom: "8px",
      fontSize: "15px",
      color: "#333333",
      lineHeight: "1.8",
      listStyleType: "disc",
      display: "block",
    },
  },
  ol: {
    content: "First item\nSecond item\nThird item",
    styles: {
      paddingLeft: "28px",
      paddingTop: "8px",
      paddingBottom: "8px",
      fontSize: "15px",
      color: "#333333",
      lineHeight: "1.8",
      listStyleType: "decimal",
      display: "block",
    },
  },
  code: {
    content: '// Your code here\nconsole.log("Hello, world!");',
    styles: {
      fontFamily: "monospace",
      fontSize: "13px",
      backgroundColor: "#1e1e2e",
      color: "#cdd6f4",
      padding: "16px",
      borderRadius: "8px",
      display: "block",
      whiteSpace: "pre",
      overflowX: "auto",
      lineHeight: "1.6",
    },
  },
};

const makeNode = (type) => {
  const def = DEFAULTS[type] || {};
  return {
    id: `comp-${uuidv4().slice(0, 8)}`,
    type,
    styles: { ...(def.styles || { padding: "12px" }) },
    content: def.content ?? "",
    inputType: def.inputType ?? undefined,
    tableHeaders: def.tableHeaders ?? undefined,
    tableRows: def.tableRows ?? undefined,
    tableCols: def.tableCols ?? undefined,
    tableData: def.tableData ?? undefined,
    gridCols: def.gridCols ?? undefined,
    gridRows: def.gridRows ?? undefined,
    children: [],
  };
};

const MAX_HIST = 60;
const pushHist = (state, tree) => {
  const h = [...state.history.slice(0, state.historyIndex + 1), tree].slice(
    -MAX_HIST,
  );
  return { history: h, historyIndex: h.length - 1 };
};

const useStore = create((set, get) => {
  const initTree = loadTree();
  return {
    selectedElementId: "root",
    canvasBg: loadCanvas(),
    canvasDotColor: loadDot(),
    layoutTree: initTree,
    history: [initTree],
    historyIndex: 0,

    setCanvasBg: (c) => {
      saveCanvas(c);
      set({ canvasBg: c });
    },
    setCanvasDotColor: (c) => {
      saveDot(c);
      set({ canvasDotColor: c });
    },

    undo: () =>
      set((s) => {
        if (s.historyIndex <= 0) return s;
        const i = s.historyIndex - 1,
          t = s.history[i];
        saveTree(t);
        return { layoutTree: t, historyIndex: i, selectedElementId: "root" };
      }),
    redo: () =>
      set((s) => {
        if (s.historyIndex >= s.history.length - 1) return s;
        const i = s.historyIndex + 1,
          t = s.history[i];
        saveTree(t);
        return { layoutTree: t, historyIndex: i, selectedElementId: "root" };
      }),
    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    clearCanvas: () =>
      set((s) => {
        const fresh = { ...DEFAULT_ROOT, children: [] };
        saveTree(fresh);
        return {
          layoutTree: fresh,
          selectedElementId: "root",
          ...pushHist(s, fresh),
        };
      }),

    setSelectedElement: (id) => set({ selectedElementId: id }),

    addComponent: (type) =>
      set((s) => {
        const el = makeNode(type);
        const add = (node) => {
          if (node.id === s.selectedElementId)
            return { ...node, children: [...(node.children || []), el] };
          if (node.children)
            return { ...node, children: node.children.map(add) };
          return node;
        };
        const t = add(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, selectedElementId: el.id, ...pushHist(s, t) };
      }),

    updateStyles: (ns) =>
      set((s) => {
        const upd = (node) => {
          if (node.id === s.selectedElementId)
            return { ...node, styles: { ...node.styles, ...ns } };
          if (node.children)
            return { ...node, children: node.children.map(upd) };
          return node;
        };
        const t = upd(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),

    updateContent: (content) =>
      set((s) => {
        const upd = (node) => {
          if (node.id === s.selectedElementId) return { ...node, content };
          if (node.children)
            return { ...node, children: node.children.map(upd) };
          return node;
        };
        const t = upd(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),

    updateInputType: (inputType) =>
      set((s) => {
        const upd = (node) => {
          if (node.id === s.selectedElementId) return { ...node, inputType };
          if (node.children)
            return { ...node, children: node.children.map(upd) };
          return node;
        };
        const t = upd(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),

    updateGrid: (gridCols, gridRows) =>
      set((s) => {
        const cols = Math.max(1, parseInt(gridCols) || 1),
          rows = Math.max(1, parseInt(gridRows) || 1);
        const upd = (node) => {
          if (node.id === s.selectedElementId)
            return {
              ...node,
              gridCols: cols,
              gridRows: rows,
              styles: {
                ...node.styles,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: rows > 1 ? `repeat(${rows}, auto)` : "auto",
              },
            };
          if (node.children)
            return { ...node, children: node.children.map(upd) };
          return node;
        };
        const t = upd(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),

    updateTableMeta: (patch) =>
      set((s) => {
        const upd = (node) => {
          if (node.id === s.selectedElementId) return { ...node, ...patch };
          if (node.children)
            return { ...node, children: node.children.map(upd) };
          return node;
        };
        const t = upd(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),

    deleteElement: () =>
      set((s) => {
        if (s.selectedElementId === "root") return s;
        const rem = (node) => {
          if (!node.children) return node;
          return {
            ...node,
            children: node.children
              .filter((c) => c.id !== s.selectedElementId)
              .map(rem),
          };
        };
        const t = rem(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, selectedElementId: "root", ...pushHist(s, t) };
      }),

    moveElement: (id, dir) =>
      set((s) => {
        const mv = (node) => {
          if (!node.children) return node;
          const idx = node.children.findIndex((c) => c.id === id);
          if (idx !== -1) {
            const kids = [...node.children];
            const tgt = dir === "up" ? idx - 1 : idx + 1;
            if (tgt < 0 || tgt >= kids.length) return node;
            [kids[idx], kids[tgt]] = [kids[tgt], kids[idx]];
            return { ...node, children: kids };
          }
          return { ...node, children: node.children.map(mv) };
        };
        const t = mv(s.layoutTree);
        saveTree(t);
        return { layoutTree: t, ...pushHist(s, t) };
      }),
  };
});
export default useStore;
