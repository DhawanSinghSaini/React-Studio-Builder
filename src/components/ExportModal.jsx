import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import "./ExportModal.css";
import { X, Copy, Download, Check, Code2, FileCode } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  STYLE COMPILER  —  camelCase React styles → kebab-case CSS
// ═══════════════════════════════════════════════════════════════

// Keys that are metadata, not CSS
const NON_STYLE_KEYS = new Set([
  "src",
  "alt",
  "poster",
  "href",
  "sandbox",
  "title",
  "htmlFor",
  "controls",
  "autoplay",
  "loop",
  "muted",
  "objectFit",
  "checked",
  "accentColor",
  "placeholder",
  "language",
  "tableRows",
  "tableCols",
  "tableHeaders",
  "gridArea",
  "iconSize",
  "strokeWidth",
]);

// camelCase → kebab-case
const toKebab = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase();

// Transform keys that differ between React style and CSS
const REACT_TO_CSS = {
  backgroundColor: "background-color",
  borderRadius: "border-radius",
  borderWidth: "border-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderTopLeftRadius: "border-top-left-radius",
  borderTopRightRadius: "border-top-right-radius",
  borderBottomLeftRadius: "border-bottom-left-radius",
  borderBottomRightRadius: "border-bottom-right-radius",
  borderLeftWidth: "border-left-width",
  borderLeftStyle: "border-left-style",
  borderLeftColor: "border-left-color",
  borderBottomWidth: "border-bottom-width",
  borderBottomStyle: "border-bottom-style",
  borderBottomColor: "border-bottom-color",
  boxShadow: "box-shadow",
  fontSize: "font-size",
  fontWeight: "font-weight",
  fontFamily: "font-family",
  fontStyle: "font-style",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  textAlign: "text-align",
  textDecoration: "text-decoration",
  textTransform: "text-transform",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  alignItems: "align-items",
  flexWrap: "flex-wrap",
  gridTemplateColumns: "grid-template-columns",
  gridTemplateRows: "grid-template-rows",
  gridArea: "grid-area",
  minHeight: "min-height",
  maxWidth: "max-width",
  maxHeight: "max-height",
  minWidth: "min-width",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
  zIndex: "z-index",
  objectFit: "object-fit",
  listStyleType: "list-style-type",
  userSelect: "user-select",
  boxSizing: "box-sizing",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  transitionProperty: "transition-property",
  transitionDuration: "transition-duration",
  transitionTimingFunction: "transition-timing-function",
  transitionDelay: "transition-delay",
  animationDuration: "animation-duration",
  animationDelay: "animation-delay",
  animationIterationCount: "animation-iteration-count",
  animationTimingFunction: "animation-timing-function",
};

// Build CSS rule string from a styles object
const buildCSSRule = (selector, styles) => {
  const lines = [];
  Object.entries(styles).forEach(([key, val]) => {
    if (!val && val !== 0) return;
    if (NON_STYLE_KEYS.has(key)) return;
    // Skip transform sub-properties (handled separately)
    if (
      [
        "translateX",
        "translateY",
        "rotate",
        "scale",
        "animationPreset",
      ].includes(key)
    )
      return;
    const cssKey = REACT_TO_CSS[key] || toKebab(key);
    lines.push(`  ${cssKey}: ${val};`);
  });

  // Compose transform
  const s = styles;
  const transforms = [];
  if (s.translateX && s.translateX !== "0px")
    transforms.push(`translateX(${s.translateX})`);
  if (s.translateY && s.translateY !== "0px")
    transforms.push(`translateY(${s.translateY})`);
  if (s.rotate && s.rotate !== "0deg") transforms.push(`rotate(${s.rotate})`);
  if (s.scale && parseFloat(s.scale) !== 1)
    transforms.push(`scale(${s.scale})`);
  if (transforms.length) lines.push(`  transform: ${transforms.join(" ")};`);

  if (!lines.length) return "";
  return `${selector} {\n${lines.join("\n")}\n}`;
};

// ═══════════════════════════════════════════════════════════════
//  JSX COMPILER  —  node tree → React JSX string
// ═══════════════════════════════════════════════════════════════

const TAG_MAP = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  text: "p",
  label: "label",
  button: "button",
  link: "a",
  nav: "nav",
  section: "section",
  blockquote: "blockquote",
  flex: "div",
  grid: "div",
  card: "div",
  "form-group": "div",
  spacer: "div",
  container: "div",
  input: "input",
  textarea: "textarea",
  select: "select",
  ul: "ul",
  ol: "ol",
  code: "pre",
  table: "table",
  image: "img",
  video: "video",
  audio: "audio",
  iframe: "iframe",
  divider: "hr",
  icon: "span",
};

const indent = (n) => "  ".repeat(n);

const nodeToJSX = (node, depth = 0) => {
  if (!node) return "";
  const pad = indent(depth);
  const tag = TAG_MAP[node.type] || "div";
  const cls = `s_${node.id}`;

  // Self-closing elements
  if (node.type === "input") {
    return `${pad}<input className="${cls}" type="${node.inputType || "text"}" placeholder="${node.content || ""}" />`;
  }
  if (node.type === "image") {
    return `${pad}<img className="${cls}" src="${node.styles?.src || ""}" alt="${node.styles?.alt || ""}" />`;
  }
  if (node.type === "divider") {
    return `${pad}<hr className="${cls}" />`;
  }

  // Special content elements
  if (node.type === "textarea") {
    return `${pad}<textarea className="${cls}" placeholder="${node.content || ""}"></textarea>`;
  }
  if (node.type === "select") {
    const opts = (node.content || "")
      .split("\n")
      .filter(Boolean)
      .map((o) => `${pad}  <option>${o.trim()}</option>`)
      .join("\n");
    return `${pad}<select className="${cls}">\n${opts}\n${pad}</select>`;
  }
  if (node.type === "ul" || node.type === "ol") {
    const items = (node.content || "")
      .split("\n")
      .filter(Boolean)
      .map((o) => `${pad}  <li>${o.trim()}</li>`)
      .join("\n");
    return `${pad}<${tag} className="${cls}">\n${items}\n${pad}</${tag}>`;
  }
  if (node.type === "code") {
    return `${pad}<pre className="${cls}">\n${pad}  <code>{String.raw\`${node.content || ""}\`}</code>\n${pad}</pre>`;
  }
  if (node.type === "video") {
    const attrs = [
      node.styles?.src ? `src="${node.styles.src}"` : "",
      node.styles?.poster ? `poster="${node.styles.poster}"` : "",
      node.styles?.controls !== "Hide" ? "controls" : "",
      node.styles?.autoplay === "On" ? "autoPlay" : "",
      node.styles?.loop === "On" ? "loop" : "",
      node.styles?.muted === "On" ? "muted" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `${pad}<video className="${cls}" ${attrs} />`;
  }
  if (node.type === "audio") {
    const attrs = [
      node.styles?.src ? `src="${node.styles.src}"` : "",
      node.styles?.controls !== "Hide" ? "controls" : "",
      node.styles?.loop === "On" ? "loop" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `${pad}<audio className="${cls}" ${attrs} />`;
  }
  if (node.type === "iframe") {
    return `${pad}<iframe className="${cls}" src="${node.styles?.src || ""}" title="${node.styles?.title || ""}" />`;
  }
  if (node.type === "table") {
    const headers = (node.tableHeaders || "").split(",").map((h) => h.trim());
    const rows = parseInt(node.tableRows) || 3;
    const data = node.tableData || [];
    const head = headers.map((h) => `${pad}      <th>${h}</th>`).join("\n");
    const body = Array.from({ length: rows })
      .map((_, ri) => {
        const cells = headers
          .map((_, ci) => `${pad}      <td>${data[ri]?.[ci] || ""}</td>`)
          .join("\n");
        return `${pad}    <tr>\n${cells}\n${pad}    </tr>`;
      })
      .join("\n");
    return `${pad}<table className="${cls}">\n${pad}  <thead>\n${pad}    <tr>\n${head}\n${pad}    </tr>\n${pad}  </thead>\n${pad}  <tbody>\n${body}\n${pad}  </tbody>\n${pad}</table>`;
  }
  if (node.type === "icon") {
    // Renders as a span with an aria-label; real icon lib usage noted in comment
    return `${pad}<span className="${cls}" aria-label="${node.content || "icon"}">{/* Icon: ${node.content || "Star"} */}</span>`;
  }
  if (node.type === "link") {
    return `${pad}<a className="${cls}" href="${node.styles?.href || "#"}">${node.content || "Link"}</a>`;
  }

  // Children
  const children = (node.children || [])
    .map((c) => nodeToJSX(c, depth + 1))
    .filter(Boolean);
  const textContent = node.content
    ? `${pad}  {${JSON.stringify(node.content)}}`
    : "";
  const innerLines = [textContent, ...children].filter(Boolean);

  if (innerLines.length === 0) {
    return `${pad}<${tag} className="${cls}"></${tag}>`;
  }

  return `${pad}<${tag} className="${cls}">\n${innerLines.join("\n")}\n${pad}</${tag}>`;
};

// ═══════════════════════════════════════════════════════════════
//  CSS COLLECTOR  —  walk tree, collect all CSS classes
// ═══════════════════════════════════════════════════════════════

const collectCSS = (node, rules = []) => {
  if (!node) return rules;
  const cls = `s_${node.id}`;
  const rule = buildCSSRule(`.${cls}`, node.styles || {});
  if (rule) rules.push(rule);
  (node.children || []).forEach((c) => collectCSS(c, rules));
  return rules;
};

// ═══════════════════════════════════════════════════════════════
//  FULL FILE GENERATORS
// ═══════════════════════════════════════════════════════════════

const generateReactFile = (tree) => {
  const inner = nodeToJSX(tree, 2);
  return `import React from 'react';
import './App.css';

const App = () => {
  return (
${inner}
  );
};

export default App;
`;
};

const generateCSSFile = (tree) => {
  const rules = collectCSS(tree);
  const header = `/* Generated by Studio Design Editor */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\n`;
  return header + rules.join("\n\n");
};

// ═══════════════════════════════════════════════════════════════
//  COPY / DOWNLOAD HELPERS
// ═══════════════════════════════════════════════════════════════

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ═══════════════════════════════════════════════════════════════
//  SYNTAX HIGHLIGHTER  (lightweight, no deps)
// ═══════════════════════════════════════════════════════════════

const highlight = (code, lang) => {
  if (lang === "jsx") {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /(import\s|from\s|export\s|default\s|const\s|return\s)/g,
        '<span class="kw">$1</span>',
      )
      .replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        '<span class="str">$1</span>',
      )
      .replace(/(\/\/.*)/g, '<span class="cmt">$1</span>')
      .replace(/(&lt;\/?[A-Z][a-zA-Z]*)/g, '<span class="comp">$1</span>')
      .replace(/(&lt;\/?[a-z]+)/g, '<span class="tag">$1</span>')
      .replace(
        /(className|src|href|type|alt|controls|autoPlay|loop|muted|poster)=/g,
        '<span class="attr">$1</span>=',
      );
  }
  if (lang === "css") {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cmt">$1</span>')
      .replace(
        /(\.[a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{/g,
        '<span class="sel">$1</span> {',
      )
      .replace(/([\w-]+)(\s*:)/g, '<span class="prop">$1</span>$2')
      .replace(/:\s*([^;}\n]+)/g, ': <span class="val">$1</span>');
  }
  return code;
};

// ═══════════════════════════════════════════════════════════════
//  EXPORT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

const ExportModal = ({ onClose }) => {
  const { layoutTree } = useStore();
  const [activeTab, setActiveTab] = useState("jsx");
  const [copied, setCopied] = useState(false);

  const jsxCode = useMemo(() => generateReactFile(layoutTree), [layoutTree]);
  const cssCode = useMemo(() => generateCSSFile(layoutTree), [layoutTree]);

  const activeCode = activeTab === "jsx" ? jsxCode : cssCode;
  const activeLang = activeTab;

  const handleCopy = async () => {
    const ok = await copyToClipboard(activeCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (activeTab === "jsx") downloadFile("App.jsx", jsxCode);
    else downloadFile("App.css", cssCode);
  };

  const handleDownloadAll = () => {
    downloadFile("App.jsx", jsxCode);
    downloadFile("App.css", cssCode);
  };

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="export-header">
          <div className="export-header-left">
            <Code2 size={16} style={{ color: "#6366f1" }} />
            <span className="export-title">Export Code</span>
            <span className="export-subtitle">Clean React + CSS</span>
          </div>
          <div className="export-header-right">
            <button
              className="export-dl-all"
              onClick={handleDownloadAll}
              title="Download both files"
            >
              <Download size={13} /> Download All
            </button>
            <button className="export-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="export-tabs">
          <button
            className={`export-tab${activeTab === "jsx" ? " active" : ""}`}
            onClick={() => setActiveTab("jsx")}
          >
            <FileCode size={12} /> App.jsx
          </button>
          <button
            className={`export-tab${activeTab === "css" ? " active" : ""}`}
            onClick={() => setActiveTab("css")}
          >
            <FileCode size={12} /> App.css
          </button>
          <div className="export-tab-spacer" />
          <button
            className={`export-action-btn${copied ? " copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={12} /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
          <button className="export-action-btn" onClick={handleDownload}>
            <Download size={12} /> {activeTab === "jsx" ? "App.jsx" : "App.css"}
          </button>
        </div>

        {/* Code block */}
        <div className="export-code-wrap">
          <pre className="export-pre">
            <code
              dangerouslySetInnerHTML={{
                __html: highlight(activeCode, activeLang),
              }}
            />
          </pre>
        </div>

        {/* Footer */}
        <div className="export-footer">
          <span>
            React 18 · className-based styles · No external dependencies
          </span>
          <span>{activeCode.split("\n").length} lines</span>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
