import axios from "axios";

const API_URL = "http://localhost:3001/auth";

export const loginApi = (data) => {
  return axios.post(`${API_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
