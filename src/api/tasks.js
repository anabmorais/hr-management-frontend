import { axiosInstance } from "../utils/api";

export const createTask = (name, color) =>
  axiosInstance
    .post("/tasks", {
      name,
      color
    })
    .then(response => response.data);

export const editTask = (taskId, name, color) =>
  axiosInstance
    .patch(`/tasks/${taskId}`, {
      name,
      color
    })
    .then(response => response.data);

export const deleteTask = taskId => axiosInstance.delete(`/tasks/${taskId}`).then(response => response.data);

export const getTasks = () => axiosInstance.get("/tasks").then(response => response.data);
