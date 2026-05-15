import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "motion/react";
import type { Question } from "@/types";
import { QuestionRow } from "./QuestionRow";

export function QuestionList({
  questions,
  onChange,
}: {
  questions: Question[];
  onChange: (qs: Question[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(questions, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        <motion.ol
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="space-y-3"
        >
          {questions.map((q, i) => (
            <motion.li
              key={q.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
              }}
            >
              <QuestionRow
                question={q}
                index={i}
                onUpdate={(next) => onChange(questions.map((qq) => (qq.id === q.id ? next : qq)))}
                onRemove={() => onChange(questions.filter((qq) => qq.id !== q.id))}
              />
            </motion.li>
          ))}
        </motion.ol>
      </SortableContext>
    </DndContext>
  );
}
