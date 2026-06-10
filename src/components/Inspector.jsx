import React, { useState } from "react";
import useStore from "../store/useStore";
import "./Inspector.css";
import { ELEMENT_SCHEMA, TYPE_COLOR, TYPE_LABEL } from "../constants/schema";
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type,
  Layout,
  PlayCircle,
  Settings2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVE FIELD COMPONENTS
═══════════════════════════════════════════════════════════════ */

const Field = ({ label, children }) => (
  <div className="ip-field">
    {label && <span className="ip-label">{label}</span>}
    {children}
  </div>
);

const UNITS = ["px", "%", "rem", "em", "vh", "vw", "auto"];

const UnitInput = ({ label, value = "", onChange }) => {
  const raw = String(value ?? "");
  const isAuto = raw === "auto";
  const num = isAuto ? "" : parseFloat(raw) || 0;
  const unit = isAuto ? "auto" : raw.replace(/[\d.\-]/g, "") || "px";
  return (
    <Field label={label}>
      <div className="ip-unit-wrap">
        <input
          className="ip-unit-num"
          type="number"
          value={isAuto ? "" : num}
          disabled={unit === "auto"}
          placeholder={unit === "auto" ? "auto" : "0"}
          onChange={(e) =>
            onChange(unit === "auto" ? "auto" : `${e.target.value}${unit}`)
          }
        />
        <select
          className="ip-unit-sel"
          value={unit}
          onChange={(e) =>
            onChange(
              e.target.value === "auto"
                ? "auto"
                : `${num || 0}${e.target.value}`,
            )
          }
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
};

const TextInput = ({ label, value = "", onChange, placeholder = "" }) => (
  <Field label={label}>
    <input
      className="ip-input"
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </Field>
);

const TextArea = ({
  label,
  value = "",
  onChange,
  placeholder = "",
  style = {},
}) => (
  <Field label={label}>
    <textarea
      className="ip-textarea"
      value={value}
      placeholder={placeholder}
      style={style}
      onChange={(e) => onChange(e.target.value)}
    />
  </Field>
);

const SelectInput = ({ label, value = "", options = [], onChange }) => (
  <Field label={label}>
    <select
      className="ip-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => {
        const v = typeof o === "object" ? o.value : o;
        const l = typeof o === "object" ? o.label : o;
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </select>
  </Field>
);

const ColorField = ({ label, value = "#000000", onChange }) => {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  return (
    <Field label={label}>
      <div className="ip-color-wrap">
        <div
          className="ip-color-swatch"
          style={{ background: value || "#000" }}
        >
          <input
            type="color"
            value={safeHex}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <input
          className="ip-color-hex"
          value={value}
          placeholder="#000000"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
};

const RangeField = ({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
}) => {
  const num = parseFloat(value) || 0;
  return (
    <Field label={label}>
      <div className="ip-range-wrap">
        <input
          className="ip-range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={num}
          onChange={(e) =>
            onChange(
              unit ? `${e.target.value}${unit}` : parseFloat(e.target.value),
            )
          }
        />
        <span className="ip-range-val">
          {num}
          {unit}
        </span>
      </div>
    </Field>
  );
};

const Chips = ({ label, options = [], value, onChange }) => (
  <Field label={label}>
    <div className="ip-chips">
      {options.map((o) => (
        <span
          key={o}
          className={`ip-chip${value === o ? " active" : ""}`}
          onClick={() => onChange(o)}
        >
          {o}
        </span>
      ))}
    </div>
  </Field>
);

const ToggleGroup = ({ label, options = [], value, onChange }) => (
  <Field label={label}>
    <div className="ip-toggle-group">
      {options.map((o) => (
        <button
          key={o.value}
          className={`ip-toggle-btn${value === o.value ? " active" : ""}`}
          title={o.value}
          onClick={() => onChange(o.value)}
        >
          {o.icon ? (
            <o.icon size={13} strokeWidth={2} />
          ) : (
            <span>{o.label}</span>
          )}
        </button>
      ))}
    </div>
  </Field>
);

const SpacingBox = ({
  label = "Padding",
  tKey,
  rKey,
  bKey,
  lKey,
  s,
  onUpdate,
}) => (
  <Field label={label}>
    <div className="ip-spacing-box">
      <div className="ip-spacing-grid">
        <div className="ip-spacing-top">
          <input
            className="ip-sp-input"
            value={parseFloat(s[tKey]) || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate({
                [tKey]: e.target.value ? `${e.target.value}px` : "0px",
              })
            }
          />
        </div>
        <div className="ip-spacing-left">
          <input
            className="ip-sp-input"
            value={parseFloat(s[lKey]) || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate({
                [lKey]: e.target.value ? `${e.target.value}px` : "0px",
              })
            }
          />
        </div>
        <div className="ip-spacing-center">
          <span className="ip-spacing-center-label">
            {label.slice(0, 3).toUpperCase()}
          </span>
        </div>
        <div className="ip-spacing-right">
          <input
            className="ip-sp-input"
            value={parseFloat(s[rKey]) || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate({
                [rKey]: e.target.value ? `${e.target.value}px` : "0px",
              })
            }
          />
        </div>
        <div className="ip-spacing-bottom">
          <input
            className="ip-sp-input"
            value={parseFloat(s[bKey]) || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate({
                [bKey]: e.target.value ? `${e.target.value}px` : "0px",
              })
            }
          />
        </div>
      </div>
    </div>
  </Field>
);

/* ═══════════════════════════════════════════════════════════════
   SHADOW BUILDER
═══════════════════════════════════════════════════════════════ */
const ShadowBuilder = ({ s, u }) => {
  const parsed = (() => {
    const m = (s.boxShadow || "").match(
      /([-\d.]+)px\s+([-\d.]+)px\s+([\d.]+)px\s+([-\d.]+)px\s+(.+)/,
    );
    if (m)
      return {
        x: +m[1],
        y: +m[2],
        blur: +m[3],
        spread: +m[4],
        color: m[5].trim(),
      };
    return { x: 0, y: 4, blur: 12, spread: 0, color: "rgba(0,0,0,0.3)" };
  })();
  const [sw, setSw] = useState(parsed);
  const apply = (next) => {
    setSw(next);
    u({
      boxShadow: `${next.x}px ${next.y}px ${next.blur}px ${next.spread}px ${next.color}`,
    });
  };
  return (
    <>
      <div
        className="ip-shadow-preview"
        style={{
          boxShadow: `${sw.x}px ${sw.y}px ${sw.blur}px ${sw.spread}px ${sw.color}`,
        }}
      />
      <RangeField
        label="Offset X"
        value={sw.x}
        min={-60}
        max={60}
        unit="px"
        onChange={(v) => apply({ ...sw, x: parseFloat(v) })}
      />
      <RangeField
        label="Offset Y"
        value={sw.y}
        min={-60}
        max={60}
        unit="px"
        onChange={(v) => apply({ ...sw, y: parseFloat(v) })}
      />
      <RangeField
        label="Blur"
        value={sw.blur}
        min={0}
        max={120}
        unit="px"
        onChange={(v) => apply({ ...sw, blur: parseFloat(v) })}
      />
      <RangeField
        label="Spread"
        value={sw.spread}
        min={-40}
        max={40}
        unit="px"
        onChange={(v) => apply({ ...sw, spread: parseFloat(v) })}
      />
      <ColorField
        label="Shadow Color"
        value={/^#/.test(sw.color) ? sw.color : "#000000"}
        onChange={(v) => apply({ ...sw, color: v })}
      />
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION (mirrors Toolbar section-trigger)
═══════════════════════════════════════════════════════════════ */
const Section = ({
  title,
  color = "rgba(255,255,255,0.3)",
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ip-section">
      <button className="ip-section-trigger" onClick={() => setOpen((o) => !o)}>
        <div className="ip-section-trigger-left">
          <div className="ip-section-dot" style={{ background: color }} />
          {title}
        </div>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && <div className="ip-section-body">{children}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FIELD RENDERERS — keyed by schema field string
   All receive: { s, u, el, updateContent, updateInputType }
═══════════════════════════════════════════════════════════════ */
const FR = {
  // ── CONTENT FIELDS ───────────────────────────────────────
  textContent: ({ el, updateContent }) => (
    <TextArea
      key="textContent"
      label="Content"
      value={el.content || ""}
      onChange={updateContent}
      style={
        el.type === "code"
          ? { fontFamily: "monospace", minHeight: 96, fontSize: 11 }
          : {}
      }
      placeholder={el.type === "code" ? "// code here" : "Enter text…"}
    />
  ),
  placeholder: ({ el, updateContent }) => (
    <TextInput
      key="placeholder"
      label="Placeholder"
      value={el.content || ""}
      onChange={updateContent}
    />
  ),
  "input-type": ({ el, updateInputType }) => (
    <SelectInput
      key="input-type"
      label="Input Type"
      value={el.inputType || "text"}
      options={[
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "date",
        "time",
        "color",
        "file",
        "range",
        "search",
      ]}
      onChange={updateInputType}
    />
  ),
  rows: ({ s, u }) => (
    <TextInput
      key="rows"
      label="Rows"
      value={s.rows || "4"}
      onChange={(v) => u({ rows: v })}
    />
  ),
  options: ({ el, updateContent }) => (
    <TextArea
      key="options"
      label="Options (one per line)"
      value={el.content || ""}
      placeholder={"Option 1\nOption 2\nOption 3"}
      onChange={updateContent}
    />
  ),
  checked: ({ s, u }) => (
    <Chips
      key="checked"
      label="Default State"
      options={["Checked", "Unchecked"]}
      value={s.checked || "Unchecked"}
      onChange={(v) => u({ checked: v })}
    />
  ),
  src: ({ s, u }) => (
    <TextInput
      key="src"
      label="src URL"
      value={s.src || ""}
      onChange={(v) => u({ src: v })}
      placeholder="https://…"
    />
  ),
  alt: ({ s, u }) => (
    <TextInput
      key="alt"
      label="Alt Text"
      value={s.alt || ""}
      onChange={(v) => u({ alt: v })}
    />
  ),
  "object-fit": ({ s, u }) => (
    <SelectInput
      key="object-fit"
      label="Object Fit"
      value={s.objectFit || "cover"}
      options={["cover", "contain", "fill", "none", "scale-down"]}
      onChange={(v) => u({ objectFit: v })}
    />
  ),
  poster: ({ s, u }) => (
    <TextInput
      key="poster"
      label="Poster URL"
      value={s.poster || ""}
      onChange={(v) => u({ poster: v })}
    />
  ),
  controls: ({ s, u }) => (
    <Chips
      key="controls"
      label="Controls"
      options={["Show", "Hide"]}
      value={s.controls || "Show"}
      onChange={(v) => u({ controls: v })}
    />
  ),
  autoplay: ({ s, u }) => (
    <Chips
      key="autoplay"
      label="Autoplay"
      options={["On", "Off"]}
      value={s.autoplay || "Off"}
      onChange={(v) => u({ autoplay: v })}
    />
  ),
  loop: ({ s, u }) => (
    <Chips
      key="loop"
      label="Loop"
      options={["On", "Off"]}
      value={s.loop || "Off"}
      onChange={(v) => u({ loop: v })}
    />
  ),
  muted: ({ s, u }) => (
    <Chips
      key="muted"
      label="Muted"
      options={["On", "Off"]}
      value={s.muted || "Off"}
      onChange={(v) => u({ muted: v })}
    />
  ),
  sandbox: ({ s, u }) => (
    <SelectInput
      key="sandbox"
      label="Sandbox"
      value={s.sandbox || "allow-scripts"}
      options={[
        "allow-scripts",
        "allow-forms",
        "allow-same-origin",
        "allow-all",
        "none",
      ]}
      onChange={(v) => u({ sandbox: v })}
    />
  ),
  "icon-name": ({ el, updateContent }) => (
    <TextInput
      key="icon-name"
      label="Icon Name (Lucide)"
      value={el.content || ""}
      onChange={updateContent}
      placeholder="e.g. Star"
    />
  ),
  "icon-size": ({ s, u }) => (
    <UnitInput
      key="icon-size"
      label="Icon Size"
      value={s.iconSize || "24px"}
      onChange={(v) => u({ iconSize: v })}
    />
  ),
  "stroke-width": ({ s, u }) => (
    <RangeField
      key="stroke-width"
      label="Stroke Width"
      value={parseFloat(s.strokeWidth) || 1.5}
      min={0.5}
      max={4}
      step={0.25}
      onChange={(v) => u({ strokeWidth: v })}
    />
  ),
  href: ({ s, u }) => (
    <TextInput
      key="href"
      label="href URL"
      value={s.href || ""}
      onChange={(v) => u({ href: v })}
      placeholder="https://…"
    />
  ),
  cite: ({ s, u }) => (
    <TextInput
      key="cite"
      label="Citation"
      value={s.cite || ""}
      onChange={(v) => u({ cite: v })}
    />
  ),
  for: ({ s, u }) => (
    <TextInput
      key="for"
      label="for (input id)"
      value={s.htmlFor || ""}
      onChange={(v) => u({ htmlFor: v })}
    />
  ),
  language: ({ s, u }) => (
    <SelectInput
      key="language"
      label="Language"
      value={s.language || "javascript"}
      options={[
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "html",
        "css",
        "python",
        "json",
        "bash",
        "sql",
        "rust",
        "go",
      ]}
      onChange={(v) => u({ language: v })}
    />
  ),
  "list-style-type": ({ el, s, u }) => (
    <SelectInput
      key="list-style-type"
      label="List Style"
      value={s.listStyleType || (el.type === "ol" ? "decimal" : "disc")}
      options={
        el.type === "ol"
          ? [
              "decimal",
              "decimal-leading-zero",
              "lower-alpha",
              "upper-alpha",
              "lower-roman",
              "upper-roman",
              "none",
            ]
          : ["disc", "circle", "square", "none"]
      }
      onChange={(v) => u({ listStyleType: v })}
    />
  ),
  "table-rows": ({ s, u }) => (
    <TextInput
      key="table-rows"
      label="Rows"
      value={s.tableRows || "4"}
      onChange={(v) => u({ tableRows: v })}
    />
  ),
  "table-cols": ({ s, u }) => (
    <TextInput
      key="table-cols"
      label="Columns"
      value={s.tableCols || "3"}
      onChange={(v) => u({ tableCols: v })}
    />
  ),
  "table-headers": ({ s, u }) => (
    <TextArea
      key="table-headers"
      label="Headers (comma-separated)"
      value={s.tableHeaders || ""}
      placeholder="Name, Age, Role"
      onChange={(v) => u({ tableHeaders: v })}
      style={{ minHeight: 44 }}
    />
  ),

  // ── LAYOUT FIELDS ────────────────────────────────────────
  width: ({ s, u }) => (
    <UnitInput
      key="width"
      label="Width"
      value={s.width}
      onChange={(v) => u({ width: v })}
    />
  ),
  height: ({ s, u }) => (
    <UnitInput
      key="height"
      label="Height"
      value={s.height}
      onChange={(v) => u({ height: v })}
    />
  ),
  padding: ({ s, u }) => (
    <SpacingBox
      key="padding"
      label="Padding"
      tKey="paddingTop"
      rKey="paddingRight"
      bKey="paddingBottom"
      lKey="paddingLeft"
      s={s}
      onUpdate={u}
    />
  ),
  margin: ({ s, u }) => (
    <SpacingBox
      key="margin"
      label="Margin"
      tKey="marginTop"
      rKey="marginRight"
      bKey="marginBottom"
      lKey="marginLeft"
      s={s}
      onUpdate={u}
    />
  ),
  gap: ({ s, u }) => (
    <UnitInput
      key="gap"
      label="Gap"
      value={s.gap}
      onChange={(v) => u({ gap: v })}
    />
  ),
  display: ({ s, u }) => (
    <Chips
      key="display"
      label="Display"
      options={["block", "flex", "grid", "inline", "inline-flex", "none"]}
      value={s.display || "block"}
      onChange={(v) => u({ display: v })}
    />
  ),
  "flex-direction": ({ s, u }) => (
    <Chips
      key="flex-direction"
      label="Direction"
      options={["row", "row-reverse", "column", "column-reverse"]}
      value={s.flexDirection || "row"}
      onChange={(v) => u({ flexDirection: v })}
    />
  ),
  "justify-content": ({ s, u }) => (
    <Chips
      key="justify-content"
      label="Justify"
      options={[
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly",
      ]}
      value={s.justifyContent || "flex-start"}
      onChange={(v) => u({ justifyContent: v })}
    />
  ),
  "align-items": ({ s, u }) => (
    <Chips
      key="align-items"
      label="Align Items"
      options={["flex-start", "center", "flex-end", "stretch", "baseline"]}
      value={s.alignItems || "stretch"}
      onChange={(v) => u({ alignItems: v })}
    />
  ),
  "flex-wrap": ({ s, u }) => (
    <SelectInput
      key="flex-wrap"
      label="Flex Wrap"
      value={s.flexWrap || "nowrap"}
      options={["nowrap", "wrap", "wrap-reverse"]}
      onChange={(v) => u({ flexWrap: v })}
    />
  ),
  "grid-template-columns": ({ el, s, u, updateGrid }) => (
    <React.Fragment key="gtc">
      <Field label="Columns">
        <div className="ip-grid-picker">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              className={`ip-grid-pick-btn${(el.gridCols || 2) === n ? " active" : ""}`}
              onClick={() => updateGrid(n, el.gridRows || 1)}
            >
              {n}
            </button>
          ))}
        </div>
      </Field>
      <TextInput
        label="Template Columns"
        value={s.gridTemplateColumns || "repeat(2, 1fr)"}
        onChange={(v) => u({ gridTemplateColumns: v })}
        placeholder="repeat(3,1fr) or 1fr 2fr 1fr"
      />
    </React.Fragment>
  ),
  "grid-template-rows": ({ el, s, u, updateGrid }) => (
    <React.Fragment key="gtr">
      <Field label="Rows">
        <div className="ip-grid-picker">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              className={`ip-grid-pick-btn${(el.gridRows || 1) === n ? " active" : ""}`}
              onClick={() => updateGrid(el.gridCols || 2, n)}
            >
              {n}
            </button>
          ))}
        </div>
      </Field>
      <TextInput
        label="Template Rows"
        value={s.gridTemplateRows || "auto"}
        onChange={(v) => u({ gridTemplateRows: v })}
        placeholder="auto 200px auto"
      />
      {(el.gridCols || 2) > 0 && (el.gridRows || 1) > 0 && (
        <Field label="Cell Placement">
          <div
            className="ip-grid-cells"
            style={{ gridTemplateColumns: `repeat(${el.gridCols || 2},1fr)` }}
          >
            {Array.from({
              length: (el.gridRows || 1) * (el.gridCols || 2),
            }).map((_, idx) => {
              const r = Math.floor(idx / (el.gridCols || 2)) + 1,
                c = (idx % (el.gridCols || 2)) + 1;
              const area = `${r} / ${c} / ${r + 1} / ${c + 1}`;
              const on = s.gridArea === area;
              return (
                <button
                  key={idx}
                  title={`Row ${r}, Col ${c}`}
                  className={`ip-grid-cell-btn${on ? " active" : ""}`}
                  onClick={() => u({ gridArea: on ? "" : area })}
                >
                  {r},{c}
                </button>
              );
            })}
          </div>
          <TextInput
            label="Custom gridArea"
            value={s.gridArea || ""}
            onChange={(v) => u({ gridArea: v })}
            placeholder="1/1/2/3"
          />
        </Field>
      )}
    </React.Fragment>
  ),
  overflow: ({ s, u }) => (
    <div key="overflow" className="ip-row">
      <SelectInput
        label="Overflow X"
        value={s.overflowX || "visible"}
        options={["visible", "hidden", "scroll", "auto"]}
        onChange={(v) => u({ overflowX: v })}
      />
      <SelectInput
        label="Overflow Y"
        value={s.overflowY || "visible"}
        options={["visible", "hidden", "scroll", "auto"]}
        onChange={(v) => u({ overflowY: v })}
      />
    </div>
  ),
  position: ({ s, u }) => (
    <React.Fragment key="position">
      <SelectInput
        label="Position"
        value={s.position || "static"}
        options={["static", "relative", "absolute", "fixed", "sticky"]}
        onChange={(v) => u({ position: v })}
      />
      {(s.position === "absolute" || s.position === "fixed") && (
        <div className="ip-row-4">
          <UnitInput
            label="Top"
            value={s.top}
            onChange={(v) => u({ top: v })}
          />
          <UnitInput
            label="Right"
            value={s.right}
            onChange={(v) => u({ right: v })}
          />
          <UnitInput
            label="Bottom"
            value={s.bottom}
            onChange={(v) => u({ bottom: v })}
          />
          <UnitInput
            label="Left"
            value={s.left}
            onChange={(v) => u({ left: v })}
          />
        </div>
      )}
    </React.Fragment>
  ),
  "z-index": ({ s, u }) => (
    <TextInput
      key="z-index"
      label="z-index"
      value={s.zIndex || ""}
      onChange={(v) => u({ zIndex: v })}
      placeholder="0"
    />
  ),

  // ── STYLE FIELDS ─────────────────────────────────────────
  background: ({ s, u }) => (
    <ColorField
      key="background"
      label="Background"
      value={s.backgroundColor || "#ffffff"}
      onChange={(v) => u({ backgroundColor: v })}
    />
  ),
  color: ({ s, u }) => (
    <ColorField
      key="color"
      label="Text Color"
      value={s.color || "#000000"}
      onChange={(v) => u({ color: v })}
    />
  ),
  "accent-color": ({ s, u }) => (
    <ColorField
      key="accent-color"
      label="Accent Color"
      value={s.accentColor || "#6366f1"}
      onChange={(v) => u({ accentColor: v })}
    />
  ),
  border: ({ s, u }) => (
    <React.Fragment key="border">
      <div className="ip-row">
        <UnitInput
          label="Border W"
          value={s.borderWidth || "0px"}
          onChange={(v) => u({ borderWidth: v })}
        />
        <SelectInput
          label="Style"
          value={s.borderStyle || "solid"}
          options={["solid", "dashed", "dotted", "double", "none"]}
          onChange={(v) => u({ borderStyle: v })}
        />
      </div>
      <ColorField
        label="Border Color"
        value={s.borderColor || "#cccccc"}
        onChange={(v) => u({ borderColor: v })}
      />
    </React.Fragment>
  ),
  "border-radius": ({ s, u }) => (
    <React.Fragment key="border-radius">
      <RangeField
        label="All Corners"
        value={parseFloat(s.borderRadius) || 0}
        min={0}
        max={64}
        unit="px"
        onChange={(v) => u({ borderRadius: v })}
      />
      <div className="ip-row-4">
        {[
          ["TL", "borderTopLeftRadius"],
          ["TR", "borderTopRightRadius"],
          ["BR", "borderBottomRightRadius"],
          ["BL", "borderBottomLeftRadius"],
        ].map(([l, k]) => (
          <UnitInput
            key={k}
            label={l}
            value={s[k] || ""}
            onChange={(v) => u({ [k]: v })}
          />
        ))}
      </div>
    </React.Fragment>
  ),
  "border-left": ({ s, u }) => (
    <React.Fragment key="border-left">
      <UnitInput
        label="Left Border W"
        value={s.borderLeftWidth || "4px"}
        onChange={(v) => u({ borderLeftWidth: v })}
      />
      <ColorField
        label="Left Border Color"
        value={s.borderLeftColor || "#6366f1"}
        onChange={(v) => u({ borderLeftColor: v })}
      />
    </React.Fragment>
  ),
  "box-shadow": ({ s, u }) => <ShadowBuilder key="box-shadow" s={s} u={u} />,
  opacity: ({ s, u }) => (
    <RangeField
      key="opacity"
      label="Opacity"
      value={parseFloat(s.opacity ?? 1) * 100}
      min={0}
      max={100}
      unit="%"
      onChange={(v) => u({ opacity: parseFloat(v) / 100 })}
    />
  ),
  visibility: ({ s, u }) => (
    <Chips
      key="visibility"
      label="Visibility"
      options={["visible", "hidden"]}
      value={s.visibility || "visible"}
      onChange={(v) => u({ visibility: v })}
    />
  ),
  cursor: ({ s, u }) => (
    <SelectInput
      key="cursor"
      label="Cursor"
      value={s.cursor || "default"}
      options={[
        "default",
        "pointer",
        "text",
        "move",
        "not-allowed",
        "grab",
        "grabbing",
        "crosshair",
        "wait",
        "zoom-in",
      ]}
      onChange={(v) => u({ cursor: v })}
    />
  ),
  "font-size": ({ s, u }) => (
    <UnitInput
      key="font-size"
      label="Font Size"
      value={s.fontSize || "16px"}
      onChange={(v) => u({ fontSize: v })}
    />
  ),
  "font-weight": ({ s, u }) => (
    <SelectInput
      key="font-weight"
      label="Font Weight"
      value={s.fontWeight || "400"}
      options={["100", "200", "300", "400", "500", "600", "700", "800", "900"]}
      onChange={(v) => u({ fontWeight: v })}
    />
  ),
  "font-family": ({ s, u }) => (
    <TextInput
      key="font-family"
      label="Font Family"
      value={s.fontFamily || ""}
      onChange={(v) => u({ fontFamily: v })}
      placeholder="Inter, sans-serif"
    />
  ),
  "text-align": ({ s, u }) => (
    <ToggleGroup
      key="text-align"
      label="Text Align"
      value={s.textAlign || "left"}
      onChange={(v) => u({ textAlign: v })}
      options={[
        { value: "left", icon: AlignLeft },
        { value: "center", icon: AlignCenter },
        { value: "right", icon: AlignRight },
        { value: "justify", icon: AlignJustify },
      ]}
    />
  ),
  "line-height": ({ s, u }) => (
    <UnitInput
      key="line-height"
      label="Line Height"
      value={s.lineHeight || "1.5"}
      onChange={(v) => u({ lineHeight: v })}
    />
  ),
  "letter-spacing": ({ s, u }) => (
    <UnitInput
      key="letter-spacing"
      label="Letter Spacing"
      value={s.letterSpacing || "0px"}
      onChange={(v) => u({ letterSpacing: v })}
    />
  ),
  "text-decoration": ({ s, u }) => (
    <SelectInput
      key="text-decoration"
      label="Text Decoration"
      value={s.textDecoration || "none"}
      options={["none", "underline", "line-through", "overline"]}
      onChange={(v) => u({ textDecoration: v })}
    />
  ),
  "text-transform": ({ s, u }) => (
    <SelectInput
      key="text-transform"
      label="Text Transform"
      value={s.textTransform || "none"}
      options={["none", "uppercase", "lowercase", "capitalize"]}
      onChange={(v) => u({ textTransform: v })}
    />
  ),
  resize: ({ s, u }) => (
    <SelectInput
      key="resize"
      label="Resize"
      value={s.resize || "vertical"}
      options={["none", "vertical", "horizontal", "both"]}
      onChange={(v) => u({ resize: v })}
    />
  ),

  // ── MOTION FIELDS ────────────────────────────────────────
  transition: ({ s, u }) => (
    <React.Fragment key="transition">
      <TextInput
        label="Properties"
        value={s.transitionProperty || "all"}
        onChange={(v) => u({ transitionProperty: v })}
      />
      <div className="ip-row">
        <UnitInput
          label="Duration"
          value={s.transitionDuration || "0.3s"}
          onChange={(v) => u({ transitionDuration: v })}
        />
        <UnitInput
          label="Delay"
          value={s.transitionDelay || "0s"}
          onChange={(v) => u({ transitionDelay: v })}
        />
      </div>
      <SelectInput
        label="Easing"
        value={s.transitionTimingFunction || "ease"}
        options={["ease", "ease-in", "ease-out", "ease-in-out", "linear"]}
        onChange={(v) => u({ transitionTimingFunction: v })}
      />
    </React.Fragment>
  ),
  animation: ({ s, u }) => (
    <React.Fragment key="animation">
      <Chips
        label="Preset"
        options={[
          "none",
          "fade-in",
          "slide-up",
          "slide-left",
          "bounce",
          "pulse",
          "float",
          "spin",
          "shake",
          "zoom-in",
        ]}
        value={s.animationPreset || "none"}
        onChange={(v) =>
          u({
            animationPreset: v,
            animation: v === "none" ? "none" : `${v} 0.6s ease both`,
          })
        }
      />
      <div className="ip-row">
        <UnitInput
          label="Duration"
          value={s.animationDuration || "0.6s"}
          onChange={(v) => u({ animationDuration: v })}
        />
        <UnitInput
          label="Delay"
          value={s.animationDelay || "0s"}
          onChange={(v) => u({ animationDelay: v })}
        />
      </div>
      <SelectInput
        label="Easing"
        value={s.animationTimingFunction || "ease"}
        options={["ease", "ease-in", "ease-out", "ease-in-out", "linear"]}
        onChange={(v) => u({ animationTimingFunction: v })}
      />
      <SelectInput
        label="Repeat"
        value={s.animationIterationCount || "1"}
        options={["1", "2", "3", "infinite"]}
        onChange={(v) => u({ animationIterationCount: v })}
      />
    </React.Fragment>
  ),
  transform: ({ s, u }) => (
    <React.Fragment key="transform">
      <div className="ip-row">
        <UnitInput
          label="Rotate"
          value={s.rotate || "0deg"}
          onChange={(v) => u({ rotate: v })}
        />
        <RangeField
          label="Scale"
          value={(parseFloat(s.scale) || 1) * 100}
          min={0}
          max={300}
          unit="%"
          onChange={(v) => u({ scale: parseFloat(v) / 100 })}
        />
      </div>
      <div className="ip-row">
        <UnitInput
          label="Translate X"
          value={s.translateX || "0px"}
          onChange={(v) => u({ translateX: v })}
        />
        <UnitInput
          label="Translate Y"
          value={s.translateY || "0px"}
          onChange={(v) => u({ translateY: v })}
        />
      </div>
    </React.Fragment>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   SECTION GROUP CONFIG  — which fields go in which section
═══════════════════════════════════════════════════════════════ */
const TAB_COLOR = {
  content: "#6366f1",
  layout: "#10b981",
  style: "#ec4899",
  motion: "#f59e0b",
};

const LAYOUT_GROUPS = [
  { title: "Dimensions", fields: ["width", "height"] },
  { title: "Padding", fields: ["padding"] },
  { title: "Margin", fields: ["margin"] },
  {
    title: "Display",
    fields: [
      "display",
      "flex-direction",
      "justify-content",
      "align-items",
      "flex-wrap",
      "gap",
    ],
  },
  { title: "Grid", fields: ["grid-template-columns", "grid-template-rows"] },
  { title: "Position", fields: ["position", "z-index"] },
  { title: "Overflow", fields: ["overflow"] },
];

const STYLE_GROUPS = [
  { title: "Color", fields: ["background", "color", "accent-color"] },
  { title: "Border", fields: ["border", "border-radius", "border-left"] },
  {
    title: "Typography",
    fields: [
      "font-size",
      "font-weight",
      "font-family",
      "text-align",
      "line-height",
      "letter-spacing",
      "text-decoration",
      "text-transform",
      "resize",
    ],
  },
  { title: "Shadow", fields: ["box-shadow"] },
  { title: "Visibility", fields: ["opacity", "visibility", "cursor"] },
];

const MOTION_GROUPS = [
  { title: "Transition", fields: ["transition"] },
  { title: "Animation", fields: ["animation"] },
  { title: "Transform", fields: ["transform"] },
];

const renderGroups = (groups, schemaFields, props) =>
  groups.map((group) => {
    const active = group.fields.filter((f) => schemaFields.includes(f));
    if (!active.length) return null;
    return (
      <Section key={group.title} title={group.title} color={props.tabColor}>
        {active.map((f) => FR[f]?.(props) ?? null)}
      </Section>
    );
  });

/* ═══════════════════════════════════════════════════════════════
   MAIN INSPECTOR
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "content", label: "Content", icon: Type },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "style", label: "Style", icon: Palette },
  { id: "motion", label: "Motion", icon: PlayCircle },
];

const CONTAINER_TYPES = new Set([
  "flex",
  "grid",
  "section",
  "nav",
  "spacer",
  "divider",
  "form-group",
  "card",
]);

const Inspector = () => {
  const {
    selectedElementId,
    layoutTree,
    updateStyles,
    updateContent,
    updateInputType,
    deleteElement,
    updateGrid,
    updateTableMeta,
    canvasBg,
    setCanvasBg,
    canvasDotColor,
    setCanvasDotColor,
  } = useStore();
  const [tab, setTab] = useState("content");

  const findEl = (node) => {
    if (!node) return null;
    if (node.id === selectedElementId) return node;
    for (const c of node.children || []) {
      const f = findEl(c);
      if (f) return f;
    }
    return null;
  };

  const el = findEl(layoutTree);

  if (!el)
    return (
      <div className="inspector-wrapper">
        <div className="inspector-empty">
          <Settings2 size={28} />
          <p>
            Select an element
            <br />
            on the canvas
          </p>
        </div>
      </div>
    );

  const schema = ELEMENT_SCHEMA[el.type] ?? {
    content: [],
    layout: [],
    style: [],
    motion: [],
  };
  const color = TYPE_COLOR[el.type] ?? "#6366f1";
  const s = el.styles || {};
  const u = updateStyles;
  const tabColor = TAB_COLOR[tab];

  const fp = {
    s,
    u,
    el,
    updateContent,
    updateInputType,
    updateGrid,
    updateTableMeta,
    tabColor,
  };

  return (
    <div className="inspector-wrapper">
      {/* Header */}
      <div className="inspector-header">
        <div className="inspector-meta">
          <div className="inspector-type-pill">
            <div className="inspector-dot" style={{ background: color }} />
            <span className="inspector-type-name">
              {TYPE_LABEL[el.type] ?? el.type}
            </span>
            <span className="inspector-id">#{el.id?.slice(-4)}</span>
          </div>
          {el.id !== "root" && (
            <button
              className="inspector-delete-btn"
              onClick={deleteElement}
              title="Delete element"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="inspector-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`inspector-tab${tab === t.id ? " active" : ""}`}
              style={tab === t.id ? { color, borderBottomColor: color } : {}}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={12} strokeWidth={2.2} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="inspector-body">
        {/* ── ROOT CANVAS PANELS ──────────────────────────── */}
        {el.id === "root" && tab === "content" && (
          <Section title="Canvas Root" color={tabColor}>
            <p className="ip-container-note">
              Select Layout or Style tab to configure the canvas.
            </p>
          </Section>
        )}
        {el.id === "root" && tab === "layout" && (
          <>
            <Section title="Canvas Card Size" color={TAB_COLOR.layout}>
              <UnitInput
                label="Width"
                value={s.width}
                onChange={(v) => u({ width: v })}
              />
              <UnitInput
                label="Min Height"
                value={s.minHeight}
                onChange={(v) => u({ minHeight: v })}
              />
              <UnitInput
                label="Padding"
                value={s.padding}
                onChange={(v) => u({ padding: v })}
              />
            </Section>
            <Section title="Layout Mode" color={TAB_COLOR.layout}>
              <Chips
                label="Display"
                options={["block", "flex", "grid"]}
                value={s.display || "block"}
                onChange={(v) => u({ display: v })}
              />
              {s.display === "flex" && (
                <>
                  <Chips
                    label="Direction"
                    options={["row", "column", "row-reverse", "column-reverse"]}
                    value={s.flexDirection || "row"}
                    onChange={(v) => u({ flexDirection: v })}
                  />
                  <Chips
                    label="Justify"
                    options={[
                      "flex-start",
                      "center",
                      "flex-end",
                      "space-between",
                      "space-around",
                    ]}
                    value={s.justifyContent || "flex-start"}
                    onChange={(v) => u({ justifyContent: v })}
                  />
                  <Chips
                    label="Align"
                    options={["flex-start", "center", "flex-end", "stretch"]}
                    value={s.alignItems || "stretch"}
                    onChange={(v) => u({ alignItems: v })}
                  />
                  <UnitInput
                    label="Gap"
                    value={s.gap}
                    onChange={(v) => u({ gap: v })}
                  />
                  <SelectInput
                    label="Wrap"
                    value={s.flexWrap || "nowrap"}
                    options={["nowrap", "wrap", "wrap-reverse"]}
                    onChange={(v) => u({ flexWrap: v })}
                  />
                </>
              )}
              {s.display === "grid" && (
                <>
                  <Field label="Columns">
                    <div className="ip-grid-picker">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          className={`ip-grid-pick-btn${s.gridTemplateColumns === `repeat(${n}, 1fr)` ? " active" : ""}`}
                          onClick={() =>
                            u({ gridTemplateColumns: `repeat(${n}, 1fr)` })
                          }
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <TextInput
                    label="Template Columns"
                    value={s.gridTemplateColumns || "repeat(2,1fr)"}
                    onChange={(v) => u({ gridTemplateColumns: v })}
                    placeholder="repeat(2,1fr)"
                  />
                  <Field label="Rows">
                    <div className="ip-grid-picker">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          className={`ip-grid-pick-btn${
                            s.gridTemplateRows === `repeat(${n}, auto)` ||
                            (n === 1 &&
                              (!s.gridTemplateRows ||
                                s.gridTemplateRows === "auto"))
                              ? " active"
                              : ""
                          }`}
                          onClick={() =>
                            u({
                              gridTemplateRows:
                                n === 1 ? "auto" : `repeat(${n}, auto)`,
                            })
                          }
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <TextInput
                    label="Template Rows"
                    value={s.gridTemplateRows || "auto"}
                    onChange={(v) => u({ gridTemplateRows: v })}
                    placeholder="auto 1fr auto"
                  />
                  <UnitInput
                    label="Gap"
                    value={s.gap}
                    onChange={(v) => u({ gap: v })}
                  />
                </>
              )}
            </Section>
          </>
        )}
        {el.id === "root" && tab === "style" && (
          <>
            <Section title="Canvas Background" color={TAB_COLOR.style}>
              <ColorField
                label="Canvas Color"
                value={canvasBg || "#dde1e9"}
                onChange={setCanvasBg}
              />
              <ColorField
                label="Dot Pattern"
                value={canvasDotColor || "rgba(99,102,241,0.22)"}
                onChange={setCanvasDotColor}
              />
            </Section>
            <Section title="Card Appearance" color={TAB_COLOR.style}>
              <ColorField
                label="Card Background"
                value={s.backgroundColor || "#ffffff"}
                onChange={(v) => u({ backgroundColor: v })}
              />
              <RangeField
                label="Border Radius"
                value={parseFloat(s.borderRadius) || 0}
                min={0}
                max={32}
                unit="px"
                onChange={(v) => u({ borderRadius: v })}
              />
              <ShadowBuilder s={s} u={u} />
            </Section>
          </>
        )}
        {el.id === "root" && tab === "motion" && (
          <Section title="Motion" color={TAB_COLOR.motion}>
            <p className="ip-container-note">
              Motion properties apply to child elements, not the root canvas.
            </p>
          </Section>
        )}

        {/* ── REGULAR ELEMENT PANELS ─────────────────────── */}
        {el.id !== "root" &&
          tab === "content" &&
          (CONTAINER_TYPES.has(el.type) ? (
            <Section title="Container" color={tabColor}>
              <p className="ip-container-note">
                Layout container — select a child to edit its content.
              </p>
            </Section>
          ) : (
            <Section title="Content" color={tabColor}>
              {(schema.content || []).map((f) => FR[f]?.({ ...fp }) ?? null)}
            </Section>
          ))}
        {el.id !== "root" &&
          tab === "layout" &&
          renderGroups(LAYOUT_GROUPS, schema.layout || [], fp)}
        {el.id !== "root" &&
          tab === "style" &&
          renderGroups(STYLE_GROUPS, schema.style || [], fp)}
        {el.id !== "root" &&
          tab === "motion" &&
          renderGroups(MOTION_GROUPS, schema.motion || [], fp)}
      </div>
    </div>
  );
};

export default Inspector;
