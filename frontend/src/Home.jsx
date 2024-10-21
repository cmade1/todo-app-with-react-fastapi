import React, { useEffect, useState } from "react";
import ListTodo from "./components/ListTodo";
import Create from "./components/Create";
import { todoService } from "./services/todoService";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleNewTodo = async (e) => {
    e.preventDefault();
    if (value === "") return;
    try {
      await todoService.createTodo(value);
      setValue("");
      await fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="bg-gray-600 w-full max-w-2xl p-7 min-h-[550px] rounded-2xl">
      <h1 className="text-4xl font-semibold mb-6 text-white"> 📝 To-Do List</h1>
      <Create
        handleNewTodo={handleNewTodo}
        todos={todos}
        setTodos={setTodos}
        setValue={setValue}
        value={value}
      />
      <ListTodo todos={todos} setTodos={setTodos} fetchTodos={fetchTodos} />
    </div>
  );
};

export default Home;
