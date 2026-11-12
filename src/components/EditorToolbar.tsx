"use client";

import { useCallback, useEffect, useRef, type ReactNode, type RefObject } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  /** Fallback for browsers that cannot edit through the undo-friendly path. */
  onValue: (value: string) => void;
};

// Either kind of list marker, so switching list type replaces it instead of stacking.
const LIST_MARKER = /^\s*([-*+]|\d+\.)\s+/;

const MOD = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl+";

/** Lines touched by the selection, expanded to whole lines. */
function lineRange(value: string, start: number, end: number): [number, number] {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const nl = value.indexOf("\n", end);
  return [from, nl === -1 ? value.length : nl];
}

const Btn = ({ label, hint, onClick, children }: { label: string; hint?: string; onClick: () => void; children: ReactNode }) => (
  <button type="button" className="tb-btn" aria-label={label} title={hint ? `${label} (${hint})` : label} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
    {children}
  </button>
);
const Sep = () => <span className="tb-sep" aria-hidden="true" />;
const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);


export default function EditorToolbar({ textareaRef, onValue }: Props) {
  /** Replace [from, to) with `text` and select [selStart, selEnd]. Keeps the browser's undo history. */
  const edit = useCallback(
    (from: number, to: number, text: string, selStart: number, selEnd: number) => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(from, to);
      const ok = typeof document.execCommand === "function" && document.execCommand("insertText", false, text);
      if (!ok) {
        onValue(ta.value.slice(0, from) + text + ta.value.slice(to));
        requestAnimationFrame(() => ta.setSelectionRange(selStart, selEnd));
        return;
      }
      ta.setSelectionRange(selStart, selEnd);
    },
    [textareaRef, onValue],
  );

  const state = () => {
    const ta = textareaRef.current!;
    return { ta, value: ta.value, start: ta.selectionStart, end: ta.selectionEnd };
  };

  /** Bold, italic, code and the like: wrap the selection, or unwrap it if already wrapped. */
  const wrap = useCallback(
    (before: string, after: string, placeholder: string) => {
      if (!textareaRef.current) return;
      const { value, start, end } = state();
      const bl = before.length;
      const al = after.length;
      const selected = value.slice(start, end);
      const wrapped =
        value.slice(start - bl, start) === before &&
        value.slice(end, end + al) === after &&
        // A lone * next to ** is bold, not italic.
        !(before === "*" && (value[start - 2] === "*" || value[end + 1] === "*"));
      if (wrapped) {
        edit(start - bl, end + al, selected, start - bl, start - bl + selected.length);
      } else {
        const inner = selected || placeholder;
        edit(start, end, before + inner + after, start + bl, start + bl + inner.length);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edit, textareaRef],
  );

  /** Headings, lists and quotes: change the start of every selected line. */
  const prefixLines = useCallback(
    (make: (index: number) => string, matches: RegExp, strip: RegExp = matches) => {
      if (!textareaRef.current) return;
      const { value, start, end } = state();
      const [from, to] = lineRange(value, start, end);
      const lines = value.slice(from, to).split("\n");
      const allHave = lines.every((l) => !l.trim() || matches.test(l));
      let n = 0;
      const out = lines.map((l) => {
        const bare = l.replace(allHave ? matches : strip, "");
        if (!l.trim()) return l;
        return allHave ? bare : make(n++) + bare;
      });
      const text = out.join("\n");
      edit(from, to, text, from, from + text.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edit, textareaRef],
  );

  const setStyle = (kind: string) => {
    if (!textareaRef.current) return;
    const { value, start, end } = state();
    const [from, to] = lineRange(value, start, end);
    const bare = value.slice(from, to).replace(/^#{1,6}\s+/, "");
    const prefix = kind === "h2" ? "## " : kind === "h3" ? "### " : "";
    const text = prefix + bare;
    edit(from, to, text, from + prefix.length, from + text.length);
  };

  const codeBlock = () => {
    if (!textareaRef.current) return;
    const { value, start, end } = state();
    const selected = value.slice(start, end);
    const lead = start === 0 || value[start - 1] === "\n" ? "" : "\n";
    const body = selected || "// your code here";
    const text = `${lead}\`\`\`js\n${body}\n\`\`\`\n`;
    const bodyStart = start + lead.length + 6;
    edit(start, end, text, bodyStart, bodyStart + body.length);
  };

  const insertBlock = (block: string, selectLen = 0) => {
    if (!textareaRef.current) return;
    const { value, start, end } = state();
    const lead = start === 0 ? "" : value[start - 1] === "\n" ? "\n" : "\n\n";
    const text = lead + block + "\n";
    const pos = start + text.length - 1 - selectLen;
    edit(start, end, text, selectLen ? pos : start + text.length, selectLen ? pos + selectLen : start + text.length);
  };

  const link = () => {
    if (!textareaRef.current) return;
    const { value, start, end } = state();
    const url = window.prompt("Link address (https://…)", "https://");
    if (!url || url === "https://") return;
    const label = value.slice(start, end) || "link text";
    const text = `[${label}](${url})`;
    edit(start, end, text, start + 1, start + 1 + label.length);
  };

  const image = () => {
    if (!textareaRef.current) return;
    const { value, start, end } = state();
    const url = window.prompt("Image address (https://…)", "https://");
    if (!url || url === "https://") return;
    const alt = value.slice(start, end) || "Describe the image";
    const text = `![${alt}](${url})`;
    edit(start, end, text, start + 2, start + 2 + alt.length);
  };

  const table = () =>
    insertBlock("| Column one | Column two |\n| --- | --- |\n| Cell | Cell |\n| Cell | Cell |");

  const history = (cmd: "undo" | "redo") => {
    textareaRef.current?.focus();
    document.execCommand(cmd);
  };

  // Keyboard shortcuts while typing in the editor.
  const onKeyDown = (e: KeyboardEvent) => {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
    const key = e.key.toLowerCase();
    const map: Record<string, () => void> = {
      b: () => wrap("**", "**", "bold text"),
      i: () => wrap("*", "*", "italic text"),
      u: () => wrap("<u>", "</u>", "underlined text"),
      k: link,
    };
    if (map[key]) {
      e.preventDefault();
      map[key]();
    }
  };
  const keys = useRef(onKeyDown);
  keys.current = onKeyDown;
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = (e: KeyboardEvent) => keys.current(e);
    ta.addEventListener("keydown", handler);
    return () => ta.removeEventListener("keydown", handler);
  }, [textareaRef]);

  return (
    <div className="md-toolbar" role="toolbar" aria-label="Formatting">
      <Btn label="Undo" hint={`${MOD}Z`} onClick={() => history("undo")}>{icon("M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3")}</Btn>
      <Btn label="Redo" hint={`${MOD}Shift+Z`} onClick={() => history("redo")}>{icon("m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3")}</Btn>
      <Sep />
      <select className="tb-select" aria-label="Text style" defaultValue="" onChange={(e) => { setStyle(e.target.value); e.target.value = ""; }}>
        <option value="" disabled>Text style</option>
        <option value="p">Normal text</option>
        <option value="h2">Heading</option>
        <option value="h3">Subheading</option>
      </select>
      <Sep />
      <Btn label="Bold" hint={`${MOD}B`} onClick={() => wrap("**", "**", "bold text")}><b>B</b></Btn>
      <Btn label="Italic" hint={`${MOD}I`} onClick={() => wrap("*", "*", "italic text")}><i style={{ fontFamily: "var(--serif)" }}>I</i></Btn>
      <Btn label="Underline" hint={`${MOD}U`} onClick={() => wrap("<u>", "</u>", "underlined text")}><u>U</u></Btn>
      <Btn label="Strikethrough" onClick={() => wrap("~~", "~~", "struck text")}><s>S</s></Btn>
      <Sep />
      <Btn label="Inline code" onClick={() => wrap("`", "`", "code")}>{icon("m8 8-4 4 4 4M16 8l4 4-4 4")}</Btn>
      <Btn label="Code block" onClick={codeBlock}>{icon("M4 5h16v14H4zM8 10l-2 2 2 2M16 10l2 2-2 2M13 9l-2 6")}</Btn>
      <Sep />
      <Btn label="Link" hint={`${MOD}K`} onClick={link}>{icon("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1")}</Btn>
      <Btn label="Image" onClick={image}>{icon("M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01")}</Btn>
      <Btn label="Table" onClick={table}>{icon("M4 5h16v14H4zM4 10h16M4 15h16M10 5v14")}</Btn>
      <Sep />
      <Btn label="Bulleted list" onClick={() => prefixLines(() => "- ", /^\s*[-*+]\s+/, LIST_MARKER)}>{icon("M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01")}</Btn>
      <Btn label="Numbered list" onClick={() => prefixLines((i) => `${i + 1}. `, /^\s*\d+\.\s+/, LIST_MARKER)}>{icon("M10 6h10M10 12h10M10 18h10M4 5l1-1v4M4 13h2l-2 3h2")}</Btn>
      <Btn label="Quote" onClick={() => prefixLines(() => "> ", /^>\s?/)}>{icon("M5 8h5v5a4 4 0 0 1-4 4M14 8h5v5a4 4 0 0 1-4 4")}</Btn>
      <Btn label="Tip callout" onClick={() => prefixLines(() => "> 💡 ", /^>\s?(💡\s?)?/)}><span aria-hidden="true">💡</span></Btn>
      <Btn label="Divider" onClick={() => insertBlock("---")}>{icon("M4 12h16")}</Btn>
    </div>
  );
}
