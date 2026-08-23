import api from "./axios";

export const registerUser = (data) => {
  return api.post("/users/register", data);
};

export const loginUser = (data) => {
  return api.post("/users/login", data);
};

export const logoutUser = () => {
  return api.post("/users/logout-user");
};

export const getCurrentUser = () => {
  return api.get("/users/get-current-user");
};

export const refreshAccessToken = () => {
  return api.post("/users/refresh-access-token");
};
