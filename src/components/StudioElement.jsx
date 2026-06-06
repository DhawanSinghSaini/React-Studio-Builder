import React from 'react';
import useStore from '../store/useStore';

// ── Lucide-style inline SVG icons for the Icon element ────────
const ICON_PATHS = {
  Star:     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  Heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  Home:     <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  Mail:     <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
  Phone:    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
  Search:   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
  Settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
  User:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  Check:    <polyline points="20 6 9 17 4 12"/>,
  X:        <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  Plus:     <><path d="M5 12h14"/><path d="M12 5v14"/></>,
  Arrow:    <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  Bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  Info:     <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
  Warning:  <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  Download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
  Upload:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>,
};

const SvgIcon = ({ name = 'Star', size = 32, color = '#6366f1', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name] || ICON_PATHS.Star}
  </svg>
);

// ── Shared selection outline helper ───────────────────────────
const selStyle = (isSelected, extra = {}) => ({
  outline: isSelected ? '2px solid #6366f1' : 'none',
  outlineOffset: '-2px',
  ...extra,
});

// ── Build CSS transform from individual style props ───────────
const buildTransform = (s = {}) => {
  const parts = [];
  if (s.translateX && s.translateX !== '0px') parts.push(`translateX(${s.translateX})`);
  if (s.translateY && s.translateY !== '0px') parts.push(`translateY(${s.translateY})`);
  if (s.rotate     && s.rotate     !== '0deg') parts.push(`rotate(${s.rotate})`);
  if (s.scale && parseFloat(s.scale) !== 1)   parts.push(`scale(${s.scale})`);
  return parts.length ? parts.join(' ') : undefined;
};

// ── Media placeholders ────────────────────────────────────────
const PlaceholderBox = ({ icon, label, hint, bg = '#e9ecef', iconColor = '#9ca3af' }) => (
  <div style={{ width:'100%', height:'100%', minHeight:120, backgroundColor:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, color:iconColor, borderRadius:'inherit' }}>
    {icon}
    <span style={{ fontSize:12, fontWeight:600, color:'#6b7280' }}>{label}</span>
    {hint && <span style={{ fontSize:10, color:'#9ca3af' }}>{hint}</span>}
  </div>
);

const ImageEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const hasSrc = s.src && s.src.trim();
  return (
    <div onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), overflow:'hidden', display:'block', userSelect:'none', boxSizing:'border-box' }}>
      {hasSrc
        ? <img src={s.src} alt={s.alt || ''} style={{ width:'100%', height:'100%', objectFit: s.objectFit || 'cover', display:'block', borderRadius:'inherit' }} />
        : <PlaceholderBox
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}
            label="Image" hint="Set src URL in Inspector → Content" />
      }
    </div>
  );
};

const VideoEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const hasSrc = s.src && s.src.trim();
  return (
    <div onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), overflow:'hidden', display:'block', userSelect:'none', boxSizing:'border-box' }}>
      {hasSrc
        ? <video src={s.src} poster={s.poster} controls={s.controls !== 'Hide'}
            autoPlay={s.autoplay === 'On'} loop={s.loop === 'On'} muted={s.muted === 'On'}
            style={{ width:'100%', height:'100%', display:'block', borderRadius:'inherit', backgroundColor:'#000' }} />
        : <PlaceholderBox bg="#1a1a2e"
            icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            label="Video Player" hint="Set src URL in Inspector → Content" iconColor="#6b7280" />
      }
    </div>
  );
};

const AudioEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const hasSrc = s.src && s.src.trim();
  const accent = '#6366f1';
  return (
    <div onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), userSelect:'none', boxSizing:'border-box' }}>
      {hasSrc
        ? <audio src={s.src} controls={s.controls !== 'Hide'} loop={s.loop === 'On'} autoPlay={s.autoplay === 'On'} style={{ width:'100%' }} />
        : (
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', backgroundColor:'#f3f4f6', borderRadius: s.borderRadius || 8, border:'1px solid #e5e7eb', width:'100%', boxSizing:'border-box' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', backgroundColor:accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#374151' }}>Audio Player</div>
              <div style={{ height:4, backgroundColor:'#d1d5db', borderRadius:2 }}>
                <div style={{ width:'35%', height:'100%', backgroundColor:accent, borderRadius:2 }} />
              </div>
            </div>
            <span style={{ fontSize:11, color:'#9ca3af', flexShrink:0 }}>0:00</span>
            <div style={{ fontSize:10, color:'#9ca3af', flexShrink:0 }}>Set src URL →</div>
          </div>
        )
      }
    </div>
  );
};

const IframeEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const hasSrc = s.src && s.src.trim();
  return (
    <div onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), overflow:'hidden', userSelect:'none', boxSizing:'border-box' }}>
      {hasSrc
        ? <iframe src={s.src} title={s.title || 'Embedded'} sandbox={s.sandbox !== 'none' ? s.sandbox : undefined}
            style={{ width:'100%', height:'100%', border:'none', display:'block' }} />
        : <PlaceholderBox
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            label="Iframe" hint="Set src URL in Inspector → Content" />
      }
    </div>
  );
};

// ── Specialized element renderers ─────────────────────────────

const TableEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const headers = (element.tableHeaders || 'Col 1,Col 2,Col 3').split(',').map(h => h.trim());
  const rows = parseInt(element.tableRows) || 3;
  const data = element.tableData || [];
  return (
    <div onClick={onClick} style={{ ...selStyle(isSelected), userSelect:'none', overflowX:'auto' }}>
      <table style={{ ...s, borderCollapse:'collapse', width:'100%' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding:'8px 12px', backgroundColor:'#f3f4f6', borderBottom:'2px solid #e5e7eb', textAlign:'left', fontSize:13, fontWeight:700, color:'#374151', whiteSpace:'nowrap' }}>{h || `Col ${i+1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? '#fff' : '#f9fafb' }}>
              {headers.map((_, ci) => (
                <td key={ci} style={{ padding:'8px 12px', borderBottom:'1px solid #e5e7eb', fontSize:13, color: s.color || '#374151' }}>
                  {data[ri]?.[ci] || <span style={{ color:'#d1d5db' }}>—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckboxEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const checked = s.checked === 'Checked';
  const accent = s.accentColor || '#6366f1';
  return (
    <label onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'8px 4px', userSelect:'none', ...selStyle(isSelected) }}>
      <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${accent}`, backgroundColor: checked ? accent : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.15s' }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5 5 4 7.5 8.5 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontSize: s.fontSize || 14, color: s.color || '#333', lineHeight:1.4 }}>{element.content || 'Checkbox'}</span>
    </label>
  );
};

const ToggleEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const checked = s.checked === 'Checked';
  const accent = s.accentColor || '#6366f1';
  return (
    <label onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'8px 4px', userSelect:'none', ...selStyle(isSelected) }}>
      <div style={{ width:44, height:24, borderRadius:12, backgroundColor: checked ? accent : '#d1d5db', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
        <div style={{ width:18, height:18, borderRadius:'50%', backgroundColor:'#fff', position:'absolute', top:3, left: checked ? 23 : 3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
      <span style={{ fontSize: s.fontSize || 14, color: s.color || '#333', lineHeight:1.4 }}>{element.content || 'Toggle'}</span>
    </label>
  );
};

const ListEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const items = (element.content || '').split('\n').filter(Boolean);
  const Tag = element.type === 'ol' ? 'ol' : 'ul';
  return (
    <Tag onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), userSelect:'none', margin:0,
        // Ensure list-style-type is honoured and bullets are visible
        listStyleType: s.listStyleType || (element.type === 'ol' ? 'decimal' : 'disc'),
        paddingLeft: s.paddingLeft || '28px',
      }}>
      {items.length === 0
        ? <li style={{ color:'#9ca3af', fontStyle:'italic', listStyleType:'none' }}>Empty list — add items in Inspector</li>
        : items.map((item, i) => (
            <li key={i} style={{ marginBottom:4, lineHeight: s.lineHeight || 1.7, color: s.color || '#333333', fontSize: s.fontSize || '15px' }}>{item}</li>
          ))
      }
    </Tag>
  );
};

const CodeEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const lines = (element.content || '').split('\n');
  return (
    <div onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), userSelect:'none', fontFamily:'monospace', whiteSpace:'pre', overflowX:'auto',
        backgroundColor: s.backgroundColor || '#1e1e2e', padding: s.padding || '16px',
        borderRadius: s.borderRadius || '8px', display:'block' }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display:'flex', gap:16 }}>
          <span style={{ color:'#525974', minWidth:24, textAlign:'right', userSelect:'none', fontSize:'0.85em', flexShrink:0 }}>{i + 1}</span>
          <span style={{ color: s.color || '#cdd6f4' }}>{line || ' '}</span>
        </div>
      ))}
    </div>
  );
};

const SelectEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  const options = (element.content || '').split('\n').filter(Boolean);
  return (
    <select onClick={onClick}
      style={{ ...s, ...selStyle(isSelected), userSelect:'none', appearance:'auto' }}>
      {options.length === 0
        ? <option>No options — add in Inspector</option>
        : options.map((opt, i) => <option key={i}>{opt.trim()}</option>)
      }
    </select>
  );
};

const DividerEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  return (
    <div onClick={onClick}
      style={{ padding:'4px 0', ...selStyle(isSelected), userSelect:'none', width: s.width || '100%' }}>
      <hr style={{ margin:0, border:'none', borderTopWidth: s.height || '1px', borderTopStyle:'solid', borderTopColor: s.backgroundColor || '#e5e7eb', width:'100%' }} />
    </div>
  );
};

const InputEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  return (
    <div onClick={onClick} style={{ ...selStyle(isSelected), display:'block', userSelect:'none', width: s.width || '100%' }}>
      <input type={element.inputType || 'text'} placeholder={element.content || 'Text input…'} readOnly
        style={{ ...s, outline:'none', boxSizing:'border-box', pointerEvents:'none', width:'100%' }} />
    </div>
  );
};

const TextareaEl = ({ element, isSelected, onClick }) => {
  const s = element.styles || {};
  return (
    <div onClick={onClick} style={{ ...selStyle(isSelected), userSelect:'none', width: s.width || '100%' }}>
      <textarea placeholder={element.content || 'Textarea…'} readOnly
        style={{ ...s, outline:'none', boxSizing:'border-box', pointerEvents:'none', width:'100%' }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN StudioElement
// ─────────────────────────────────────────────────────────────
const StudioElement = ({ element }) => {
  const { selectedElementId, setSelectedElement } = useStore();
  const isSelected = selectedElementId === element.id;
  const handleClick = (e) => { e.stopPropagation(); setSelectedElement(element.id); };

  // ── Fully custom-rendered types ───────────────────────────
  if (element.type === 'image')    return <ImageEl    element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'video')    return <VideoEl    element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'audio')    return <AudioEl    element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'iframe')   return <IframeEl   element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'table')    return <TableEl    element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'checkbox') return <CheckboxEl element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'toggle')   return <ToggleEl   element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'ul' || element.type === 'ol') return <ListEl element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'code')     return <CodeEl     element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'select')   return <SelectEl   element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'divider')  return <DividerEl  element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'input')    return <InputEl    element={element} isSelected={isSelected} onClick={handleClick} />;
  if (element.type === 'textarea') return <TextareaEl element={element} isSelected={isSelected} onClick={handleClick} />;

  if (element.type === 'icon') {
    const s = element.styles || {};
    const sz = parseInt(s.width) || 40;
    return (
      <div onClick={handleClick}
        style={{ ...s, ...selStyle(isSelected), display:'inline-flex', alignItems:'center', justifyContent:'center', userSelect:'none' }}>
        <SvgIcon name={element.content || 'Star'} size={sz} color={s.color || '#6366f1'} strokeWidth={parseFloat(s.strokeWidth) || 1.8} />
      </div>
    );
  }

  // ── Standard HTML tag map ─────────────────────────────────
  const tagMap = {
    h1:'h1', h2:'h2', h3:'h3', text:'p', label:'label',
    button:'button', link:'a', nav:'nav', section:'section',
    blockquote:'blockquote', flex:'div', grid:'div', card:'div',
    'form-group':'div', spacer:'div', container:'div',
  };
  const Tag = tagMap[element.type] || 'div';

  const s = element.styles || {};
  const transform = buildTransform(s);
  const composedStyles = {
    ...s,
    ...(transform ? { transform } : {}),
    ...selStyle(isSelected),
    userSelect: 'none',
  };

  const isContainer = ['flex','grid','section','nav','card','form-group','spacer','container'].includes(element.type);
  const isEmpty = isContainer && (!element.children || element.children.length === 0);

  return (
    <Tag onClick={handleClick} style={composedStyles}>
      {element.content || null}
      {isEmpty && (
        <div style={{ width:'100%', textAlign:'center', padding:'20px 16px', color:'rgba(99,102,241,0.4)', fontSize:12, fontWeight:600, letterSpacing:'0.04em', userSelect:'none', pointerEvents:'none' }}>
          + Drop elements here
        </div>
      )}
      {element.children?.map(child => <StudioElement key={child.id} element={child} />)}
    </Tag>
  );
};

export default StudioElement;