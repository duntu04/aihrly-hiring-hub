import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { GripVertical, Trash2, Type, Mic } from "lucide-react";
import type { Question } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function QuestionRow({
  question,
  index,
  onUpdate,
  onRemove,
}: {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  const [editing, setEditing] = useState(question.isCustom && question.text === "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow",
        isDragging && "shadow-pop opacity-80",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 text-text-muted hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-sky text-brand-deep text-xs font-semibold mt-0.5">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {editing ? (
          <input
            ref={inputRef}
            value={question.text}
            onChange={(e) => onUpdate({ ...question, text: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditing(false);
            }}
            placeholder="Type your question..."
            className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-left w-full text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {question.text || <span className="text-text-muted italic">Click to add question text…</span>}
          </button>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-md bg-muted p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onUpdate({ ...question, responseType: "text" })}
              className={cn(
                "flex items-center gap-1 rounded px-2 py-1 transition-colors",
                question.responseType === "text" ? "bg-card text-foreground shadow-sm" : "text-text-secondary",
              )}
            >
              <Type className="h-3 w-3" /> Text
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ ...question, responseType: "audio" })}
              className={cn(
                "flex items-center gap-1 rounded px-2 py-1 transition-colors",
                question.responseType === "audio" ? "bg-card text-foreground shadow-sm" : "text-text-secondary",
              )}
            >
              <Mic className="h-3 w-3" /> Audio
            </button>
          </div>
          {question.isCustom && (
            <span className="text-[0.65rem] uppercase tracking-wide font-semibold rounded px-1.5 py-0.5 bg-brand-sky text-brand-deep">
              Custom
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label="Remove question"
        className="text-text-muted hover:text-[color:var(--danger)] hover:bg-[color:var(--danger)]/8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
