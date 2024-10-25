import React, { useState } from "react";
import { todoService } from "../services/todoService";
import { toast } from "react-toastify";

const ListTodo = ({ todos, fetchTodos, setTodos }) => {
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <ListItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          fetchTodos={fetchTodos}
        />
      ))}
    </div>
  );
};

export default ListTodo;

function ListItem({ todo, fetchTodos, todos, setTodos }) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }
    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
      console.log(todos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleSave = async (id, title) => {
    try {
      setIsLoading(true);
      await todoService.updateTodo(id, title);
      toast.success("Todo succesfully updated!", toastConfig);
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error updating todo", toastConfig);
    } finally {
      setIsLoading(false);
    }
  };
  const [text, setText] = useState(todo.title);
  return (
    <div className="rounded-2xl bg-white py-2 px-4">
      <div className="block sm:grid sm:grid-cols-3 sm:gap-2">
        <div className="flex gap-2 col-span-2 items-center">
          <span
            className=" text-[20px] cursor-pointer pt-1.5 pb-1 "
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.completed ? "✅" : "📌"}
          </span>
          <p
            className={`flex text-slate-900 text-[20px] pt-1.5 pb-1 cursor-pointer grow ${
              todo.completed ? "line-through" : ""
            }`}
            style={{ wordBreak: "break-all" }}
          >
            <input
              className="border- bg-slate-300 rounded-lg grow px-2 py-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </p>
        </div>
        <div className="flex justify-start sm:justify-end gap-2 items-center">
          <button
            className="bg-blue-900 rounded-lg text-white text-lg font-medium cursor-pointer px-3 py-1"
            onClick={() => handleSave(todo.id, text)}
          >
            {isLoading ? (
              <div
                className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
          <button
            className="bg-red-600 rounded-lg text-white text-lg font-medium cursor-pointer px-3 py-1"
            onClick={() => deleteTodo(todo.id)}
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
