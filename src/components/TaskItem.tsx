import { memo } from "react";
import type { Todo } from "@/interfaces/todo";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/date";
import Button from "@/components/Button";

interface TaskItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TaskItem = ({ todo, onToggle, onDelete, onEdit }: TaskItemProps) => (
  <div className="glass flex flex-col gap-3 rounded-2xl p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          aria-label={todo.completed ? "Aktif olarak işaretle" : "Tamamlandı olarak işaretle"}
          className={cn(
            "mt-1 h-5 w-5 rounded-md border border-slate-300",
            "flex items-center justify-center",
            todo.completed
              ? "bg-mint/80 text-emerald-900"
              : "bg-white",
            "dark:border-white/20 dark:bg-white/5"
          )}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed ? "✓" : ""}
        </button>
        <div>
          <p
            className={cn(
              "text-base font-semibold",
              todo.completed
                ? "text-slate-400 line-through"
                : "text-slate-900 dark:text-white"
            )}
          >
            {todo.title}
          </p>
          {todo.description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {todo.description}
            </p>
          ) : null}
          {todo.reminderAt ? (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Hatırlatıcı: {formatDateTime(todo.reminderAt)}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
            Güncellendi: {formatDateTime(todo.updatedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(todo)}
        >
          Düzenle
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(todo.id)}
        >
          Sil
        </Button>
      </div>
    </div>
  </div>
);

export default memo(TaskItem);
