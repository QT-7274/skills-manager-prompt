import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Copy, Save, X, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as api from "../lib/tauri";

export interface ScenarioPromptEditorHandle {
  insertSkillAtCursor: (name: string) => void;
}

interface ScenarioPromptEditorProps {
  scenarioId: string;
  onExit: () => void;
  onTemplateChange?: (template: string) => void;
}

/** Marker format used to represent a skill tag in the raw template text. */
const SKILL_TAG_RE = /\[skill::([^\]]+)\]/g;

function makeSkillTag(name: string) {
  return `[skill::${name}]`;
}

/** Render template to plain text for clipboard export. */
function renderToPlainText(template: string): string {
  return template.replace(SKILL_TAG_RE, (_, name) => name);
}

/** Extract all skill names referenced in the template text. */
export function extractUsedSkillNames(text: string): Set<string> {
  const names = new Set<string>();
  const re = /\[skill::([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    names.add(m[1]);
  }
  return names;
}

export const ScenarioPromptEditor = forwardRef<
  ScenarioPromptEditorHandle,
  ScenarioPromptEditorProps
>(function ScenarioPromptEditor({ scenarioId, onExit, onTemplateChange }, ref) {
  const { t } = useTranslation();
  const [template, setTemplate] = useState("");
  const [loaded, setLoaded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved template on mount / scenario change
  useEffect(() => {
    setLoaded(false);
    api
      .getScenarioPromptTemplate(scenarioId)
      .then((saved) => {
        const val = saved ?? "";
        setTemplate(val);
        onTemplateChange?.(val);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [scenarioId]);

  /** Insert a skill tag at the current cursor position in the textarea. */
  const insertSkillAtCursor = useCallback(
    (skillName: string) => {
      const ta = textareaRef.current;
      const tag = makeSkillTag(skillName);
      if (ta) {
        const start = ta.selectionStart ?? template.length;
        const end = ta.selectionEnd ?? start;
        const next = template.slice(0, start) + tag + template.slice(end);
        setTemplate(next);
        onTemplateChange?.(next);
        requestAnimationFrame(() => {
          ta.focus();
          const pos = start + tag.length;
          ta.setSelectionRange(pos, pos);
        });
      } else {
        const next = template + tag;
        setTemplate(next);
        onTemplateChange?.(next);
      }
    },
    [template]
  );

  useImperativeHandle(ref, () => ({ insertSkillAtCursor }), [insertSkillAtCursor]);

  const handleSave = async () => {
    try {
      await api.saveScenarioPromptTemplate(scenarioId, template || null);
      toast.success(t("mySkills.promptEditor.saved"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleCopy = async () => {
    const text = renderToPlainText(template);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("mySkills.promptEditor.copied"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleRemoveTag = (skillName: string) => {
    const next = template.replace(makeSkillTag(skillName), "");
    setTemplate(next);
    onTemplateChange?.(next);
  };

  // Render the preview with inline skill badges
  const renderPreview = () => {
    const parts = template.split(SKILL_TAG_RE);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <span
            key={i}
            className="mx-0.5 inline-flex items-center gap-1 rounded bg-accent/15 px-1.5 py-0.5 text-[12px] font-semibold text-accent"
          >
            {part}
            <button
              onClick={() => handleRemoveTag(part)}
              className="rounded-full p-0 text-accent/50 hover:text-accent"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        );
      }
      return part ? (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      ) : null;
    });
  };

  if (!loaded) return null;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-secondary">
          <FileText className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate">{t("mySkills.promptEditor.title")}</span>
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-surface-hover hover:text-secondary"
          >
            <Save className="h-3 w-3 shrink-0" />
            {t("mySkills.promptEditor.save")}
          </button>
          <button
            onClick={handleCopy}
            disabled={!template.trim()}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent-bg disabled:opacity-40"
          >
            <Copy className="h-3 w-3 shrink-0" />
            {t("mySkills.promptEditor.copy")}
          </button>
          <button
            onClick={() => { handleSave(); onExit(); }}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-surface-hover hover:text-secondary"
          >
            <X className="h-3 w-3 shrink-0" />
            {t("mySkills.promptEditor.exit")}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-1 flex-col rounded-lg border border-border-subtle bg-bg-secondary">
        <textarea
          ref={textareaRef}
          value={template}
          onChange={(e) => { setTemplate(e.target.value); onTemplateChange?.(e.target.value); }}
          placeholder={t("mySkills.promptEditor.placeholder")}
          className="min-h-[180px] flex-1 resize-none bg-transparent p-3 text-[13px] leading-relaxed text-primary outline-none placeholder:text-faint"
          spellCheck={false}
        />
      </div>

      {/* Live preview */}
      {template.trim() && (
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
            {t("mySkills.promptEditor.preview")}
          </div>
          <div className="rounded-lg border border-border-subtle bg-bg-secondary p-3 text-[13px] leading-relaxed text-secondary">
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
});
