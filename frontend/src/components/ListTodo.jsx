import React, { useState } from "react";
import { todoService } from "../services/todoService";

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

  const updateTodo = async (id, title) => {
    try {
      await todoService.updateTodo(id, title);
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
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
            onClick={() => updateTodo(todo.id, text)}
          >
            Save
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
