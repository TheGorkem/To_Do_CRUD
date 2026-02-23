import type { Todo } from "@/interfaces/todo";
import TaskItem from "@/components/TaskItem";

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TaskList = ({ todos, onToggle, onDelete, onEdit }: TaskListProps) => (
  <div className="space-y-3">
    {todos.map((todo) => (
      <TaskItem
        key={todo.id}
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    ))}
  </div>
);

export default TaskList;
