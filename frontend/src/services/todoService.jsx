import axios from "axios";

const BASE_URL = "https://todo-app-with-react-fastapi.onrender.com";

export const todoService = {
  getAllTodos: async () => {
    const response = await axios.get(`${BASE_URL}/todos`);
    return response.data;
  },

  createTodo: async (title) => {
    const response = await axios.post(`${BASE_URL}/todos`, { title });
    return response.data;
  },

  toggleTodo: async (id) => {
    const response = await axios.put(`${BASE_URL}/todos/${id}/toggle`);
    return response.data;
  },

  deleteTodo: async (id) => {
    await axios.delete(`${BASE_URL}/todos/${id}`);
  },

  updateTodo: async (id, title) => {
    const response = await axios.put(`${BASE_URL}/todos/${id}`, { title });
    return response.data;
  },
};
