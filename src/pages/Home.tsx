import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import TaskList from "@/components/TaskList";
import FilterTabs from "@/components/FilterTabs";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ThemeToggle from "@/components/ThemeToggle";
import { useTodos } from "@/hooks/useTodos";
import { APP_NAME } from "@/constants/app";
import type { Todo } from "@/interfaces/todo";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/services/notifications";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/utils/date";

const VIRTUALIZATION_NOTICE_THRESHOLD = 200;
const DELETE_UNDO_TIMEOUT_MS = 5000;

const Home = () => {
  const {
    status,
    error,
    filter,
    counts,
    filteredTodos,
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    restoreTodo,
    toggleTodo,
    setFilter,
    clearError,
  } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [addFormError, setAddFormError] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editReminderAt, setEditReminderAt] = useState("");
  const [editFormError, setEditFormError] = useState<string | undefined>(undefined);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Todo | null>(null);
  const deleteUndoTimerRef = useRef<number | null>(null);
  const editTitleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (deleteUndoTimerRef.current) {
        window.clearTimeout(deleteUndoTimerRef.current);
      }
    };
  }, []);

  const completionRate = useMemo(() => {
    if (counts.total === 0) return 0;
    return Math.round((counts.completed / counts.total) * 100);
  }, [counts.completed, counts.total]);

  const ensureNotificationPermission = useCallback(async (hasReminder: boolean) => {
    if (!hasReminder) return true;
    const permission = getNotificationPermission();
    if (permission === "granted") return true;
    if (permission === "denied") return false;
    const requestedPermission = await requestNotificationPermission();
    return requestedPermission === "granted";
  }, []);

  const handleAdd = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        setAddFormError("Görev başlığı zorunludur.");
        return;
      }
      const reminderIso = fromDateTimeLocalValue(reminderAt);
      const hasPermission = await ensureNotificationPermission(Boolean(reminderIso));
      if (!hasPermission) {
        setAddFormError(
          "Hatırlatıcı bildirimi için tarayıcı bildirim iznini etkinleştir."
        );
        return;
      }
      addTodo(trimmedTitle, description.trim() || undefined, reminderIso);
      setTitle("");
      setDescription("");
      setReminderAt("");
      setAddFormError(undefined);
    },
    [addTodo, description, ensureNotificationPermission, reminderAt, title]
  );

  const handleEditOpen = useCallback((todo: Todo) => {
    setEditing(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setEditReminderAt(toDateTimeLocalValue(todo.reminderAt));
    setEditFormError(undefined);
  }, []);

  const handleEditSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!editing) return;
      const trimmedTitle = editTitle.trim();
      if (!trimmedTitle) {
        setEditFormError("Görev başlığı zorunludur.");
        return;
      }
      const reminderIso = fromDateTimeLocalValue(editReminderAt);
      const hasPermission = await ensureNotificationPermission(Boolean(reminderIso));
      if (!hasPermission) {
        setEditFormError(
          "Hatırlatıcı bildirimi için tarayıcı bildirim iznini etkinleştir."
        );
        return;
      }
      updateTodo(
        editing.id,
        trimmedTitle,
        editDescription.trim() || undefined,
        reminderIso
      );
      setEditing(null);
      setEditFormError(undefined);
    },
    [
      editDescription,
      editReminderAt,
      editTitle,
      editing,
      ensureNotificationPermission,
      updateTodo,
    ]
  );

  const handleEditClose = useCallback(() => {
    setEditing(null);
    setEditFormError(undefined);
  }, []);

  const handleDelete = useCallback(
    (todoId: string) => {
      const todoToDelete = todos.find((item) => item.id === todoId);
      if (!todoToDelete) return;
      deleteTodo(todoId);
      setRecentlyDeleted(todoToDelete);

      if (deleteUndoTimerRef.current) {
        window.clearTimeout(deleteUndoTimerRef.current);
      }
      deleteUndoTimerRef.current = window.setTimeout(() => {
        setRecentlyDeleted(null);
      }, DELETE_UNDO_TIMEOUT_MS);
    },
    [deleteTodo, todos]
  );

  const handleUndoDelete = useCallback(() => {
    if (!recentlyDeleted) return;
    restoreTodo(recentlyDeleted);
    setRecentlyDeleted(null);
    if (deleteUndoTimerRef.current) {
      window.clearTimeout(deleteUndoTimerRef.current);
      deleteUndoTimerRef.current = null;
    }
  }, [recentlyDeleted, restoreTodo]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_45%)] px-4 py-12 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_#1e293b,_#0b1120_45%)] dark:text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Kişisel Akış
            </p>
            <h1 className="mt-2 text-3xl font-bold">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Önceliklerini netleştir, şekillendir ve hayata geçir.
            </p>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3 md:max-w-sm">
            <ThemeToggle />
            <Card className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Tamamlanma</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-white/5">
                <div className="h-2 rounded-full bg-ember" style={{ width: `${completionRate}%` }} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {counts.completed} / {counts.total} görev tamamlandı
              </div>
            </Card>
          </div>
        </header>

        {error ? <ErrorState message={error} onDismiss={clearError} /> : null}

        {recentlyDeleted ? (
          <Card className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              "{recentlyDeleted.title}" silindi.
            </p>
            <Button variant="ghost" size="sm" onClick={handleUndoDelete}>
              Geri al
            </Button>
          </Card>
        ) : null}

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleAdd}>
            <div className="grid gap-4 md:grid-cols-[2fr_3fr]">
              <Input
                label="Görev başlığı"
                placeholder="Onboarding akışını tasarla"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                error={addFormError}
              />
              <Input
                label="Detaylar"
                placeholder="İsteğe bağlı notlar veya kontrol listesi"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <Input
              label="Hatırlatıcı (isteğe bağlı)"
              type="datetime-local"
              value={reminderAt}
              onChange={(event) => setReminderAt(event.target.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterTabs value={filter} onChange={setFilter} />
              <Button type="submit">Görev ekle</Button>
            </div>
          </form>
        </Card>

        {todos.length > VIRTUALIZATION_NOTICE_THRESHOLD ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Not: {VIRTUALIZATION_NOTICE_THRESHOLD}+ görevde liste sanallaştırması performansı artırır.
          </p>
        ) : null}

        {status === "loading" ? (
          <LoadingState />
        ) : filteredTodos.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={handleDelete}
            onEdit={handleEditOpen}
          />
        )}
      </div>

      <Modal
        isOpen={Boolean(editing)}
        title="Görevi düzenle"
        onClose={handleEditClose}
        initialFocusRef={editTitleInputRef}
        actions={
          <>
            <Button variant="ghost" onClick={handleEditClose}>
              İptal
            </Button>
            <Button type="submit" form="edit-task-form">
              Değişiklikleri kaydet
            </Button>
          </>
        }
      >
        <form id="edit-task-form" className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
          <Input
            ref={editTitleInputRef}
            label="Görev başlığı"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            error={editFormError}
          />
          <Input
            label="Detaylar"
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
          />
          <Input
            label="Hatırlatıcı (isteğe bağlı)"
            type="datetime-local"
            value={editReminderAt}
            onChange={(event) => setEditReminderAt(event.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Home;
