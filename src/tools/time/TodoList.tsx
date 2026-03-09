import { useState, useEffect, useRef } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "webtools-todolist";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type Filter = "all" | "active" | "completed";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Focus edit input
  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const commitEdit = () => {
    if (editingId) {
      const text = editText.trim();
      if (text) {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, text } : t))
        );
      }
      setEditingId(null);
    }
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "active", label: "待办" },
    { key: "completed", label: "已完成" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="添加新任务..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          onClick={addTodo}
          className="shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          添加
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">
          {remaining} 项待办
        </span>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-1">
        {filtered.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors animate-[fadeIn_0.2s_ease-out]"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300 hover:border-indigo-400"
              }`}
            >
              {todo.completed && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Text / Edit */}
            {editingId === todo.id ? (
              <input
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 rounded-lg border border-indigo-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(todo)}
                className={`flex-1 text-sm cursor-default ${
                  todo.completed ? "line-through text-slate-400" : "text-slate-700"
                }`}
              >
                {todo.text}
              </span>
            )}

            {/* Actions */}
            <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(todo)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="编辑"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-6">
          {filter === "all" ? "暂无任务" : "暂无匹配任务"}
        </p>
      )}
    </div>
  );
}
