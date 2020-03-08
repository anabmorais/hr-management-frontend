import { axiosInstance } from "../utils/api";

export const createUser = (name, birthday, area) =>
axiosInstance
    .post("/users", {
      name,
      birthday,
      area
    })
    .then(response => response.data);

export const editUser = (userId, name, birthday, area) =>
axiosInstance
    .patch(`/users/${userId}`, {
      name,
      birthday,
      area
    })
    .then(response => response.data);

export const deleteUser = userId => axiosInstance.delete(`/users/${userId}`).then(response => response.data);

export const updateUserCredentials = (userId, username, password) =>
axiosInstance
    .put(`/users/${userId}/credentials`, {
      username,
      password
    })
    .then(response => response.data);

export const deleteUserCredentials = userId =>
axiosInstance.delete(`/users/${userId}/credentials`).then(response => response.data);

export const getUsers = () => axiosInstance.get("/users").then(response => response.data);

export const loginUser = (username, password) =>
axiosInstance
    .post("/users/login", {
      username,
      password
    })
    .then(response => response.data);
