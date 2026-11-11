"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import LangTabs, { type LangTab } from "@/components/ui/LangTabs";
import { useProgress } from "@/context/ProgressContext";
import { MULTILANG } from "@/data/multilang";
import type { CodeLang, Entry } from "@/data/types";

const LANGS: LangTab<CodeLang>[] = [
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "cpp", label: "C++" },
  { key: "javascript", label: "JavaScript" },
];

/** The topic's code sample, with language tabs when other versions exist. Also records the visit for "Continue where you left off". */
export default function TopicCode({ e }: { e: Entry }) {
  const { setLast } = useProgress();
  const [lang, setLang] = useState<CodeLang>("python");

  useEffect(() => setLast(e.id), [e.id, setLast]);

  const variants = MULTILANG[e.id];
  const tabs = variants ? LANGS.filter((l) => l.key === "python" || variants[l.key as Exclude<CodeLang, "python">]) : null;
  const variant = lang === "python" || !variants ? null : variants[lang];
  const code = variant ? variant.code : e.code;
  const label = LANGS.find((l) => l.key === lang)!.label;

  return (
    <>
      {tabs && <LangTabs<CodeLang> tabs={tabs} selected={lang} onSelect={setLang} aria-label={"Language for " + e.name} />}
      <div className="code-wrap">
        <pre tabIndex={0} aria-label={`${label} code for ${e.name}`}>
          <code>{code}</code>
        </pre>
        <CopyButton className="btn copy-btn" label="Copy" text={code} aria-label={`Copy ${label} code for ${e.name}`} />
      </div>
      {tabs && (
        <p className="lang-note">{variant ? label + ": " + variant.cost : "Python is the baseline example used across the site."}</p>
      )}
    </>
  );
}
