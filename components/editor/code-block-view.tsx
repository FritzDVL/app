import { CONFIGURED_LANGUAGES } from "./extension";
import type { CodeBlockAttrs } from "prosekit/extensions/code-block";
import type { ReactNodeViewProps } from "prosekit/react";

export default function CodeBlockView(props: ReactNodeViewProps) {
  const attrs = props.node.attrs as CodeBlockAttrs;
  const language = attrs.language;

  const setLanguage = (language: string) => {
    const attrs: CodeBlockAttrs = { language };
    props.setAttrs(attrs);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200/60 bg-white/95">
      {/* Minimal header */}
      <div className="flex items-center justify-between border-b border-slate-200/40 bg-slate-50/80 px-3 py-1.5">
        <span className="text-xs font-medium text-slate-700">
          {language ? CONFIGURED_LANGUAGES.find(info => info.id === language)?.name || language : "Plain Text"}
        </span>
        <select
          className="rounded border-0 bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
          onChange={event => setLanguage(event.target.value)}
          value={language || ""}
          aria-label="Select code language"
        >
          <option value="" className="bg-white text-slate-800">
            Plain Text
          </option>
          {CONFIGURED_LANGUAGES.map(info => (
            <option key={info.id} value={info.id} className="bg-white text-slate-800">
              {info.name}
            </option>
          ))}
        </select>
      </div>
      {/* Code area */}
      <pre
        ref={props.contentRef}
        data-language={language}
        className="min-h-[3rem] overflow-auto bg-transparent px-3 py-3 font-mono text-sm leading-relaxed text-slate-900 outline-none"
        tabIndex={0}
        spellCheck={false}
        aria-label={language ? `${language} code` : "Code"}
      />
    </div>
  );
}
